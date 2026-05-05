import { getAccessToken } from './authApi'

export interface Product {
  id: number
  title: string
  category: string
  brand: string
  sku: string
  rating: number
  price: number
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export async function getProducts(page: number, limit: number, search = ''): Promise<ProductsResponse> {
  const skip = (page - 1) * limit
  const token = getAccessToken()

  const baseUrl = search
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`

  const res = await fetch(baseUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) throw new Error('Не удалось загрузить товары')

  return res.json()
}
