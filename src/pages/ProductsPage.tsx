import { useState, useEffect } from 'react'
import { getProducts, type Product } from '../api/productsApi'
import Icon from '../components/Icon'
import AddProductModal from '../components/AddProductModal'
import Toast from '../components/Toast'
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
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  type SortKey = 'title' | 'brand' | 'rating' | 'price'
  type SortDir = 'asc' | 'desc'
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1
  const to = Math.min(currentPage * PER_PAGE, total)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProducts(currentPage, PER_PAGE, search, sortKey, sortDir)
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
  }, [currentPage, search, sortKey, sortDir, refreshKey])

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
          <Icon name="search" size={16} aria-hidden="true" />
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
              <Icon name="refresh" size={18} />
            </button>
            <button className="products-toolbar__add" onClick={() => setShowModal(true)}>
              <Icon name="plus-circle" size={16} />
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
                <th className="col-name" onClick={() => handleSort('title')}>
                  <div className="col-sortable">
                    <span>Наименование</span>
                    <Icon name={sortKey === 'title' ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevron-up'} size={14} className={sortKey === 'title' ? 'sort-icon sort-icon--active' : 'sort-icon'} />
                  </div>
                </th>
                <th className="col-vendor" onClick={() => handleSort('brand')}>
                  <div className="col-sortable col-sortable--center">
                    <span>Вендор</span>
                    <Icon name={sortKey === 'brand' ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevron-up'} size={14} className={sortKey === 'brand' ? 'sort-icon sort-icon--active' : 'sort-icon'} />
                  </div>
                </th>
                <th className="col-article">Артикул</th>
                <th className="col-rating" onClick={() => handleSort('rating')}>
                  <div className="col-sortable col-sortable--center">
                    <span>Оценка</span>
                    <Icon name={sortKey === 'rating' ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevron-up'} size={14} className={sortKey === 'rating' ? 'sort-icon sort-icon--active' : 'sort-icon'} />
                  </div>
                </th>
                <th className="col-price" onClick={() => handleSort('price')}>
                  <div className="col-sortable col-sortable--center">
                    <span>Цена, ₽</span>
                    <Icon name={sortKey === 'price' ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevron-up'} size={14} className={sortKey === 'price' ? 'sort-icon sort-icon--active' : 'sort-icon'} />
                  </div>
                </th>
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
                        <div className="text-left">
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
                        <Icon name="plus" size={16} />
                      </button>
                      <button className="btn-more" aria-label="Ещё">
                        <Icon name="more-horizontal" size={16} />
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
              <Icon name="chevron-left" size={16} />
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
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            setToast('Товар успешно добавлен')
            setRefreshKey(k => k + 1)
          }}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

    </div>
  )
}
