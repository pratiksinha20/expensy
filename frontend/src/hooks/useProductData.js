import { useState, useEffect, useCallback } from 'react'
import { searchProducts, compareProduct, getPriceHistory, getProductsByCategory, triggerScrape } from '../services/api'
import { MOCK_PRODUCTS, getMockCompareData, MOCK_PRICE_HISTORY } from '../data/mockData'

// ── useSearch ─────────────────────────────────────────────
export function useSearch() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = useCallback(async (q) => {
    if (!q?.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const data = await searchProducts(q)
      setResults(data)
    } catch (e) {
      // Fallback to mock data
      const filtered = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      )
      setResults(filtered)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => search(query), 400)
    return () => clearTimeout(t)
  }, [query, search])

  return { query, setQuery, results, loading, error }
}

// ── useCompare ────────────────────────────────────────────
export function useCompare(productId) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    setError(null)
    compareProduct(productId)
      .then(setData)
      .catch(() => {
        // Fallback to mock data
        const mockData = getMockCompareData(productId)
        if (mockData) {
          setData(mockData)
        } else {
          setError('Failed to load product data.')
        }
      })
      .finally(() => setLoading(false))
  }, [productId])

  const refresh = useCallback(() => {
    if (!productId) return
    triggerScrape(productId).then(() => {
      setTimeout(() => {
        compareProduct(productId).then(setData).catch(() => {})
      }, 3000)
    }).catch(() => {})
  }, [productId])

  return { data, loading, error, refresh }
}

// ── usePriceHistory ───────────────────────────────────────
export function usePriceHistory(productId) {
  const [history, setHistory] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    getPriceHistory(productId)
      .then(setHistory)
      .catch(() => {
        // Fallback to mock data
        setHistory(MOCK_PRICE_HISTORY)
      })
      .finally(() => setLoading(false))
  }, [productId])

  return { history, loading }
}

// ── useCategory ───────────────────────────────────────────
export function useCategory(slug) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProductsByCategory(slug)
      .then(setProducts)
      .catch(() => {
        // Fallback to mock data
        const filtered = MOCK_PRODUCTS.filter(p => p.category === slug)
        setProducts(filtered)
      })
      .finally(() => setLoading(false))
  }, [slug])

  return { products, loading, error }
}
