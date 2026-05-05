import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthPage.css'

export default function AuthPage() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/products')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Icon */}
        <div className="auth-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2 10v4h3l4 4V6L5 10H2zm13.07-2.07a7 7 0 0 1 0 8.14M17.95 5.05a11 11 0 0 1 0 13.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <rect x="1" y="10" width="3" height="4" rx="0.5" fill="currentColor"/>
            <path d="M9 6.5v11l-4-4H2v-3h3l4-4z" fill="currentColor"/>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M18.5 5.5a9 9 0 0 1 0 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          </svg>
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
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input
                id="login"
                type="text"
                autoComplete="username"
                placeholder="Введите логин"
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
              />
              {login && (
                <button
                  type="button"
                  className="auth-input-action"
                  onClick={() => setLogin('')}
                  aria-label="Очистить"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Password field */}
          <div className="auth-field">
            <label htmlFor="password">Пароль</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Введите пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-input-action"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
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
          <button type="submit" className="auth-submit">Войти</button>

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
