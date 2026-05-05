export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface LoginError {
  message: string
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? 'Ошибка авторизации')
  }

  // Persist tokens in localStorage
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)

  return data as AuthUser
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}
