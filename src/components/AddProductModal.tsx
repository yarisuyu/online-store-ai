import { useState, useEffect, useRef } from 'react'
import { addProduct, type NewProduct } from '../api/productsApi'
import Icon from './Icon'
import './AddProductModal.css'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

interface FieldErrors {
  title?: string
  price?: string
  brand?: string
  sku?: string
}

export default function AddProductModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [sku, setSku] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}
    if (!title.trim()) errors.title = 'Поле обязательно для заполнения'
    if (!price.trim()) {
      errors.price = 'Поле обязательно для заполнения'
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      errors.price = 'Введите корректную цену'
    }
    if (!brand.trim()) errors.brand = 'Поле обязательно для заполнения'
    if (!sku.trim()) errors.sku = 'Поле обязательно для заполнения'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    setFieldErrors({})
    setError(null)
    setLoading(true)
    try {
      const payload: NewProduct = { title: title.trim(), price: Number(price), brand: brand.trim(), sku: sku.trim() }
      await addProduct(payload)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Добавить товар">

        <div className="modal-header">
          <h2 className="modal-title">Новый товар</h2>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">
            <Icon name="x" size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>

          <div className="modal-field">
            <label htmlFor="p-title">Наименование</label>
            <div className={`modal-input-wrap${fieldErrors.title ? ' modal-input-wrap--error' : ''}`}>
              <input
                ref={firstInputRef}
                id="p-title"
                type="text"
                placeholder="Введите наименование"
                value={title}
                onChange={e => { setTitle(e.target.value); if (fieldErrors.title) setFieldErrors(p => ({ ...p, title: undefined })) }}
              />
            </div>
            {fieldErrors.title && <span className="modal-field-error">{fieldErrors.title}</span>}
          </div>

          <div className="modal-field">
            <label htmlFor="p-price">Цена, ₽</label>
            <div className={`modal-input-wrap${fieldErrors.price ? ' modal-input-wrap--error' : ''}`}>
              <input
                id="p-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={e => { setPrice(e.target.value); if (fieldErrors.price) setFieldErrors(p => ({ ...p, price: undefined })) }}
              />
            </div>
            {fieldErrors.price && <span className="modal-field-error">{fieldErrors.price}</span>}
          </div>

          <div className="modal-field">
            <label htmlFor="p-brand">Вендор</label>
            <div className={`modal-input-wrap${fieldErrors.brand ? ' modal-input-wrap--error' : ''}`}>
              <input
                id="p-brand"
                type="text"
                placeholder="Введите вендора"
                value={brand}
                onChange={e => { setBrand(e.target.value); if (fieldErrors.brand) setFieldErrors(p => ({ ...p, brand: undefined })) }}
              />
            </div>
            {fieldErrors.brand && <span className="modal-field-error">{fieldErrors.brand}</span>}
          </div>

          <div className="modal-field">
            <label htmlFor="p-sku">Артикул</label>
            <div className={`modal-input-wrap${fieldErrors.sku ? ' modal-input-wrap--error' : ''}`}>
              <input
                id="p-sku"
                type="text"
                placeholder="Введите артикул"
                value={sku}
                onChange={e => { setSku(e.target.value); if (fieldErrors.sku) setFieldErrors(p => ({ ...p, sku: undefined })) }}
              />
            </div>
            {fieldErrors.sku && <span className="modal-field-error">{fieldErrors.sku}</span>}
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="modal-btn modal-btn--submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Добавить'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
