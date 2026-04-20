// Mock data for demonstration when backend is not running
// This provides rich, realistic data for the UI

export const STORE_INFO = {
  Amazon: {
    name: 'Amazon',
    color: '#FF9900',
    textColor: '#FF9900',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    bgClass: 'store-amazon',
  },
  Flipkart: {
    name: 'Flipkart',
    color: '#2874F0',
    textColor: '#2874F0',
    logo: 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg',
    bgClass: 'store-flipkart',
  },
  Myntra: {
    name: 'Myntra',
    color: '#FF3465',
    textColor: '#FF3465',
    logo: 'https://aartisto.com/wp-content/uploads/2020/11/myntra.png',
    bgClass: 'store-myntra',
  },
  Ajio: {
    name: 'Ajio',
    color: '#4A0E4E',
    textColor: '#9B59B6',
    logo: 'https://assets.ajio.com/static/img/Ajio-Logo.svg',
    bgClass: 'store-ajio',
  },
  Croma: {
    name: 'Croma',
    color: '#16A34A',
    textColor: '#16A34A',
    logo: 'https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Homepage/Icon/croma-icon_uqhvox.png',
    bgClass: 'store-croma',
  },
  'Reliance Digital': {
    name: 'Reliance Digital',
    color: '#1D4ED8',
    textColor: '#3B82F6',
    logo: '',
    bgClass: 'store-reliance',
  },
}

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    brand: 'Apple',
    category: 'smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg',
    lowestPrice: 144900,
    highestPrice: 159900,
    storeCount: 4,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
    brand: 'Samsung',
    category: 'smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71lSEneNIjL._SL1500_.jpg',
    lowestPrice: 129999,
    highestPrice: 144999,
    storeCount: 5,
  },
  {
    id: 3,
    name: 'Apple MacBook Air M3 (15-inch, 16GB, 512GB SSD)',
    brand: 'Apple',
    category: 'laptops',
    imageUrl: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg',
    lowestPrice: 144900,
    highestPrice: 164900,
    storeCount: 3,
  },
  {
    id: 4,
    name: 'Sony Bravia 55" 4K OLED Smart TV (XR-55A80L)',
    brand: 'Sony',
    category: 'televisions',
    imageUrl: 'https://m.media-amazon.com/images/I/81GwFKS1TkL._SL1500_.jpg',
    lowestPrice: 129990,
    highestPrice: 149990,
    storeCount: 4,
  },
  {
    id: 5,
    name: 'OnePlus 12 5G (16GB RAM, 256GB, Flowy Emerald)',
    brand: 'OnePlus',
    category: 'smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/71L1k-b9OeL._SL1500_.jpg',
    lowestPrice: 64999,
    highestPrice: 69999,
    storeCount: 4,
  },
  {
    id: 6,
    name: 'LG 9kg Front Load Washing Machine (FHV1409ZWB)',
    brand: 'LG',
    category: 'washing-machines',
    imageUrl: 'https://m.media-amazon.com/images/I/71P8yb1t-AL._SL1500_.jpg',
    lowestPrice: 42990,
    highestPrice: 54990,
    storeCount: 3,
  },
  {
    id: 7,
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'headphones',
    imageUrl: 'https://m.media-amazon.com/images/I/61+btxzpfDL._SL1500_.jpg',
    lowestPrice: 24990,
    highestPrice: 34990,
    storeCount: 5,
  },
  {
    id: 8,
    name: 'Apple iPad Air M2 (11-inch, Wi-Fi, 256GB)',
    brand: 'Apple',
    category: 'tablets',
    imageUrl: 'https://m.media-amazon.com/images/I/61lNKdVdcAL._SL1500_.jpg',
    lowestPrice: 69900,
    highestPrice: 84900,
    storeCount: 3,
  },
  {
    id: 9,
    name: 'Nike Air Max 270 React Running Shoes',
    brand: 'Nike',
    category: 'footwear',
    imageUrl: 'https://m.media-amazon.com/images/I/71JGM5MNBzL._UL1500_.jpg',
    lowestPrice: 8995,
    highestPrice: 13995,
    storeCount: 3,
  },
  {
    id: 10,
    name: 'Levi\'s 511 Slim Fit Jeans (Dark Indigo)',
    brand: 'Levi\'s',
    category: 'fashion',
    imageUrl: 'https://m.media-amazon.com/images/I/71VBaaNKBhL._UL1500_.jpg',
    lowestPrice: 1799,
    highestPrice: 3499,
    storeCount: 4,
  },
]

export const MOCK_COMPARE_DATA = {
  1: {
    id: 1,
    name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    brand: 'Apple',
    modelNumber: 'MU793HN/A',
    categoryName: 'Smartphones',
    imageUrl: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg',
    description: 'iPhone 15 Pro Max features a titanium design, A17 Pro chip, 48MP camera system with 5x optical zoom, and an all-day battery life.',
    listings: [
      {
        listingId: 'l1',
        storeName: 'Amazon',
        storeLogoUrl: '',
        currentPrice: 149900,
        originalPrice: 159900,
        discountPct: 6.3,
        rating: 4.5,
        reviewCount: 12453,
        inStock: true,
        listingUrl: 'https://www.amazon.in/dp/B0CHX3QBCH',
      },
      {
        listingId: 'l2',
        storeName: 'Flipkart',
        storeLogoUrl: '',
        currentPrice: 144900,
        originalPrice: 159900,
        discountPct: 9.4,
        rating: 4.6,
        reviewCount: 8921,
        inStock: true,
        listingUrl: 'https://www.flipkart.com/apple-iphone-15-pro-max/',
      },
      {
        listingId: 'l3',
        storeName: 'Croma',
        storeLogoUrl: '',
        currentPrice: 155900,
        originalPrice: 159900,
        discountPct: 2.5,
        rating: 4.3,
        reviewCount: 2134,
        inStock: true,
        listingUrl: 'https://www.croma.com/',
      },
      {
        listingId: 'l4',
        storeName: 'Ajio',
        storeLogoUrl: '',
        currentPrice: null,
        originalPrice: 159900,
        discountPct: 0,
        rating: null,
        reviewCount: 0,
        inStock: false,
        listingUrl: '#',
      },
    ],
  },
}

// Generic mock compare data generator for any product
export function getMockCompareData(productId) {
  const id = Number(productId)
  if (MOCK_COMPARE_DATA[id]) return MOCK_COMPARE_DATA[id]

  const product = MOCK_PRODUCTS.find(p => p.id === id)
  if (!product) return null

  const basePrice = product.lowestPrice
  const stores = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Croma']
  const listings = stores.map((store, i) => {
    const markup = Math.random() * 0.15
    const price = Math.round(basePrice * (1 + markup))
    return {
      listingId: `l${i + 1}`,
      storeName: store,
      storeLogoUrl: '',
      currentPrice: Math.random() > 0.15 ? price : null,
      originalPrice: product.highestPrice,
      discountPct: Math.round(((product.highestPrice - price) / product.highestPrice) * 100),
      rating: Math.random() > 0.2 ? (3.5 + Math.random() * 1.5).toFixed(1) : null,
      reviewCount: Math.floor(Math.random() * 15000),
      inStock: Math.random() > 0.2,
      listingUrl: '#',
    }
  })

  return {
    id,
    name: product.name,
    brand: product.brand,
    modelNumber: 'N/A',
    categoryName: product.category,
    imageUrl: product.imageUrl,
    description: `Compare prices for ${product.name} across multiple stores to find the best deal.`,
    listings,
  }
}

export const MOCK_PRICE_HISTORY = {
  Amazon: [
    { date: '2026-03-01', price: 154900 },
    { date: '2026-03-08', price: 152900 },
    { date: '2026-03-15', price: 149900 },
    { date: '2026-03-22', price: 149900 },
    { date: '2026-04-01', price: 151900 },
    { date: '2026-04-08', price: 149900 },
    { date: '2026-04-15', price: 149900 },
  ],
  Flipkart: [
    { date: '2026-03-01', price: 155900 },
    { date: '2026-03-08', price: 149900 },
    { date: '2026-03-15', price: 147900 },
    { date: '2026-03-22', price: 144900 },
    { date: '2026-04-01', price: 146900 },
    { date: '2026-04-08', price: 144900 },
    { date: '2026-04-15', price: 144900 },
  ],
  Croma: [
    { date: '2026-03-01', price: 159900 },
    { date: '2026-03-08', price: 158900 },
    { date: '2026-03-15', price: 157900 },
    { date: '2026-03-22', price: 155900 },
    { date: '2026-04-01', price: 156900 },
    { date: '2026-04-08', price: 155900 },
    { date: '2026-04-15', price: 155900 },
  ],
  Myntra: [
    { date: '2026-03-15', price: 156900 },
    { date: '2026-03-22', price: 154900 },
    { date: '2026-04-01', price: 153900 },
    { date: '2026-04-08', price: 152900 },
    { date: '2026-04-15', price: 151900 },
  ],
}
