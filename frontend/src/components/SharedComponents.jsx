import { Link, useNavigate } from 'react-router-dom'
import { Search, TrendingDown, Star, ExternalLink, ShoppingCart, Menu, X, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { STORE_INFO } from '../data/mockData'

// ── Navbar ────────────────────────────────────────────────
export function Navbar() {
  const [q, setQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`)
      setQ('')
    }
  }

  const categories = [
    { slug: 'smartphones', label: 'Phones', emoji: '📱' },
    { slug: 'laptops', label: 'Laptops', emoji: '💻' },
    { slug: 'televisions', label: 'TVs', emoji: '📺' },
    { slug: 'headphones', label: 'Audio', emoji: '🎧' },
    { slug: 'fashion', label: 'Fashion', emoji: '👕' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-olive/20 backdrop-blur-xl"
         style={{ background: 'rgba(17, 18, 13, 0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-sand to-sand-dark rounded-xl flex items-center justify-center
                            group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <TrendingDown size={18} className="text-midnight" />
            </div>
            <span className="font-display font-bold text-xl text-sand hidden sm:block">
              PriceHunt
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-olive-light transition-colors duration-200"
                      size={18}
                      style={searchFocused ? { color: '#D8CFBC' } : {}} />
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search iPhone 17 Pro, Samsung TV, Nike Shoes…"
                className="input-search w-full pl-11 pr-4 py-2.5 text-sm"
              />
              {q.trim() && (
                <button type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-sand text-midnight text-xs font-semibold
                                   px-3 py-1.5 rounded-lg hover:bg-sand-light transition-all duration-200">
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-lg text-sm text-sand/60 hover:text-sand hover:bg-olive/20
                           transition-all duration-200 whitespace-nowrap"
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-sand/60 hover:text-sand hover:bg-olive/20 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 pt-1 animate-slide-down border-t border-olive/10">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-sand/70 bg-olive/10 hover:bg-olive/20
                             hover:text-sand transition-all duration-200"
                >
                  {cat.emoji} {cat.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ── ProductCard ────────────────────────────────────────────
export function ProductCard({ product, index = 0 }) {
  const savings = product.lowestPrice && product.highestPrice
    ? product.highestPrice - product.lowestPrice
    : 0

  return (
    <Link
      to={`/compare/${product.id}`}
      className="card-interactive group block animate-fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Product image */}
      <div className="aspect-square bg-midnight-lighter rounded-xl mb-3 overflow-hidden border border-olive/10">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name}
              className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-olive">
              <ShoppingCart size={36} />
            </div>
        }
      </div>

      {/* Info */}
      <div>
        {product.brand && (
          <p className="text-[10px] text-sand/50 font-semibold uppercase tracking-widest mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="text-sm font-medium text-sand/90 line-clamp-2 leading-snug mb-2.5 
                       group-hover:text-sand transition-colors duration-200">
          {product.name}
        </h3>

        {/* Price range */}
        <div className="flex items-baseline gap-2 mb-2.5">
          {product.lowestPrice ? (
            <>
              <span className="text-lg font-bold text-sand font-display">
                ₹{Number(product.lowestPrice).toLocaleString('en-IN')}
              </span>
              {product.highestPrice && product.highestPrice !== product.lowestPrice && (
                <span className="text-xs text-olive line-through">
                  ₹{Number(product.highestPrice).toLocaleString('en-IN')}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-olive">Price not available</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="badge-sand text-[10px]">
            {product.storeCount} store{product.storeCount !== 1 ? 's' : ''}
          </span>
          {savings > 0 && (
            <span className="badge-green text-[10px]">
              Save ₹{Math.round(savings).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── StorePriceCard (for side-by-side comparison) ──────────
export function StorePriceCard({ listing, isCheapest, index = 0 }) {
  const storeInfo = STORE_INFO[listing.storeName] || {}
  const savings = listing.originalPrice && listing.currentPrice
    ? listing.originalPrice - listing.currentPrice
    : 0

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-500 animate-scale-in
        ${isCheapest
          ? 'border-emerald-600/40 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
          : 'border-olive/20 bg-midnight-light hover:border-olive/40 hover:bg-midnight-lighter'
        }`}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Best price ribbon */}
      {isCheapest && (
        <div className="absolute -top-px -right-px">
          <div className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl
                          flex items-center gap-1">
            <TrendingDown size={10} /> BEST PRICE
          </div>
        </div>
      )}

      {/* Store header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold
                        ${storeInfo.bgClass || 'bg-olive/20 border-olive/30'}`}
             style={{ color: storeInfo.textColor || '#D8CFBC' }}>
          {listing.storeName?.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-sand">{listing.storeName}</h4>
          <div className="flex items-center gap-1.5">
            {listing.inStock
              ? <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-slow" /> In Stock
                </span>
              : <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> Out of Stock
                </span>
            }
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold font-display"
                style={{ color: listing.currentPrice ? (isCheapest ? '#34d399' : '#D8CFBC') : '#565449' }}>
            {listing.currentPrice
              ? `₹${Number(listing.currentPrice).toLocaleString('en-IN')}`
              : 'N/A'}
          </span>
        </div>
        {listing.originalPrice && listing.originalPrice !== listing.currentPrice && (
          <span className="text-xs text-olive line-through block mt-1">
            MRP ₹{Number(listing.originalPrice).toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {listing.discountPct > 0 && (
          <span className="badge-amber text-[10px]">
            {Math.round(listing.discountPct)}% OFF
          </span>
        )}
        {savings > 0 && (
          <span className="badge-green text-[10px]">
            Save ₹{Math.round(savings).toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {/* Rating */}
      {listing.rating && (
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={listing.rating} />
          {listing.reviewCount > 0 && (
            <span className="text-[10px] text-olive">
              ({listing.reviewCount.toLocaleString()} reviews)
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <a
        href={listing.listingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-300 group/btn
          ${isCheapest
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'border border-olive/30 text-sand/80 hover:text-sand hover:border-sand/30 hover:bg-olive/20'
          }`}
      >
        Visit Store
        <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
      </a>
    </div>
  )
}

// ── StoreBadge ─────────────────────────────────────────────
export function StoreBadge({ name }) {
  return (
    <span className="badge-sand">
      {name}
    </span>
  )
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const cls = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <div className={`${cls} border-2 border-olive/30 border-t-sand rounded-full animate-spin`} />
  )
}

// ── LoadingSkeleton ────────────────────────────────────────
export function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-square shimmer mb-3 rounded-xl" />
          <div className="h-3 shimmer mb-2 rounded w-1/3" />
          <div className="h-4 shimmer mb-1 rounded w-full" />
          <div className="h-4 shimmer mb-3 rounded w-2/3" />
          <div className="h-5 shimmer mb-2 rounded w-1/2" />
          <div className="h-5 shimmer rounded w-1/4" />
        </div>
      ))}
    </div>
  )
}

// ── ComparisonSkeleton ────────────────────────────────────
export function ComparisonSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 shimmer rounded-xl" />
            <div className="flex-1">
              <div className="h-4 shimmer rounded w-20 mb-1" />
              <div className="h-3 shimmer rounded w-14" />
            </div>
          </div>
          <div className="h-8 shimmer rounded w-2/3 mb-2" />
          <div className="h-3 shimmer rounded w-1/2 mb-4" />
          <div className="h-5 shimmer rounded w-1/3 mb-4" />
          <div className="h-10 shimmer rounded-xl" />
        </div>
      ))}
    </div>
  )
}

// ── ErrorBox ───────────────────────────────────────────────
export function ErrorBox({ message }) {
  return (
    <div className="bg-red-950/30 border border-red-800/30 text-red-400 px-5 py-4 rounded-xl text-sm
                    flex items-center gap-3 animate-fade-in">
      <div className="w-8 h-8 bg-red-900/40 rounded-lg flex items-center justify-center shrink-0">
        <X size={16} className="text-red-400" />
      </div>
      {message}
    </div>
  )
}

// ── EmptyState ─────────────────────────────────────────────
export function EmptyState({ title, subtitle, icon: Icon = Search }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-20 h-20 bg-olive/10 border border-olive/20 rounded-2xl flex items-center justify-center mb-5">
        <Icon className="text-olive" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-sand/80 mb-2 font-display">{title}</h3>
      {subtitle && <p className="text-sm text-olive max-w-sm leading-relaxed">{subtitle}</p>}
    </div>
  )
}

// ── StarRating ─────────────────────────────────────────────
export function StarRating({ rating, count }) {
  if (!rating) return null
  const stars = Math.round(Number(rating))
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={12}
            className={i <= stars
              ? 'fill-amber-400 text-amber-400'
              : 'fill-olive/20 text-olive/20'}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-sand/70">{Number(rating).toFixed(1)}</span>
      {count > 0 && <span className="text-[10px] text-olive">({count.toLocaleString()})</span>}
    </div>
  )
}

// ── PlatformDot (visual indicator for stores) ─────────────
export function PlatformDots({ stores = [] }) {
  return (
    <div className="flex items-center -space-x-1">
      {stores.slice(0, 5).map((store, i) => {
        const info = STORE_INFO[store] || {}
        return (
          <div
            key={store}
            className="w-5 h-5 rounded-full border-2 border-midnight flex items-center justify-center text-[8px] font-bold"
            style={{ background: info.color || '#565449', zIndex: 5 - i }}
            title={store}
          >
            {store.charAt(0)}
          </div>
        )
      })}
    </div>
  )
}
