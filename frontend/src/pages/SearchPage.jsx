import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '../hooks/useProductData'
import { ProductCard, Spinner, ErrorBox, EmptyState, LoadingSkeleton } from '../components/SharedComponents'
import { Search, SlidersHorizontal, ArrowUpDown, Grid3X3, LayoutList, ChevronRight } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'savings', label: 'Biggest Savings' },
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  const { query, setQuery, results, loading, error } = useSearch()
  const [sortBy, setSortBy] = useState('relevant')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  // Sync URL param → hook query on mount / URL change
  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery, setQuery])

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return (a.lowestPrice ?? Infinity) - (b.lowestPrice ?? Infinity)
      case 'price_high': return (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0)
      case 'savings': {
        const savA = (a.highestPrice || 0) - (a.lowestPrice || 0)
        const savB = (b.highestPrice || 0) - (b.lowestPrice || 0)
        return savB - savA
      }
      default: return 0
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-olive mb-6 animate-fade-in">
        <Link to="/" className="hover:text-sand transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-sand/70">Search</span>
        {urlQuery && (
          <>
            <ChevronRight size={12} />
            <span className="text-sand/50">"{urlQuery}"</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-sand mb-2">
          {urlQuery ? (
            <>Results for <span className="text-sand/60">"{urlQuery}"</span></>
          ) : (
            'Search products'
          )}
        </h1>
        {!loading && results.length > 0 && (
          <p className="text-sm text-olive">
            {results.length} product{results.length !== 1 ? 's' : ''} found across all platforms
          </p>
        )}
      </div>

      {/* Search + Filters Bar */}
      <div className="card mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-olive" size={18} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Refine your search…"
              className="input-search w-full pl-11 pr-4 py-3 text-sm"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Spinner size="sm" />
              </div>
            )}
          </div>

          {/* Sort + View */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-olive pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-midnight-lighter border border-olive/30 rounded-xl
                           text-sand text-sm pl-9 pr-8 py-3 focus:outline-none focus:border-sand/30
                           transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center bg-midnight-lighter border border-olive/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' 
                  ? 'bg-olive/30 text-sand' 
                  : 'text-olive hover:text-sand/70'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' 
                  ? 'bg-olive/30 text-sand' 
                  : 'text-olive hover:text-sand/70'}`}
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* States */}
      {error && <ErrorBox message={error} />}

      {loading && <LoadingSkeleton count={10} />}

      {!loading && !error && sortedResults.length === 0 && urlQuery && (
        <EmptyState
          icon={Search}
          title="No products found"
          subtitle={`We couldn't find anything for "${urlQuery}". Try a different keyword or check spelling.`}
        />
      )}

      {/* Results */}
      {!loading && sortedResults.length > 0 && (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : 'flex flex-col gap-3'
        }>
          {sortedResults.map((product, index) => (
            viewMode === 'grid' ? (
              <ProductCard key={product.id} product={product} index={index} />
            ) : (
              <ListProductCard key={product.id} product={product} index={index} />
            )
          ))}
        </div>
      )}
    </div>
  )
}

// ── List View Card ────────────────────────────────────────
function ListProductCard({ product, index }) {
  const savings = product.lowestPrice && product.highestPrice
    ? product.highestPrice - product.lowestPrice
    : 0

  return (
    <Link
      to={`/compare/${product.id}`}
      className="card-interactive flex gap-4 items-center animate-fade-in group"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-midnight-lighter rounded-xl overflow-hidden shrink-0 
                      border border-olive/10 p-2">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name}
               className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-olive">📦</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-olive font-semibold uppercase tracking-widest mb-0.5">
          {product.brand}
        </p>
        <h3 className="text-sm font-medium text-sand/80 line-clamp-1 mb-1.5 
                       group-hover:text-sand transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-lg font-bold text-sand font-display">
            ₹{product.lowestPrice?.toLocaleString('en-IN')}
          </span>
          {product.highestPrice && product.highestPrice !== product.lowestPrice && (
            <span className="text-xs text-olive line-through">
              ₹{product.highestPrice?.toLocaleString('en-IN')}
            </span>
          )}
          {savings > 0 && (
            <span className="badge-green text-[10px]">
              Save ₹{Math.round(savings).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Store count + Arrow */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <span className="badge-sand text-[10px]">
          {product.storeCount} stores
        </span>
        <ChevronRight size={16} className="text-olive group-hover:text-sand 
                                            group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  )
}
