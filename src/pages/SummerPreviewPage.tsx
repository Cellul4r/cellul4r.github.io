import { Navigate, useLocation } from 'react-router-dom'

export default function SummerPreviewPage() {
  const { search, hash } = useLocation()
  return <Navigate replace to={{ pathname: '/', search, hash }} />
}
