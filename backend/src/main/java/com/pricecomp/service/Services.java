package com.pricecomp.service;

import com.pricecomp.dto.*;
import com.pricecomp.model.*;
import com.pricecomp.repository.*;
import com.pricecomp.scraper.ScraperFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// ─────────────────────────────────────────────────────────
//  ProductService
// ─────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepo;
    private final ProductListingRepository listingRepo;
    private final PriceHistoryRepository historyRepo;

    /** Search products by keyword. */
    public List<ProductSummaryDto> search(String query) {
        List<Product> products = productRepo.searchByText(query);
        return products.stream().map(this::toSummary).collect(Collectors.toList());
    }

    /** Get all products in a category. */
    public List<ProductSummaryDto> byCategory(String slug) {
        return productRepo.findByCategorySlug(slug)
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    /** Full compare view: product + all store listings ordered by price. */
    @Transactional(readOnly = true)
    public Optional<ProductCompareDto> compareProduct(Long productId) {
        return productRepo.findById(productId).map(product -> {
            List<ProductListing> listings = listingRepo.findByProductIdOrderedByPrice(productId);

            BigDecimal lowestPrice = listings.stream()
                    .map(ProductListing::getCurrentPrice)
                    .filter(Objects::nonNull)
                    .min(Comparator.naturalOrder())
                    .orElse(null);

            List<ListingDto> listingDtos = listings.stream().map(l -> ListingDto.builder()
                    .listingId(l.getId())
                    .storeId(l.getStore().getId())
                    .storeName(l.getStore().getName())
                    .storeLogoUrl(l.getStore().getLogoUrl())
                    .listingUrl(l.getListingUrl())
                    .currentPrice(l.getCurrentPrice())
                    .originalPrice(l.getOriginalPrice())
                    .discountPct(l.getDiscountPct())
                    .inStock(l.isInStock())
                    .rating(l.getRating())
                    .reviewCount(l.getReviewCount())
                    .lastScrapedAt(l.getLastScrapedAt())
                    .lowestPrice(lowestPrice != null && lowestPrice.equals(l.getCurrentPrice()))
                    .build()
            ).collect(Collectors.toList());

            return ProductCompareDto.builder()
                    .productId(product.getId())
                    .name(product.getName())
                    .brand(product.getBrand())
                    .modelNumber(product.getModelNumber())
                    .imageUrl(product.getImageUrl())
                    .description(product.getDescription())
                    .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                    .listings(listingDtos)
                    .build();
        });
    }

    /** Price history for one product across all stores (for chart). */
    public Map<String, List<PricePointDto>> priceHistory(Long productId) {
        List<ProductListing> listings = listingRepo.findByProductId(productId);
        Map<String, List<PricePointDto>> result = new LinkedHashMap<>();
        for (ProductListing listing : listings) {
            String storeName = listing.getStore().getName();
            List<PricePointDto> points = historyRepo.findByListingId(listing.getId())
                    .stream()
                    .map(ph -> PricePointDto.builder()
                            .date(ph.getRecordedAt())
                            .price(ph.getPrice())
                            .storeName(storeName)
                            .build())
                    .collect(Collectors.toList());
            result.put(storeName, points);
        }
        return result;
    }

    // ── internal helpers ──────────────────────────────────

    private ProductSummaryDto toSummary(Product p) {
        List<ProductListing> listings = listingRepo.findByProductId(p.getId());

        BigDecimal lowest  = listings.stream().map(ProductListing::getCurrentPrice)
                .filter(Objects::nonNull).min(Comparator.naturalOrder()).orElse(null);
        BigDecimal highest = listings.stream().map(ProductListing::getCurrentPrice)
                .filter(Objects::nonNull).max(Comparator.naturalOrder()).orElse(null);

        return ProductSummaryDto.builder()
                .id(p.getId())
                .name(p.getName())
                .brand(p.getBrand())
                .imageUrl(p.getImageUrl())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .lowestPrice(lowest)
                .highestPrice(highest)
                .storeCount(listings.size())
                .build();
    }
}

// ─────────────────────────────────────────────────────────
//  ScraperService
// ─────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
class ScraperService {

    private final ProductListingRepository listingRepo;
    private final PriceHistoryRepository   historyRepo;
    private final ScraperFactory           scraperFactory;

    /** Scrape all listings for a product and persist updated prices. */
    @Transactional
    public void scrapeProduct(Long productId) {
        List<ProductListing> listings = listingRepo.findByProductId(productId);
        for (ProductListing listing : listings) {
            scrapeAndPersist(listing);
        }
    }

    /** Scrape every listing in the database (called by scheduler). */
    @Transactional
    public void scrapeAll() {
        log.info("Starting scheduled full scrape...");
        List<ProductListing> all = listingRepo.findAll();
        for (ProductListing listing : all) {
            scrapeAndPersist(listing);
        }
        log.info("Scheduled scrape complete – processed {} listings", all.size());
    }

    private void scrapeAndPersist(ProductListing listing) {
        String storeName = listing.getStore().getName();
        scraperFactory.scrape(storeName, listing.getListingUrl()).ifPresent(result -> {
            BigDecimal oldPrice = listing.getCurrentPrice();

            listing.setCurrentPrice(result.price());
            listing.setOriginalPrice(result.originalPrice());
            listing.setDiscountPct(result.discountPct());
            listing.setInStock(result.inStock());
            if (result.rating()      != null) listing.setRating(result.rating());
            if (result.reviewCount() != null) listing.setReviewCount(result.reviewCount());
            listing.setLastScrapedAt(LocalDateTime.now());
            listingRepo.save(listing);

            // Record history whenever price changes or is first scrape
            if (result.price() != null &&
                    (oldPrice == null || oldPrice.compareTo(result.price()) != 0)) {
                PriceHistory history = PriceHistory.builder()
                        .listing(listing)
                        .price(result.price())
                        .inStock(result.inStock())
                        .build();
                historyRepo.save(history);
                log.info("Price change recorded: listing={} {} → {}", listing.getId(), oldPrice, result.price());
            }
        });
    }
}
