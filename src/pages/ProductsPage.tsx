import { useState } from 'react'
import './ProductsPage.css'

interface Product {
  id: number
  name: string
  category: string
  vendor: string
  article: string
  rating: number
  price: number
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'USB Флэшкарта 16GB',          category: 'Аксессуары',        vendor: 'Samsung', article: 'RCH45Q1A',   rating: 4.3, price: 48652 },
  { id: 2, name: 'Утюг Braun TexStyle 9',        category: 'Бытовая техника',   vendor: 'TexStyle', article: 'DFCHQ1A',   rating: 4.9, price: 4233  },
  { id: 3, name: 'Смартфон Apple iPhone 17',     category: 'Телефоны',          vendor: 'Apple',   article: 'GUYHD2-X4', rating: 4.7, price: 88652 },
  { id: 4, name: 'Игровая консоль PlaySta...',   category: 'Игровые приставки', vendor: 'Sony',    article: 'HT45Q21',   rating: 4.1, price: 56236 },
  { id: 5, name: 'Фен Dyson Supersonic Nural',   category: 'Электроника',       vendor: 'Dyson',   article: 'FJHHGF-CR4',rating: 3.3, price: 48652 },
]

const TOTAL = 120
const PER_PAGE = 20
const TOTAL_PAGES = Math.ceil(TOTAL / PER_PAGE)

function formatPrice(price: number) {
  const str = price.toString()
  const cents = '00'
  // split integer into two parts: before last 3 digits and last 3
  if (str.length > 3) {
    const main = str.slice(0, -3)
    const tail = str.slice(-3)
    return { main, tail, cents }
  }
  return { main: '', tail: str, cents }
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set([3]))
  const [allChecked, setAllChecked] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const toggleRow = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set())
    } else {
      setSelected(new Set(PRODUCTS.map(p => p.id)))
    }
    setAllChecked(!allChecked)
  }

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="products-page">
      {/* ── Top header ── */}
      <header className="products-header">
        <h1 className="products-header__title">Товары</h1>
        <div className="products-header__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            placeholder="Найти"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="products-content">
        {/* ── Section toolbar ── */}
        <div className="products-toolbar">
          <h2 className="products-toolbar__title">Все позиции</h2>
          <div className="products-toolbar__actions">
            <button className="products-toolbar__refresh" aria-label="Обновить">
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

        {/* ── Table ── */}
        <div className="products-table-wrap">
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
              {filtered.map(product => {
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
                        aria-label={`Выбрать ${product.name}`}
                      />
                    </td>
                    <td className="col-name">
                      <div className="product-info">
                        <div className="product-img" aria-hidden="true" />
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-category">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="col-vendor">
                      <span className="vendor-name">{product.vendor}</span>
                    </td>
                    <td className="col-article">{product.article}</td>
                    <td className="col-rating">
                      <span className={lowRating ? 'rating rating--low' : 'rating'}>{product.rating}</span>
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
          <span className="products-footer__info">Показано 1–{PER_PAGE} из {TOTAL}</span>
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
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(page => (
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
              disabled={currentPage === TOTAL_PAGES}
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
