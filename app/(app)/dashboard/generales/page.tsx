"use client"
import api from '@/lib/api'
import { Button } from '@heroui/button'
import { addToast } from '@heroui/toast'
import React, { useCallback, useEffect, useRef } from 'react'
import { FaXmark } from 'react-icons/fa6'
import useSWRInfinite from 'swr/infinite'
import AddGeneralButton from './AddGeneralButton'
import Link from 'next/link'
import DeleteGeneralsButton from './DeleteGeneralsButton'
import { GeneralTicket } from '@/lib/types'
import GeneralTicketInfoButton from './GeneralTicketInfoButton'
import { Spinner } from '@heroui/spinner'

const PAGE_SIZE = 20; // Adjust based on your needs

const getKey = (pageIndex: number, previousPageData: any) => {
  // Reached the end
  if (previousPageData && !previousPageData.data.length) return null
  
  // First page
  if (pageIndex === 0) return `tickets/generals?page=1&page_size=${PAGE_SIZE}`
  
  // Subsequent pages
  return `tickets/generals?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
}

const fetcher = (url: string) => api.get(url).then(res => res.data).catch(() => {
  addToast({ 
    title: 'Hubo un error', 
    description: 'Hubo un error al obtener los tickets generales', 
    color: 'danger' 
  })
  return { data: [] }
})

export default function Generales() {
  const { data, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
    }
  )

  // Flatten the data array
  const tickets = data ? data.flatMap(page => page.data) : []
  const totalCount = data && data[0] ? data[0].total_count : 0
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.data?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  // Infinite scroll loader
  const loadMoreRef = useRef<HTMLDivElement>(null)

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
  }, [handleObserver, isLoading])

  return (
    <>
      <h1 className='text-center font-semibold text-2xl mt-4'>Invitaciones Generales</h1>
      <div className='mt-4 flex gap-3'>
        <AddGeneralButton mutate={mutate} />
        <DeleteGeneralsButton mutate={mutate}/>
      </div>

      <div className='flex flex-col gap-4 my-6'>
        {tickets.map((t: GeneralTicket) => (
          <div key={t.id} className='bg-rose-950/30 rounded-sm p-4 flex items-center justify-between relative'>
            <div className='flex flex-col gap-2 w-full'>
              <p className='text-ellipsis overflow-hidden whitespace-nowrap text-sm mb-0.5'>
                Invitación General #{t.folio}
              </p>
              <p className='text-xs opacity-50 absolute top-3 right-4'>
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
              <div className='flex gap-2 text-sm'>
                <span className='text-semibold'>Mesa asignada:</span>
                {t.tableId ? (
                  <Link 
                    href={`/dashboard/mesas/${t.tableId}/table`} 
                    className='opacity-70 underline-offset-2 underline'
                  >
                    {t.tableId}
                  </Link>
                ) : <p className='opacity-70'>Sin mesa</p>}
              </div>
              <GeneralTicketInfoButton ticket={t}/>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className='flex justify-center my-4'>
        {isLoadingMore ? (
          <Spinner size='lg' color='danger' />
        ) : isReachingEnd ? (
          //<p className='text-gray-500'>No hay más tickets</p>
          <></>
        ) : null}
      </div>
    </>
  )
}