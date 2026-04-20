package com.pricecomp.scraper;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Utility: shared HTTP fetch with retries.
 */
@Component
@Slf4j
public class ScraperUtils {

    @Value("${app.scraper.user-agent}")
    private String userAgent;

    @Value("${app.scraper.timeout-ms}")
    private int timeoutMs;

    public Optional<Document> fetch(String url) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                Document doc = Jsoup.connect(url)
                        .userAgent(userAgent)
                        .timeout(timeoutMs)
                        .followRedirects(true)
                        .get();
                return Optional.of(doc);
            } catch (Exception e) {
                log.warn("Fetch attempt {} failed for {}: {}", attempt, url, e.getMessage());
                if (attempt < 3) {
                    try { Thread.sleep(2000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                }
            }
        }
        return Optional.empty();
    }

    /** Strip ₹, commas, spaces and parse to BigDecimal. */
    public BigDecimal parsePriceText(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String cleaned = raw.replaceAll("[^0-9.]", "");
        if (cleaned.isBlank()) return null;
        try { return new BigDecimal(cleaned); } catch (NumberFormatException e) { return null; }
    }
}

// ─────────────────────────────────────────────────────────
//  Scrape result DTO (internal use only)
// ─────────────────────────────────────────────────────────
record ScrapeResult(
    BigDecimal price,
    BigDecimal originalPrice,
    BigDecimal discountPct,
    boolean inStock,
    BigDecimal rating,
    Integer reviewCount
) {}

// ─────────────────────────────────────────────────────────
//  Amazon scraper
// ─────────────────────────────────────────────────────────
@Component
@Slf4j
class AmazonScraper {

    private final ScraperUtils utils;
    AmazonScraper(ScraperUtils utils) { this.utils = utils; }

    public Optional<ScrapeResult> scrape(String listingUrl) {
        return utils.fetch(listingUrl).map(doc -> {
            // Price: #priceblock_ourprice or .a-price .a-offscreen
            BigDecimal price = null;
            Element priceEl = doc.selectFirst("#priceblock_ourprice, .a-price .a-offscreen, #apex_offerDisplay_desktop span.a-price span");
            if (priceEl != null) price = utils.parsePriceText(priceEl.text());

            // Original / MRP
            BigDecimal originalPrice = null;
            Element mrpEl = doc.selectFirst(".a-text-price .a-offscreen, #listPrice");
            if (mrpEl != null) originalPrice = utils.parsePriceText(mrpEl.text());

            // Discount
            BigDecimal discount = null;
            Element discEl = doc.selectFirst(".savingsPercentage");
            if (discEl != null) discount = utils.parsePriceText(discEl.text().replace("-", "").replace("%", ""));

            // Stock
            boolean inStock = doc.select("#availability span.a-color-success").size() > 0
                    || doc.select("#add-to-cart-button").size() > 0;

            // Rating
            BigDecimal rating = null;
            Element ratingEl = doc.selectFirst("span.a-icon-alt");
            if (ratingEl != null) {
                String ratingText = ratingEl.text().split(" ")[0];
                try { rating = new BigDecimal(ratingText); } catch (Exception ignored) {}
            }

            // Review count
            Integer reviewCount = null;
            Element reviewEl = doc.selectFirst("#acrCustomerReviewText");
            if (reviewEl != null) {
                String countText = reviewEl.text().replaceAll("[^0-9]", "");
                if (!countText.isBlank()) reviewCount = Integer.parseInt(countText);
            }

            log.info("Amazon scraped {} → price={}", listingUrl, price);
            return new ScrapeResult(price, originalPrice, discount, inStock, rating, reviewCount);
        });
    }
}

// ─────────────────────────────────────────────────────────
//  Flipkart scraper
// ─────────────────────────────────────────────────────────
@Component
@Slf4j
class FlipkartScraper {

    private final ScraperUtils utils;
    FlipkartScraper(ScraperUtils utils) { this.utils = utils; }

    public Optional<ScrapeResult> scrape(String listingUrl) {
        return utils.fetch(listingUrl).map(doc -> {
            // Price
            BigDecimal price = null;
            Element priceEl = doc.selectFirst("div._30jeq3, div._16Jk6d");
            if (priceEl != null) price = utils.parsePriceText(priceEl.text());

            // Original price
            BigDecimal originalPrice = null;
            Element mrpEl = doc.selectFirst("div._3I9_wc");
            if (mrpEl != null) originalPrice = utils.parsePriceText(mrpEl.text());

            // Discount
            BigDecimal discount = null;
            Element discEl = doc.selectFirst("div._3Ay6Sb");
            if (discEl != null) discount = utils.parsePriceText(discEl.text().replace("%", "").replace("off", "").trim());

            // Stock
            boolean inStock = doc.select("button._2KpZ6l, button._1cqbm5").size() > 0;

            // Rating
            BigDecimal rating = null;
            Element ratingEl = doc.selectFirst("div._3LWZlK");
            if (ratingEl != null) {
                try { rating = new BigDecimal(ratingEl.text()); } catch (Exception ignored) {}
            }

            // Reviews
            Integer reviewCount = null;
            Element reviewEl = doc.selectFirst("span._2_R_DZ span");
            if (reviewEl != null) {
                String ct = reviewEl.text().replaceAll("[^0-9]", "");
                if (!ct.isBlank()) reviewCount = Integer.parseInt(ct);
            }

            log.info("Flipkart scraped {} → price={}", listingUrl, price);
            return new ScrapeResult(price, originalPrice, discount, inStock, rating, reviewCount);
        });
    }
}

// ─────────────────────────────────────────────────────────
//  Croma scraper
// ─────────────────────────────────────────────────────────
@Component
@Slf4j
class CromaScraper {

    private final ScraperUtils utils;
    CromaScraper(ScraperUtils utils) { this.utils = utils; }

    public Optional<ScrapeResult> scrape(String listingUrl) {
        return utils.fetch(listingUrl).map(doc -> {
            BigDecimal price = null;
            Element priceEl = doc.selectFirst(".pdp-selling-price, .amount");
            if (priceEl != null) price = utils.parsePriceText(priceEl.text());

            BigDecimal originalPrice = null;
            Element mrpEl = doc.selectFirst(".pdp-mrp");
            if (mrpEl != null) originalPrice = utils.parsePriceText(mrpEl.text());

            boolean inStock = doc.select("button.add-to-cart").size() > 0;

            log.info("Croma scraped {} → price={}", listingUrl, price);
            return new ScrapeResult(price, originalPrice, null, inStock, null, null);
        });
    }
}

// ─────────────────────────────────────────────────────────
//  ScraperFactory – delegates to the right scraper by store
// ─────────────────────────────────────────────────────────
@Component
class ScraperFactory {

    private final AmazonScraper amazon;
    private final FlipkartScraper flipkart;
    private final CromaScraper croma;

    ScraperFactory(AmazonScraper amazon, FlipkartScraper flipkart, CromaScraper croma) {
        this.amazon   = amazon;
        this.flipkart = flipkart;
        this.croma    = croma;
    }

    public Optional<ScrapeResult> scrape(String storeName, String listingUrl) {
        return switch (storeName.toLowerCase()) {
            case "amazon"   -> amazon.scrape(listingUrl);
            case "flipkart" -> flipkart.scrape(listingUrl);
            case "croma"    -> croma.scrape(listingUrl);
            default         -> Optional.empty();
        };
    }
}
