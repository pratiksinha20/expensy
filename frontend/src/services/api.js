import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// ── Products ──────────────────────────────────────────────

export const searchProducts = (query) =>
  api.get('/products/search', { params: { q: query } }).then(r => r.data)

export const getProductsByCategory = (slug) =>
  api.get(`/products/category/${slug}`).then(r => r.data)

export const compareProduct = (id) =>
  api.get(`/products/${id}/compare`).then(r => r.data)

export const getPriceHistory = (id) =>
  api.get(`/products/${id}/history`).then(r => r.data)

// ── Scraper ───────────────────────────────────────────────

export const triggerScrape = (productId) =>
  api.post('/scraper/trigger', { productId }).then(r => r.data)
