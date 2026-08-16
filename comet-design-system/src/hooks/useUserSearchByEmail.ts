/**
 * Hook for searching users by email address.
 * Uses React Query for state management and caching.
 */

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { userService, type UserProfile } from '../services/user'

export function useUserSearchByEmail() {
  const [searchedUser, setSearchedUser] = useState<UserProfile | null>(null)

  const mutation = useMutation({
    mutationFn: (email: string) => userService.searchByEmail(email),
    onSuccess: (data) => {
      setSearchedUser(data)
    },
    onError: (error) => {
      console.error('Error searching user by email:', error)
      setSearchedUser(null)
    },
  })

  const searchByEmail = (email: string) => {
    if (!email?.trim()) {
      setSearchedUser(null)
      return
    }
    mutation.mutate(email)
  }

  const clearResults = () => {
    setSearchedUser(null)
    mutation.reset()
  }

  return {
    searchByEmail,
    clearResults,
    user: searchedUser,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
