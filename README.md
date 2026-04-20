# PriceHunt — E-commerce Price Comparator

Compare prices across Amazon, Flipkart, Myntra, Croma and more.

**Stack:** React 18 + Vite | Spring Boot 3 + Java 17 | PostgreSQL 15 | Jsoup scraper

---

## Project structure

```
price-comparator/
├── frontend/               ← React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/     ← Navbar, ProductCard, PriceHistoryChart, etc.
│   │   ├── hooks/          ← useSearch, useCompare, usePriceHistory
│   │   ├── pages/          ← Home, Search, Category, Compare
│   │   └── services/       ← Axios API calls
│   └── package.json
│
└── backend/                ← Spring Boot REST API
    ├── pom.xml
    └── src/main/
        ├── java/com/pricecomp/
        │   ├── model/       ← JPA entities (Product, Store, ProductListing, PriceHistory)
        │   ├── repository/  ← Spring Data JPA repos
        │   ├── service/     ← ProductService, ScraperService
        │   ├── controller/  ← REST endpoints
        │   ├── scraper/     ← Jsoup scrapers per store + factory
        │   └── scheduler/   ← Scheduled price refresh
        └── resources/
            ├── application.properties
            └── schema.sql   ← Creates all tables + seeds stores/categories
```

---

## Step 1 — Set up PostgreSQL

Install PostgreSQL if you don't have it:
```bash
# Ubuntu / Debian
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@15 && brew services start postgresql@15

# Windows → download installer from https://www.postgresql.org/download/windows/
```

Create the database and user:
```sql
psql -U postgres

CREATE DATABASE pricecomp;
CREATE USER priceuser WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE pricecomp TO priceuser;
\q
```

---

## Step 2 — Configure the backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pricecomp
spring.datasource.username=priceuser
spring.datasource.password=yourpassword
```

The `schema.sql` file runs automatically on first start and creates all tables + seeds
the stores (Amazon, Flipkart, Myntra, Croma, Reliance Digital) and categories.

---

## Step 3 — Run the backend

You need Java 17+ and Maven 3.8+.

```bash
cd backend
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

The API starts at http://localhost:8080

### Test the API

```bash
# Search products
curl "http://localhost:8080/api/products/search?q=iphone"

# Compare a product (replace 1 with a real product ID)
curl "http://localhost:8080/api/products/1/compare"

# Manually trigger a price scrape
curl -X POST http://localhost:8080/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'
```

---

## Step 4 — Run the frontend

You need Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` requests to `localhost:8080` automatically.

---

## Step 5 — Seed your first products (important!)

The app compares prices for products in your database. You need to insert products
and their store listing URLs manually the first time. After that, the scraper keeps
prices updated automatically.

**Example SQL to add an iPhone 15:**
```sql
-- Insert the product
INSERT INTO products (name, brand, model_number, category_id, image_url)
VALUES (
  'Apple iPhone 15 (128GB, Black)',
  'Apple', 'MTLN3HN/A',
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://m.media-amazon.com/images/I/61lDtKK+d9L.jpg'
);

-- Add Amazon listing (replace URL with the real product URL)
INSERT INTO product_listings (product_id, store_id, listing_url)
VALUES (
  (SELECT id FROM products WHERE model_number = 'MTLN3HN/A'),
  (SELECT id FROM stores WHERE name = 'Amazon'),
  'https://www.amazon.in/dp/B0CHX3QBCH'
);

-- Add Flipkart listing
INSERT INTO product_listings (product_id, store_id, listing_url)
VALUES (
  (SELECT id FROM products WHERE model_number = 'MTLN3HN/A'),
  (SELECT id FROM stores WHERE name = 'Flipkart'),
  'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itmbf14ef54f645d'
);

-- Add Croma listing
INSERT INTO product_listings (product_id, store_id, listing_url)
VALUES (
  (SELECT id FROM products WHERE model_number = 'MTLN3HN/A'),
  (SELECT id FROM stores WHERE name = 'Croma'),
  'https://www.croma.com/apple-iphone-15/p/265523'
);
```

Then trigger the first scrape:
```bash
curl -X POST http://localhost:8080/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'
```

---

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/search?q={query}` | Full-text search |
| GET | `/api/products/category/{slug}` | Browse by category |
| GET | `/api/products/{id}/compare` | All store prices for one product |
| GET | `/api/products/{id}/history` | Price history for charts |
| POST | `/api/scraper/trigger` | Manual scrape `{"productId": N}` |
| POST | `/api/scraper/trigger-all` | Scrape everything |

---

## How the scraper works

1. The `ScraperFactory` looks at the store name and delegates to the matching scraper class
   (`AmazonScraper`, `FlipkartScraper`, `CromaScraper`, …).
2. Each scraper uses Jsoup to fetch the product page and extract price, original price,
   discount %, stock status, rating, and review count using CSS selectors.
3. If the price changed from the last scrape, a new `price_history` row is saved.
4. `PriceScraperScheduler` runs every 6 hours (configurable in `application.properties`).

### Adding a new store

1. Create a new `@Component` class (e.g. `MyntraScraper`) with a `scrape(url)` method.
2. Register it in `ScraperFactory.scrape()` with the store name as a case.
3. Insert the store into the `stores` table.
4. Add listing URLs for your products.

---

## Build for production

**Backend:**
```bash
cd backend
./mvnw package -DskipTests
java -jar target/price-comparator-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# dist/ folder is the static build — serve with Nginx or any CDN
```

**Nginx config snippet** (serves frontend + proxies API):
```nginx
server {
  listen 80;
  root /var/www/price-comparator/dist;
  index index.html;

  location /api/ {
    proxy_pass http://localhost:8080/api/;
    proxy_set_header Host $host;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Common issues

**"price is null after scraping"** — E-commerce sites change their HTML structure
frequently. Open the product URL in a browser, inspect the price element, and update
the CSS selector in the matching scraper class.

**"relation does not exist" on startup** — Make sure `spring.sql.init.mode=always`
is set and the database user has CREATE TABLE permission.

**CORS errors in browser** — Check that `app.cors.allowed-origins` in
`application.properties` includes the frontend URL (default: `http://localhost:5173`).

**Scraper gets blocked (403 / CAPTCHA)** — Add a random delay between requests or
rotate the user-agent string. For production, consider using a proxy service or
official retailer APIs (Flipkart Affiliate API, Amazon Product Advertising API).
