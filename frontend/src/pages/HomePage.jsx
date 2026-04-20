import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, TrendingDown, Zap, ShieldCheck, BarChart2, ArrowRight, Sparkles, ChevronRight } from 'lucide-react'
import { STORE_INFO, MOCK_PRODUCTS } from '../data/mockData'

const CATEGORIES = [
  { slug: 'smartphones',      label: 'Smartphones',     emoji: '📱', count: '2.4k+' },
  { slug: 'laptops',          label: 'Laptops',         emoji: '💻', count: '1.8k+' },
  { slug: 'televisions',      label: 'Televisions',     emoji: '📺', count: '960+' },
  { slug: 'washing-machines', label: 'Washing Machines', emoji: '🫧', count: '540+' },
  { slug: 'headphones',       label: 'Headphones',      emoji: '🎧', count: '3.2k+' },
  { slug: 'tablets',          label: 'Tablets',          emoji: '📟', count: '720+' },
  { slug: 'fashion',          label: 'Fashion',          emoji: '👕', count: '12k+' },
  { slug: 'footwear',         label: 'Footwear',        emoji: '👟', count: '8.5k+' },
]

const POPULAR = [
  'iPhone 17 Pro',
  'Samsung Galaxy S25',
  'MacBook Air M3',
  'Sony WH-1000XM5',
  'OnePlus 12',
  'Nike Air Max',
]

const PLATFORMS = Object.values(STORE_INFO).slice(0, 5)

export default function HomePage() {
  const [q, setQ] = useState('')
  const navigate  = useNavigate()
  const [typedText, setTypedText] = useState('')
  const [currentSuggestion, setCurrentSuggestion] = useState(0)

  const suggestions = ['iPhone 17 Pro Max', 'Samsung Galaxy S25 Ultra', 'MacBook Air M3', 'Sony Headphones']

  // Typing animation for the placeholder area
  useEffect(() => {
    let charIdx = 0
    let suggIdx = currentSuggestion
    let isDeleting = false
    let timeout

    const type = () => {
      const current = suggestions[suggIdx]
      if (!isDeleting) {
        setTypedText(current.substring(0, charIdx + 1))
        charIdx++
        if (charIdx === current.length) {
          isDeleting = true
          timeout = setTimeout(type, 2000)
          return
        }
        timeout = setTimeout(type, 80)
      } else {
        setTypedText(current.substring(0, charIdx - 1))
        charIdx--
        if (charIdx === 0) {
          isDeleting = false
          suggIdx = (suggIdx + 1) % suggestions.length
          setCurrentSuggestion(suggIdx)
          timeout = setTimeout(type, 500)
          return
        }
        timeout = setTimeout(type, 40)
      }
    }

    timeout = setTimeout(type, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div>
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-sand/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-olive/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] 
                          bg-gradient-radial from-sand/[0.03] to-transparent rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-olive/15 border border-olive/25 rounded-full 
                          px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles size={13} className="text-sand/60" />
            <span className="text-xs text-sand/60 font-medium">Compare across 5+ platforms instantly</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-sand mb-5 
                         leading-[1.1] tracking-tight animate-slide-up">
            Find the
            <span className="relative mx-3">
              <span className="relative z-10 text-gradient bg-gradient-to-r from-sand via-sand-light to-sand-dark">
                best price
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-olive/20 -skew-x-6 rounded" />
            </span>
            <br />
            for everything
          </h1>

          <p className="text-lg sm:text-xl text-olive-light max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
             style={{ animationDelay: '100ms' }}>
            Search any product and compare prices across
            <span className="text-sand font-medium"> Amazon</span>,
            <span className="text-sand font-medium"> Flipkart</span>,
            <span className="text-sand font-medium"> Myntra</span>,
            <span className="text-sand font-medium"> Ajio</span> & more — side by side.
          </p>

          {/* ═══ Main Search Box ═══ */}
          <form onSubmit={handleSearch}
                className="max-w-2xl mx-auto animate-slide-up"
                style={{ animationDelay: '200ms' }}>
            <div className="relative group">
              {/* Glow effect behind search */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sand/10 via-sand/5 to-sand/10 
                              rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center bg-midnight-lighter border border-olive/30 
                              rounded-2xl overflow-hidden transition-all duration-300
                              group-hover:border-sand/30 focus-within:border-sand/40 
                              focus-within:shadow-[0_0_40px_rgba(216,207,188,0.08)]">
                <Search className="ml-5 text-olive-light shrink-0" size={22} />
                <input
                  type="text"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder={`Search "${typedText}"`}
                  className="flex-1 bg-transparent px-4 py-5 text-sand text-base sm:text-lg
                             placeholder:text-olive focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-sand hover:bg-sand-light text-midnight font-bold 
                             px-6 sm:px-8 py-3 m-2 rounded-xl transition-all duration-300
                             hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]
                             flex items-center gap-2 text-sm sm:text-base"
                >
                  <Search size={16} />
                  <span className="hidden sm:inline">Compare</span>
                </button>
              </div>
            </div>
          </form>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-slide-up"
               style={{ animationDelay: '300ms' }}>
            <span className="text-xs text-olive mr-1 self-center">Popular:</span>
            {POPULAR.map(p => (
              <button
                key={p}
                onClick={() => navigate(`/search?q=${encodeURIComponent(p)}`)}
                className="text-xs bg-olive/15 hover:bg-olive/25 text-sand/70 hover:text-sand
                           px-3 py-1.5 rounded-lg transition-all duration-200 border border-olive/10
                           hover:border-olive/30"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Platform logos */}
          <div className="mt-10 flex items-center justify-center gap-6 animate-fade-in"
               style={{ animationDelay: '500ms' }}>
            {PLATFORMS.map((platform) => (
              <div key={platform.name}
                   className="flex items-center gap-2 px-3 py-2 rounded-xl bg-olive/5 border border-olive/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                     style={{ background: platform.color }}>
                  {platform.name.charAt(0)}
                </div>
                <span className="text-xs text-sand/50 font-medium hidden sm:block">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="border-t border-olive/10">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-sand mb-3">
              How it works
            </h2>
            <p className="text-olive-light text-sm max-w-md mx-auto">
              Three simple steps to never overpay again
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Search any product',
                desc: 'Type any product name — from iPhones to washing machines to sneakers.',
                gradient: 'from-sand/10 to-transparent',
              },
              {
                icon: BarChart2,
                step: '02',
                title: 'Compare side by side',
                desc: 'See prices from Amazon, Flipkart, Myntra, Ajio & more in one view.',
                gradient: 'from-emerald-500/10 to-transparent',
              },
              {
                icon: Zap,
                step: '03',
                title: 'Buy at the best price',
                desc: 'Click through to the store with the lowest price. Prices refreshed every 6 hours.',
                gradient: 'from-amber-500/10 to-transparent',
              },
            ].map(({ icon: Icon, step, title, desc, gradient }, i) => (
              <div key={title}
                   className="card group animate-fade-in relative overflow-hidden"
                   style={{ animationDelay: `${i * 100}ms` }}>
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${gradient} opacity-50`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-olive/15 border border-olive/20 rounded-xl 
                                    flex items-center justify-center group-hover:bg-olive/25 transition-colors duration-300">
                      <Icon size={22} className="text-sand/70 group-hover:text-sand transition-colors" />
                    </div>
                    <span className="text-4xl font-black text-olive/10 font-display">{step}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sand mb-2 text-lg">{title}</h3>
                  <p className="text-sm text-olive-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <section className="border-t border-olive/10">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-sand mb-2">
                Browse by category
              </h2>
              <p className="text-olive-light text-sm">Find the best deals across every category</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="card-interactive text-center py-7 group animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500">
                  {cat.emoji}
                </div>
                <p className="text-sm font-semibold text-sand/80 group-hover:text-sand transition-colors mb-1">
                  {cat.label}
                </p>
                <p className="text-[10px] text-olive font-medium">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Trending Products ═══ */}
      <section className="border-t border-olive/10">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-sand mb-2">
                Trending comparisons
              </h2>
              <p className="text-olive-light text-sm">Most searched products this week</p>
            </div>
            <Link to="/search?q=" className="btn-ghost text-xs flex items-center gap-1 group">
              View all
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_PRODUCTS.slice(0, 6).map((product, i) => (
              <Link
                key={product.id}
                to={`/compare/${product.id}`}
                className="card-interactive flex gap-4 items-center animate-fade-in group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div className="w-20 h-20 bg-midnight-lighter rounded-xl overflow-hidden shrink-0 
                                border border-olive/10 p-2">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name}
                         className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-olive font-semibold uppercase tracking-widest mb-0.5">
                    {product.brand}
                  </p>
                  <h4 className="text-sm font-medium text-sand/80 line-clamp-1 mb-1.5 
                                 group-hover:text-sand transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-sand font-display">
                      ₹{product.lowestPrice?.toLocaleString('en-IN')}
                    </span>
                    {product.highestPrice && product.highestPrice !== product.lowestPrice && (
                      <span className="text-[10px] text-olive line-through">
                        ₹{product.highestPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight size={16} className="text-olive shrink-0 group-hover:text-sand 
                                                    group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Trust Banner ═══ */}
      <section className="border-t border-olive/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="card-glass text-center py-10 px-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck size={24} className="text-sand/60" />
              <h3 className="font-display font-bold text-xl text-sand">
                100% Unbiased Comparison
              </h3>
            </div>
            <p className="text-olive-light text-sm max-w-lg mx-auto leading-relaxed mb-6">
              We don't earn commissions from any store. No hidden fees, no affiliate bias. 
              We just compare so you can make the best buying decision.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['No commissions', 'Real-time prices', 'All major stores', 'Price history'].map(tag => (
                <span key={tag} className="badge-sand">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
