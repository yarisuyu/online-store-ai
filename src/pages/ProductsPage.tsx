import { useState, useEffect } from 'react'
import { getProducts, type Product } from '../api/productsApi'
import './ProductsPage.css'

const PER_PAGE = 20

function formatPrice(price: number) {
  const rounded = Math.round(price)
  const str = rounded.toString()
  if (str.length > 3) {
    return { main: str.slice(0, -3), tail: str.slice(-3), cents: '00' }
  }
  return { main: '', tail: str, cents: '00' }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [refreshKey, setRefreshKey] = useState(0)

  const totalPages = Math.ceil(total / PER_PAGE)
  const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1
  const to = Math.min(currentPage * PER_PAGE, total)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProducts(currentPage, PER_PAGE, search)
        if (!cancelled) {
          setProducts(data.products)
          setTotal(data.total)
          setSelected(new Set())
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Ошибка загрузки')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [currentPage, search, refreshKey])

  // Reset to page 1 on new search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    setSearch(searchInput)
  }

  const toggleRow = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const allChecked = products.length > 0 && products.every(p => selected.has(p.id))

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set())
    } else {
      setSelected(new Set(products.map(p => p.id)))
    }
  }

  // Pagination: show max 5 page buttons around current page
  const pageButtons = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })()

  return (
    <div className="products-page">
      {/* ── Top header ── */}
      <header className="products-header">
        <h1 className="products-header__title">Товары</h1>
        <form className="products-header__search" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            placeholder="Найти"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </form>
      </header>

      <div className="products-content">
        {/* ── Section toolbar ── */}
        <div className="products-toolbar">
          <h2 className="products-toolbar__title">Все позиции</h2>
          <div className="products-toolbar__actions">
            <button
              className="products-toolbar__refresh"
              aria-label="Обновить"
              onClick={() => setRefreshKey(k => k + 1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
            <button className="products-toolbar__add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Добавить
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && <p className="products-error">{error}</p>}

        {/* ── Table ── */}
        <div className={`products-table-wrap ${loading ? 'products-table-wrap--loading' : ''}`}>
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-check">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="Выбрать все" />
                </th>
                <th className="col-name">Наименование</th>
                <th className="col-vendor">Вендор</th>
                <th className="col-article">Артикул</th>
                <th className="col-rating">Оценка</th>
                <th className="col-price">Цена, ₽</th>
                <th className="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const isSelected = selected.has(product.id)
                const { main, tail, cents } = formatPrice(product.price)
                const lowRating = product.rating < 4

                return (
                  <tr
                    key={product.id}
                    className={isSelected ? 'row--selected' : ''}
                    onClick={() => toggleRow(product.id)}
                  >
                    <td className="col-check" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(product.id)}
                        aria-label={`Выбрать ${product.title}`}
                      />
                    </td>
                    <td className="col-name">
                      <div className="product-info">
                        <img
                          className="product-img"
                          src={product.thumbnail}
                          alt={product.title}
                          loading="lazy"
                        />
                        <div>
                          <div className="product-name">{product.title}</div>
                          <div className="product-category">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="col-vendor">
                      <span className="vendor-name">{product.brand ?? '—'}</span>
                    </td>
                    <td className="col-article">{product.sku}</td>
                    <td className="col-rating">
                      <span className={lowRating ? 'rating rating--low' : 'rating'}>{product.rating.toFixed(1)}</span>
                      <span className="rating-max">/5</span>
                    </td>
                    <td className="col-price">
                      <span className="price-main">{main}&nbsp;{tail}</span>
                      <span className="price-cents">,{cents}</span>
                    </td>
                    <td className="col-actions" onClick={e => e.stopPropagation()}>
                      <button className="btn-add" aria-label="Добавить в корзину">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <button className="btn-more" aria-label="Ещё">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="products-footer">
          <span className="products-footer__info">
            {total > 0 ? `Показано ${from}–${to} из ${total}` : 'Нет результатов'}
          </span>
          <div className="pagination">
            <button
              className="pagination__arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              aria-label="Назад"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {pageButtons.map(page => (
              <button
                key={page}
                className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination__arrow"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              aria-label="Вперёд"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
