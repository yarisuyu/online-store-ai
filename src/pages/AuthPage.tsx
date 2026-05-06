import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../api/authApi'
import Icon from '../components/Icon'
import './AuthPage.css'

export default function AuthPage() {
  const navigate = useNavigate()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ login?: string; password?: string }>({})

  const validate = () => {
    const errors: { login?: string; password?: string } = {}
    if (!loginValue.trim()) errors.login = 'Поле обязательно для заполнения'
    if (!password.trim()) errors.password = 'Поле обязательно для заполнения'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setError(null)
    setLoading(true)
    try {
      await apiLogin(loginValue, password)
      navigate('/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Icon */}
        <div className="auth-icon-wrap">
          <Icon name="logo" size={32} aria-hidden="true" />
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1 className="auth-title">Добро пожаловать!</h1>
          <p className="auth-subtitle">Пожалуйста, авторизируйтесь</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Login field */}
          <div className="auth-field">
            <label htmlFor="login">Логин</label>
            <div className={`auth-input-wrap${fieldErrors.login ? ' auth-input-wrap--error' : ''}`}>
              <span className="auth-input-icon">
                <Icon name="user" size={18} />
              </span>
              <input
                id="login"
                type="text"
                autoComplete="username"
                placeholder="Введите логин"
                value={loginValue}
                onChange={e => { setLoginValue(e.target.value); if (fieldErrors.login) setFieldErrors(p => ({ ...p, login: undefined })) }}
              />

              <button
                type="button"
                className="auth-input-action"
                onClick={() => setLoginValue('')}
                aria-label="Очистить"
              >
                <Icon name="x" size={16} />
              </button>

            </div>
            {fieldErrors.login && <span className="auth-field-error">{fieldErrors.login}</span>}
          </div>

          {/* Password field */}
          <div className="auth-field">
            <label htmlFor="password">Пароль</label>
            <div className={`auth-input-wrap${fieldErrors.password ? ' auth-input-wrap--error' : ''}`}>
              <span className="auth-input-icon">
                <Icon name="lock" size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Введите пароль"
                value={password}
                onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: undefined })) }}
              />
              <button
                type="button"
                className="auth-input-action"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <Icon name="eye-off" size={18} />
                ) : (
                  <Icon name="eye" size={18} />
                )}
              </button>
            </div>
            {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}
          </div>

          {/* Remember me */}
          <label className="auth-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <span>Запомнить данные</span>
          </label>

          {/* Submit */}
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider"><span>или</span></div>

        {/* Sign up link */}
        <p className="auth-toggle">
          Нет аккаунта?{' '}
          <a href="#">Создать</a>
        </p>

      </div>
    </div>
  )
}
