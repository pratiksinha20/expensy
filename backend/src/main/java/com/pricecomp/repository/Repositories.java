package com.pricecomp.repository;

import com.pricecomp.model.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Full-text search across name + brand
    @Query(value = """
            SELECT * FROM products
            WHERE to_tsvector('english', name || ' ' || COALESCE(brand,''))
                  @@ plainto_tsquery('english', :query)
            ORDER BY name
            LIMIT 50
            """, nativeQuery = true)
    List<Product> searchByText(@Param("query") String query);

    List<Product> findByCategorySlug(String slug);

    List<Product> findByBrandIgnoreCase(String brand);
}

@Repository
public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {

    List<ProductListing> findByProductId(Long productId);

    @Query("""
            SELECT pl FROM ProductListing pl
            JOIN FETCH pl.store s
            WHERE pl.product.id = :productId
            ORDER BY pl.currentPrice ASC NULLS LAST
            """)
    List<ProductListing> findByProductIdOrderedByPrice(@Param("productId") Long productId);

    Optional<ProductListing> findByProductIdAndStoreId(Long productId, Long storeId);
}

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    @Query("""
            SELECT ph FROM PriceHistory ph
            WHERE ph.listing.id = :listingId
            ORDER BY ph.recordedAt DESC
            """)
    List<PriceHistory> findByListingId(@Param("listingId") Long listingId);

    @Query("""
            SELECT ph FROM PriceHistory ph
            WHERE ph.listing.product.id = :productId
              AND ph.listing.store.id   = :storeId
            ORDER BY ph.recordedAt ASC
            """)
    List<PriceHistory> findByProductAndStore(@Param("productId") Long productId,
            @Param("storeId") Long storeId);
}

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByActiveTrue();

    Optional<Store> findByNameIgnoreCase(String name);
}

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
}
