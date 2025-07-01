"use client"
import React, { useState, useCallback, useEffect } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import AddGuestButton from './AddGuestButton'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import GuestCard from './GuestCard'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import api from '@/lib/api'
import useSWRInfinite from 'swr/infinite'
import { Spinner } from '@heroui/spinner'
import { addToast } from '@heroui/toast'
import ActivateAllInvitationsButton from './ActivateAllInvitationsButton'

const PAGE_SIZE = 20;

const getKey = (pageIndex: number, previousPageData: any, search: string) => {
  // Reached the end
  if (previousPageData && !previousPageData.data.length) return null
  
  // First page, we don't have `previousPageData`
  if (pageIndex === 0) return `guests?page=1&page_size=${PAGE_SIZE}&search=${search}`
  
  // Add the search parameter to subsequent pages
  return `guests?page=${pageIndex + 1}&page_size=${PAGE_SIZE}&search=${search}`
}

const fetcher = (url: string) => api.get(url).then(res => res.data).catch(() => {
  addToast({
    title: 'Hubo un error', 
    description: 'Hubo un error al obtener a los invitados', 
    color: 'danger'
  })
  return { data: [] }
})

export default function GuestsPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [search])

  const { data, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, debouncedSearch),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  )

  // Flatten the data array
  const guests = data ? data.flatMap(page => page.data) : []
  const totalCount = data && data[0] ? data[0].total_count : 0
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.data?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  // Infinite scroll loader
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1)
    }
  }, [isLoadingMore, isReachingEnd, setSize, size])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    })
    
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current)
    }
  }, [handleObserver, isLoading, debouncedSearch])

  return (
    <>
      <h1 className='text-center font-semibold text-2xl mt-4'>Invitados</h1>
      <div className='flex gap-4 items-center mt-4'>
        <AddGuestButton mutate={mutate}/>
        <Input
          color='success'
          variant='underlined'
          className=''
          startContent={
            <FaMagnifyingGlass className='opacity-60 mr-2' />
          }
          placeholder='Buscar por nombre o id...'
          value={search}
          onValueChange={setSearch}
        />
      </div>
      <div className='mt-4'>
        <ActivateAllInvitationsButton mutate={mutate}/>
      </div>
      
      <div className='grid sm:grid-cols-2 gap-4 mt-4 mb-6'>
        {guests.map((g) => (
          <GuestCard key={g.id} g={g} mutate={mutate}/>
        ))}
      </div>
      
      <div ref={loadMoreRef} className='flex justify-center my-4'>
        {isLoadingMore ? (
          <Spinner size='lg' color='danger' />
        ) : isReachingEnd ? (
          <p className='text-gray-500'>No hay más invitados</p>
        ) : null}
      </div>
    </>
  )
}