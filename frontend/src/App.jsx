import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/SharedComponents'
import HomePage    from './pages/HomePage'
import SearchPage  from './pages/SearchPage'
import CategoryPage from './pages/CategoryPage'
import ComparePage from './pages/ComparePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"                  element={<HomePage />} />
            <Route path="/search"            element={<SearchPage />} />
            <Route path="/category/:slug"    element={<CategoryPage />} />
            <Route path="/compare/:id"       element={<ComparePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-olive/15 py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sand/40 font-display font-bold text-sm">PriceHunt</span>
              <span className="text-olive text-xs">— compare prices across Indian e-commerce</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-olive">
              <span>Prices updated every 6 hours</span>
              <span className="w-1 h-1 bg-olive/30 rounded-full" />
              <span>No affiliate bias</span>
              <span className="w-1 h-1 bg-olive/30 rounded-full" />
              <span>© 2026</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
