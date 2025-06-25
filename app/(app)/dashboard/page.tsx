'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


export default function DashboardPage() { //En el dashboard se mostrarán las mesas

  const router = useRouter()

  useEffect(() =>{
    router.push('/dashboard/mesas')
  }, [])

  return (
    <></>
  )
}
