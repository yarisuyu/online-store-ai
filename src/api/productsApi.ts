import { getAccessToken } from './authApi'

export interface Product {
  id: number
  title: string
  category: string
  brand: string | undefined
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

export async function getProducts(
  page: number,
  limit: number,
  search = '',
  sortBy: string | null = null,
  order: 'asc' | 'desc' = 'asc',
): Promise<ProductsResponse> {
  const skip = (page - 1) * limit
  const token = getAccessToken()

  const sortParams = sortBy ? `&sortBy=${encodeURIComponent(sortBy)}&order=${order}` : ''

  const baseUrl = search
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}${sortParams}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}${sortParams}`

  const res = await fetch(baseUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) throw new Error('Не удалось загрузить товары')

  return res.json()
}

export interface NewProduct {
  title: string
  price: number
  brand: string
  sku: string
}

export async function addProduct(data: NewProduct): Promise<Product> {
  const token = getAccessToken()

  const res = await fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Не удалось добавить товар')

  return res.json()
}
