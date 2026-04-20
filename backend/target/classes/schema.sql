-- ============================================================
--  Price Comparator – PostgreSQL Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS stores (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    base_url    VARCHAR(255) NOT NULL,
    logo_url    VARCHAR(255),
    active      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(500) NOT NULL,
    brand           VARCHAR(200),
    model_number    VARCHAR(200),
    category_id     BIGINT REFERENCES categories(id),
    image_url       VARCHAR(500),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS product_listings (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id        BIGINT NOT NULL REFERENCES stores(id),
    listing_url     VARCHAR(1000) NOT NULL,
    current_price   NUMERIC(12,2),
    original_price  NUMERIC(12,2),
    discount_pct    NUMERIC(5,2),
    in_stock        BOOLEAN DEFAULT TRUE,
    rating          NUMERIC(3,2),
    review_count    INTEGER DEFAULT 0,
    last_scraped_at TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, store_id)
);

CREATE INDEX idx_listings_product ON product_listings(product_id);
CREATE INDEX idx_listings_store ON product_listings(store_id);
CREATE INDEX idx_listings_price ON product_listings(current_price);

CREATE TABLE IF NOT EXISTS price_history (
    id              BIGSERIAL PRIMARY KEY,
    listing_id      BIGINT NOT NULL REFERENCES product_listings(id) ON DELETE CASCADE,
    price           NUMERIC(12,2) NOT NULL,
    in_stock        BOOLEAN,
    recorded_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_price_history_listing ON price_history(listing_id);
CREATE INDEX idx_price_history_date    ON price_history(recorded_at);

-- Seed stores
INSERT INTO stores (name, base_url, logo_url) VALUES
  ('Amazon',   'https://www.amazon.in',   'https://logo.clearbit.com/amazon.in'),
  ('Flipkart', 'https://www.flipkart.com','https://logo.clearbit.com/flipkart.com'),
  ('Myntra',   'https://www.myntra.com',  'https://logo.clearbit.com/myntra.com'),
  ('Croma',    'https://www.croma.com',   'https://logo.clearbit.com/croma.com'),
  ('Reliance Digital', 'https://www.reliancedigital.in', 'https://logo.clearbit.com/reliancedigital.in')
ON CONFLICT (name) DO NOTHING;

-- Seed categories
INSERT INTO categories (name, slug) VALUES
  ('Smartphones',    'smartphones'),
  ('Laptops',        'laptops'),
  ('Washing Machines','washing-machines'),
  ('Televisions',    'televisions'),
  ('Headphones',     'headphones'),
  ('Tablets',        'tablets')
ON CONFLICT (name) DO NOTHING;
