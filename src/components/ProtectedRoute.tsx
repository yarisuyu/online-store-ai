import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../api/authApi'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  if (!getAccessToken()) {
    return <Navigate to="/auth" replace />
  }
  return <>{children}</>
}
