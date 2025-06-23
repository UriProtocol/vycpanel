'use client'
import React, { useState } from 'react'
import { MdTableBar } from "react-icons/md";
import TableComponent from './TableComponent';
import { Input } from '@heroui/input';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import AddGuestButton from '../invitados/AddGuestButton';
import AddTableButton from './AddTableButton';
import api from '@/lib/api';
import { addToast } from '@heroui/toast';
import useSWR from 'swr';
import { Spinner } from '@heroui/spinner';
import { Table } from '@/lib/types';

const exampleTables = [
    {
        "capacity": 10,
        "createdAt": "15/06/2025",
        "id": 1,
        "name": "Mesa"
    },
    {
        "capacity": 10,
        "createdAt": "15/06/2025",
        "id": 2,
        "name": "Mesa 2"
    },
    {
        "capacity": 8,
        "createdAt": "15/06/2025",
        "id": 3,
        "name": "Mesa un poco "
    },
    {
        "capacity": 11,
        "createdAt": "15/06/2025",
        "id": 4,
        "name": "Mesa con una silla más"
    },
    {
        "capacity": 10,
        "createdAt": "15/06/2025",
        "id": 5,
        "name": "Mesa 5"
    },
]

const fetcher = () => api.get('tables').then(res => res.data).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener a las mesas', color: 'danger' }))

export default function Page() {

    const [search, setSearch] = useState('')

    const { data, isLoading, mutate } = useSWR('tables', fetcher)

    return (
        <>
            <h1 className=' text-center font-semibold text-2xl mt-4'>Mesas</h1>
            <div className='flex gap-4 items-center my-4'>
                <AddTableButton mutate={mutate}/>
                <Input
                    color='success'
                    variant='underlined'
                    className=''
                    startContent={
                        <FaMagnifyingGlass className=' opacity-60 mr-2' />
                    }
                    placeholder='Buscar por nombre o id...'
                    value={search}
                    onValueChange={setSearch}
                />
            </div>
            <div className='grid grid-cols-2 gap-4'>
                {
                    !isLoading && data ? (
                        data.filter((t: Table) => `${t.id}. ${t.name}`.toLowerCase().includes(search.toLowerCase())).map((t: Table) => (<TableComponent key={t.id} table={t} />))
                    ) : isLoading ? <div className=' flex justify-center col-span-2'><Spinner size='lg' className=' mt-4' color='danger'/></div> : null
                }
            </div>
        </>
    )
}
