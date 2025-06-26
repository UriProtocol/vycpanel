"use client"
import api from '@/lib/api'
import { Button } from '@heroui/button'
import { addToast } from '@heroui/toast'
import React from 'react'
import { FaXmark } from 'react-icons/fa6'
import useSWR from 'swr'
import AddGeneralButton from './AddGeneralButton'
import Link from 'next/link'
import DeleteGeneralsButton from './DeleteGeneralsButton'
import { GeneralTicket } from '@/lib/types'
import GeneralTicketInfoButton from './GeneralTicketInfoButton'


const fetcher = () => api.get('tickets/generals').then(res => res.data).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener los tickets generales', color: 'danger' }))

export default function Generales() {
  const { data, isLoading, mutate } = useSWR('tickets/generals', fetcher)
  return (
    <>
      <h1 className=' text-center font-semibold text-2xl mt-4 '>Invitaciones Generales</h1>
      <div className=' mt-4 flex gap-3'>
        <AddGeneralButton mutate={mutate} />
        <DeleteGeneralsButton mutate={mutate}/>
      </div>

      <div className='flex flex-col gap-4 my-6'>
        {
          !isLoading && data && data.toSpliced(50).map((t: GeneralTicket) => {

            return (
              <div key={t.id} className='bg-rose-950/30 rounded-sm p-4 flex items-center justify-between relative'>
                <div className='flex flex-col gap-2 w-full'>
                  <p className=' text-ellipsis overflow-hidden whitespace-nowrap text-sm mb-0.5'>Invitación General #{t.folio}</p>
                  <p className=' text-xs opacity-50 absolute top-3 right-4'>{new Date(t.createdAt).toLocaleDateString()}</p>
                   <div className='flex gap-2 text-sm'>
                        <span className=' text-semibold'>Mesa asignada:</span>
                        {
                            t.tableId ? (
                                <Link href={`/dashboard/mesas/${t.tableId}/table`} className=' opacity-70 underline-offset-2 underline'>{t.tableId}</Link>
                            ) : <p className=' opacity-70'>Sin mesa</p>
                        }
                    </div>
                    <GeneralTicketInfoButton ticket={t}/>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}
