'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { MdTableBar } from "react-icons/md";
import TableComponent from './TableComponent';
import { Input } from '@heroui/input';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import AddGuestButton from '../invitados/AddGuestButton';
import AddTableButton from './AddTableButton';
import api from '@/lib/api';
import { addToast } from '@heroui/toast';
import useSWRInfinite from 'swr/infinite';
import { Spinner } from '@heroui/spinner';
import { Table } from '@/lib/types';

const PAGE_SIZE = 20; // Adjust based on your needs

const getKey = (pageIndex: number, previousPageData: any, search: string) => {
  // Reached the end
  if (previousPageData && !previousPageData.data.length) return null
  
  // First page
  if (pageIndex === 0) return `tables?page=1&page_size=${PAGE_SIZE}&search=${search}`
  
  // Subsequent pages
  return `tables?page=${pageIndex + 1}&page_size=${PAGE_SIZE}&search=${search}`
}

const fetcher = (url: string) => api.get(url).then(res => res.data).catch(() => {
  addToast({ 
    title: 'Hubo un error', 
    description: 'Hubo un error al obtener las mesas', 
    color: 'danger' 
  })
  return { data: [] }
})

export default function Page() {
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
  const tables = data ? data.flatMap(page => page.data) : []
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
      <h1 className='text-center font-semibold text-2xl mt-4'>Mesas</h1>
      <div className='flex gap-4 items-center my-4'>
        <AddTableButton mutate={mutate}/>
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
      
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        {tables
          .filter((t: Table) => `${t.id}. ${t.name}`.toLowerCase().includes(search.toLowerCase()))
          .map((t: Table) => (
            <TableComponent key={t.id} table={t} />
          ))
        }
      </div>
      
      <div ref={loadMoreRef} className='flex justify-center my-4'>
        {isLoadingMore ? (
          <Spinner size='lg' color='danger' />
        ) : isReachingEnd ? (
        //  <p className='text-gray-500'>No hay más mesas</p>
        <></>
        ) : null}
      </div>
    </>
  )
}