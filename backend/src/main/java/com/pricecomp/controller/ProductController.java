package com.pricecomp.controller;

import com.pricecomp.dto.*;
import com.pricecomp.service.ProductService;
import com.pricecomp.service.ScraperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ─────────────────────────────────────────────────────────
//  ProductController  /api/products
// ─────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** GET /api/products/search?q=iphone+15 */
    @GetMapping("/search")
    public ResponseEntity<List<ProductSummaryDto>> search(@RequestParam String q) {
        if (q == null || q.isBlank())
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productService.search(q));
    }

    /** GET /api/products/category/{slug} */
    @GetMapping("/category/{slug}")
    public ResponseEntity<List<ProductSummaryDto>> byCategory(@PathVariable String slug) {
        return ResponseEntity.ok(productService.byCategory(slug));
    }

    /** GET /api/products/{id}/compare */
    @GetMapping("/{id}/compare")
    public ResponseEntity<ProductCompareDto> compare(@PathVariable Long id) {
        return productService.compareProduct(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/products/{id}/history */
    @GetMapping("/{id}/history")
    public ResponseEntity<Map<String, List<PricePointDto>>> history(@PathVariable Long id) {
        return ResponseEntity.ok(productService.priceHistory(id));
    }
}

// ─────────────────────────────────────────────────────────
// ScraperController /api/scraper
// ─────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/scraper")
@RequiredArgsConstructor
class ScraperController {

    private final ScraperService scraperService;

    /** POST /api/scraper/trigger { "productId": 5 } */
    @PostMapping("/trigger")
    public ResponseEntity<String> trigger(@RequestBody ScrapeRequestDto req) {
        scraperService.scrapeProduct(req.getProductId());
        return ResponseEntity.ok("Scrape triggered for product " + req.getProductId());
    }

    /** POST /api/scraper/trigger-all (admin use) */
    @PostMapping("/trigger-all")
    public ResponseEntity<String> triggerAll() {
        scraperService.scrapeAll();
        return ResponseEntity.ok("Full scrape complete");
    }
}
