import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user'
import { queryKeys } from '../lib/queryKeys'
import { useState } from 'react'

export function useAllUsers(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.user.allUsers(page, limit),
    queryFn: () => userService.getAllUsers(page, limit),
    staleTime: 60_000,
  })
}

export function useUsersWithSearch(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError, error } = useAllUsers(page, limit)

  // Filter users by search query (name, username, or email)
  const filteredUsers = data?.users.filter(user => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    return (
      user.name?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }) || []

  return {
    users: filteredUsers,
    allUsers: data?.users || [],
    total: data?.total || 0,
    isLoading,
    isError,
    error,
    page,
    limit,
    searchQuery,
    setPage,
    setLimit,
    setSearchQuery,
  }
}
