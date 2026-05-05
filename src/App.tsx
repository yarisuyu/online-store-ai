import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
