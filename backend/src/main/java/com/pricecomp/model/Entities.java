package com.pricecomp.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// ─────────────────────────────────────────────
//  Category
// ─────────────────────────────────────────────
@Entity @Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String slug;
}

// ─────────────────────────────────────────────
//  Store
// ─────────────────────────────────────────────
@Entity @Table(name = "stores")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
class Store {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String baseUrl;
    private String logoUrl;
    private boolean active;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

// ─────────────────────────────────────────────
//  Product
// ─────────────────────────────────────────────
@Entity @Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String modelNumber;
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductListing> listings;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}

// ─────────────────────────────────────────────
//  ProductListing  (one product × one store)
// ─────────────────────────────────────────────
@Entity @Table(name = "product_listings",
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id","store_id"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
class ProductListing {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "listing_url", nullable = false)
    private String listingUrl;

    @Column(name = "current_price", precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "discount_pct", precision = 5, scale = 2)
    private BigDecimal discountPct;

    @Column(name = "in_stock")
    private boolean inStock = true;

    private BigDecimal rating;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "last_scraped_at")
    private LocalDateTime lastScrapedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PriceHistory> priceHistory;
}

// ─────────────────────────────────────────────
//  PriceHistory
// ─────────────────────────────────────────────
@Entity @Table(name = "price_history")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
class PriceHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private ProductListing listing;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "in_stock")
    private boolean inStock;

    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();
}
