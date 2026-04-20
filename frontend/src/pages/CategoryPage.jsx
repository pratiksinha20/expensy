import { useParams, Link } from 'react-router-dom'
import { useCategory } from '../hooks/useProductData'
import { ProductCard, Spinner, ErrorBox, EmptyState, LoadingSkeleton } from '../components/SharedComponents'
import { ShoppingCart, ChevronRight } from 'lucide-react'

const CATEGORY_LABELS = {
  smartphones:        'Smartphones',
  laptops:            'Laptops',
  televisions:        'Televisions',
  'washing-machines': 'Washing Machines',
  headphones:         'Headphones',
  tablets:            'Tablets',
  fashion:            'Fashion',
  footwear:           'Footwear',
}

const CATEGORY_EMOJIS = {
  smartphones: '📱',
  laptops: '💻',
  televisions: '📺',
  'washing-machines': '🫧',
  headphones: '🎧',
  tablets: '📟',
  fashion: '👕',
  footwear: '👟',
}

export default function CategoryPage() {
  const { slug } = useParams()
  const { products, loading, error } = useCategory(slug)

  const label = CATEGORY_LABELS[slug] ?? slug
  const emoji = CATEGORY_EMOJIS[slug] ?? '📦'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-olive mb-6 animate-fade-in">
        <Link to="/" className="hover:text-sand transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-sand/70">Categories</span>
        <ChevronRight size={12} />
        <span className="text-sand/50">{label}</span>
      </div>

      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{emoji}</span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-sand">{label}</h1>
        </div>
        {!loading && products.length > 0 && (
          <p className="text-sm text-olive ml-12">
            {products.length} product{products.length !== 1 ? 's' : ''} •{' '}
            Compare prices across all platforms
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingSkeleton count={10} />}

      {/* Error */}
      {error && <ErrorBox message={error} />}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          icon={ShoppingCart}
          title="No products in this category yet"
          subtitle="Products will appear here once they've been added to the database."
        />
      )}

      {/* Product Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
