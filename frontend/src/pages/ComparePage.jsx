import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ExternalLink, RefreshCw, ChevronLeft, ChevronRight,
  TrendingDown, Star, ShoppingCart, BarChart3,
  ArrowUpDown, Shield, Clock, Package
} from 'lucide-react'
import { useCompare } from '../hooks/useProductData'
import { StorePriceCard, Spinner, ErrorBox, StoreBadge, StarRating, ComparisonSkeleton } from '../components/SharedComponents'
import PriceHistoryChart from '../components/PriceHistoryChart'
import { STORE_INFO } from '../data/mockData'

// ── Sort options ──────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'price_asc',     label: 'Price: Low → High' },
  { value: 'price_desc',    label: 'Price: High → Low' },
  { value: 'rating_desc',   label: 'Top Rated' },
  { value: 'discount_desc', label: 'Best Discount' },
]

function sortListings(listings, sortBy) {
  return [...listings].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':     return (a.currentPrice ?? Infinity) - (b.currentPrice ?? Infinity)
      case 'price_desc':    return (b.currentPrice ?? 0) - (a.currentPrice ?? 0)
      case 'rating_desc':   return (b.rating ?? 0) - (a.rating ?? 0)
      case 'discount_desc': return (b.discountPct ?? 0) - (a.discountPct ?? 0)
      default:              return 0
    }
  })
}

// ── Main Compare Page ─────────────────────────────────────
export default function ComparePage() {
  const { id } = useParams()
  const { data, loading, error, refresh } = useCompare(id)
  const [sort, setSort]             = useState('price_asc')
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab]               = useState('compare')

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setTimeout(() => setRefreshing(false), 2000)
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="shimmer h-8 w-48 rounded-lg mb-6" />
      <div className="card mb-8">
        <div className="flex gap-5">
          <div className="shimmer w-28 h-28 rounded-xl shrink-0" />
          <div className="flex-1">
            <div className="shimmer h-4 w-20 rounded mb-2" />
            <div className="shimmer h-6 w-3/4 rounded mb-2" />
            <div className="shimmer h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>
      <ComparisonSkeleton />
    </div>
  )

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-10"><ErrorBox message={error} /></div>
  )

  if (!data) return null

  const sorted   = sortListings(data.listings ?? [], sort)
  const cheapest = sorted.find(l => l.currentPrice != null)
  const prices   = sorted.filter(l => l.currentPrice).map(l => l.currentPrice)
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
  const maxSavings = prices.length >= 2 ? Math.max(...prices) - Math.min(...prices) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-olive mb-6 animate-fade-in">
        <Link to="/" className="hover:text-sand transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-sand/50 line-clamp-1">{data.name}</span>
      </div>

      {/* ═══ Product Header Card ═══ */}
      <div className="card mb-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Product image */}
          {data.imageUrl && (
            <div className="w-32 h-32 sm:w-36 sm:h-36 bg-midnight-lighter rounded-2xl shrink-0 
                            border border-olive/10 p-3 overflow-hidden mx-auto sm:mx-0">
              <img src={data.imageUrl} alt={data.name}
                   className="w-full h-full object-contain" />
            </div>
          )}

          <div className="flex-1 min-w-0 text-center sm:text-left">
            {data.brand && (
              <p className="text-[10px] font-bold text-sand/40 uppercase tracking-[0.2em] mb-1">
                {data.brand}
              </p>
            )}
            <h1 className="font-display font-bold text-xl sm:text-2xl text-sand leading-snug mb-3">
              {data.name}
            </h1>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              {data.categoryName && <StoreBadge name={data.categoryName} />}
              {data.modelNumber && data.modelNumber !== 'N/A' && (
                <span className="text-[10px] text-olive border border-olive/20 px-2 py-0.5 rounded-md">
                  Model: {data.modelNumber}
                </span>
              )}
              <span className="text-[10px] text-olive border border-olive/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Package size={10} />
                {data.listings?.length ?? 0} stores compared
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col items-center gap-2 shrink-0 justify-center sm:justify-start">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh prices"
              className="p-2.5 rounded-xl border border-olive/20 hover:bg-olive/15 
                         transition-all duration-300 disabled:opacity-40 hover:border-sand/20"
            >
              <RefreshCw size={16} className={`text-sand/60 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Price summary strip */}
        {prices.length > 0 && (
          <div className="mt-5 pt-5 border-t border-olive/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] text-olive uppercase tracking-wider mb-1">Lowest Price</p>
              <p className="text-xl font-bold font-display text-emerald-400">
                ₹{Math.min(...prices).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] text-olive uppercase tracking-wider mb-1">Highest Price</p>
              <p className="text-xl font-bold font-display text-red-400/80">
                ₹{Math.max(...prices).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] text-olive uppercase tracking-wider mb-1">Average</p>
              <p className="text-xl font-bold font-display text-sand/70">
                ₹{avgPrice.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] text-olive uppercase tracking-wider mb-1">Max Savings</p>
              <p className="text-xl font-bold font-display text-amber-400">
                ₹{maxSavings.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Tabs ═══ */}
      <div className="flex items-center gap-1 mb-6 border-b border-olive/15 animate-fade-in">
        {[
          { key: 'compare', label: 'Side-by-Side Comparison', icon: ShoppingCart },
          { key: 'history', label: 'Price History', icon: BarChart3 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 
                        border-b-2 -mb-px
              ${tab === key
                ? 'border-sand text-sand'
                : 'border-transparent text-olive hover:text-sand/70'}`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}

        {/* Sort (in compare tab) */}
        {tab === 'compare' && (
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <ArrowUpDown size={13} className="text-olive" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-transparent text-sm text-sand/60 hover:text-sand
                         focus:outline-none cursor-pointer pr-2"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-midnight text-sand">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ═══ Compare Tab — SIDE BY SIDE ═══ */}
      {tab === 'compare' && (
        <div className="animate-fade-in">
          {/* Mobile sort */}
          <div className="sm:hidden flex items-center justify-between mb-4">
            <p className="text-xs text-olive">
              {sorted.length} store{sorted.length !== 1 ? 's' : ''} available
            </p>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-midnight-lighter border border-olive/30 rounded-lg
                         text-sand text-xs px-3 py-2 focus:outline-none"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center text-olive py-16">
              <Package size={40} className="mx-auto mb-4 text-olive/40" />
              <p className="text-sm font-medium text-sand/50">No store listings found yet</p>
              <p className="text-xs text-olive mt-1">Products will appear once they're scraped</p>
            </div>
          ) : (
            <>
              {/* ═══ SIDE-BY-SIDE GRID ═══ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {sorted.map((listing, index) => (
                  <StorePriceCard
                    key={listing.listingId}
                    listing={listing}
                    isCheapest={cheapest?.listingId === listing.listingId}
                    index={index}
                  />
                ))}
              </div>

              {/* ═══ Comparison Table ═══ */}
              <div className="card overflow-hidden mb-8">
                <h3 className="font-display font-semibold text-sand mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-olive" />
                  Quick Comparison
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-olive/15">
                        <th className="text-left py-3 px-3 text-[10px] text-olive uppercase tracking-wider font-semibold">
                          Store
                        </th>
                        <th className="text-right py-3 px-3 text-[10px] text-olive uppercase tracking-wider font-semibold">
                          Price
                        </th>
                        <th className="text-right py-3 px-3 text-[10px] text-olive uppercase tracking-wider font-semibold hidden sm:table-cell">
                          Discount
                        </th>
                        <th className="text-center py-3 px-3 text-[10px] text-olive uppercase tracking-wider font-semibold hidden sm:table-cell">
                          Rating
                        </th>
                        <th className="text-center py-3 px-3 text-[10px] text-olive uppercase tracking-wider font-semibold">
                          Stock
                        </th>
                        <th className="text-right py-3 px-3 text-[10px] text-olive uppercase tracking-wider font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((listing, i) => {
                        const isBest = cheapest?.listingId === listing.listingId
                        const storeInfo = STORE_INFO[listing.storeName] || {}
                        return (
                          <tr key={listing.listingId}
                              className={`border-b border-olive/8 transition-colors hover:bg-olive/5
                                ${isBest ? 'bg-emerald-950/10' : ''}`}>
                            {/* Store */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center 
                                                text-[10px] font-bold ${storeInfo.bgClass || ''}`}
                                     style={{ color: storeInfo.textColor || '#D8CFBC' }}>
                                  {listing.storeName?.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sand text-sm">{listing.storeName}</span>
                                  {isBest && (
                                    <span className="block text-[9px] text-emerald-400 font-semibold">
                                      ★ Best Price
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-3 text-right">
                              {listing.currentPrice ? (
                                <div>
                                  <span className={`font-bold font-display ${isBest ? 'text-emerald-400' : 'text-sand'}`}>
                                    ₹{Number(listing.currentPrice).toLocaleString('en-IN')}
                                  </span>
                                  {listing.originalPrice && listing.originalPrice !== listing.currentPrice && (
                                    <span className="block text-[10px] text-olive line-through">
                                      ₹{Number(listing.originalPrice).toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-olive text-xs">N/A</span>
                              )}
                            </td>

                            {/* Discount */}
                            <td className="py-3.5 px-3 text-right hidden sm:table-cell">
                              {listing.discountPct > 0 ? (
                                <span className="badge-amber text-[10px]">
                                  {Math.round(listing.discountPct)}% OFF
                                </span>
                              ) : (
                                <span className="text-olive text-xs">—</span>
                              )}
                            </td>

                            {/* Rating */}
                            <td className="py-3.5 px-3 text-center hidden sm:table-cell">
                              {listing.rating ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Star size={11} className="fill-amber-400 text-amber-400" />
                                  <span className="text-xs text-sand/70">{Number(listing.rating).toFixed(1)}</span>
                                </div>
                              ) : (
                                <span className="text-olive text-xs">—</span>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="py-3.5 px-3 text-center">
                              {listing.inStock ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> In Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-medium">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> Out
                                </span>
                              )}
                            </td>

                            {/* Action */}
                            <td className="py-3.5 px-3 text-right">
                              <a
                                href={listing.listingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs 
                                            font-semibold transition-all duration-200
                                  ${isBest
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'border border-olive/30 text-sand/70 hover:text-sand hover:border-sand/30'}`}
                              >
                                Visit <ExternalLink size={10} />
                              </a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Description */}
          {data.description && (
            <div className="card">
              <h3 className="font-display font-semibold text-sand mb-3 flex items-center gap-2 text-sm">
                <Shield size={14} className="text-olive" />
                About this product
              </h3>
              <p className="text-sm text-olive-light leading-relaxed">{data.description}</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ History Tab ═══ */}
      {tab === 'history' && (
        <div className="card animate-fade-in">
          <PriceHistoryChart productId={id} />
        </div>
      )}

      {/* ═══ Trust Bar ═══ */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-olive text-[10px] animate-fade-in">
        <span className="flex items-center gap-1.5">
          <Clock size={12} /> Prices updated every 6 hours
        </span>
        <span className="flex items-center gap-1.5">
          <Shield size={12} /> No affiliate bias
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingDown size={12} /> Real-time comparison
        </span>
      </div>
    </div>
  )
}
