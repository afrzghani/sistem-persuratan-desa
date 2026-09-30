//hooks = tempat logic React yang reusable.
//mengambil data 
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  return useContext(AuthContext)
}