package com.pricecomp.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// ── Search result (lightweight) ──────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductSummaryDto {
    private Long id;
    private String name;
    private String brand;
    private String imageUrl;
    private String categoryName;
    private BigDecimal lowestPrice;
    private BigDecimal highestPrice;
    private int storeCount;
}

// ── Single store listing inside compare view ─────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ListingDto {
    private Long listingId;
    private Long storeId;
    private String storeName;
    private String storeLogoUrl;
    private String listingUrl;
    private BigDecimal currentPrice;
    private BigDecimal originalPrice;
    private BigDecimal discountPct;
    private boolean inStock;
    private BigDecimal rating;
    private Integer reviewCount;
    private LocalDateTime lastScrapedAt;
    private boolean lowestPrice;   // convenience flag for the UI
}

// ── Full compare response ─────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductCompareDto {
    private Long productId;
    private String name;
    private String brand;
    private String modelNumber;
    private String imageUrl;
    private String description;
    private String categoryName;
    private List<ListingDto> listings;
}

// ── Price history point ───────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PricePointDto {
    private LocalDateTime date;
    private BigDecimal price;
    private String storeName;
}

// ── Scrape request (manual trigger) ──────────────────────
@Data @NoArgsConstructor @AllArgsConstructor
public class ScrapeRequestDto {
    private Long productId;   // scrape all stores for this product
}
