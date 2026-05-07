import { useEffect, useRef, useState } from 'react'
import './Toast.css'

export interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(() => setVisible(false), duration - 300)
    const close = setTimeout(() => onCloseRef.current(), duration)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
      clearTimeout(close)
    }
  }, [duration])

  return (
    <div className={`toast ${visible ? 'toast--visible' : ''}`} role="status" aria-live="polite">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>{message}</span>
    </div>
  )
}
