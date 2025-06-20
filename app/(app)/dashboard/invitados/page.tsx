"use client"
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import AddGuestButton from './AddGuestButton'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import GuestCard from './GuestCard'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import api from '@/lib/api'
import useSWR from 'swr'
import { Spinner } from '@heroui/spinner'
import { addToast } from '@heroui/toast'

const exampleGuests = [
    {
        "additionals": 3,
        "confirmAttendance": true,
        "createdAt": "15/06/2025",
        "fullName": "Dieg",
        "id": 1,
        "tableId": 0,
        "ticketGenerated": false
    },
    {
        "additionals": 0,
        "confirmAttendance": true,
        "createdAt": "15/06/2025",
        "fullName": "Diego 2",
        "id": 2,
        "tableId": 1,
        "ticketGenerated": false
    },
    {
        "additionals": 1,
        "confirmAttendance": true,
        "createdAt": "15/06/2025",
        "fullName": "Yo",
        "id": 3,
        "tableId": 1,
        "ticketGenerated": true
    },
    {
        "additionals": 0,
        "confirmAttendance": true,
        "createdAt": "15/06/2025",
        "fullName": "Uris",
        "id": 4,
        "tableId": 2,
        "ticketGenerated": true
    },
    {
        "additionals": 0,
        "confirmAttendance": false,
        "createdAt": "15/06/2025",
        "fullName": "Dieg",
        "id": 5,
        "tableId": 0,
        "ticketGenerated": false
    },
    {
        "additionals": 3,
        "confirmAttendance": true,
        "createdAt": "15/06/2025",
        "fullName": "Dieg",
        "id": 6,
        "tableId": 0,
        "ticketGenerated": true
    },
]


const fetcher = () => api.get('guests').then(res => res.data).catch(() => addToast({title: 'Hubo un error', description: 'Hubo un error al obtener a los invitados', color: 'danger'}))

export default function page() {

    const [search, setSearch] = useState('')

    const { data, isLoading, mutate } = useSWR('guests', fetcher)

    return (
        <div>
            <h1 className=' text-center font-semibold text-2xl mt-4 '>Invitados</h1>
            <div className='flex gap-4 items-center mt-4'>
                <AddGuestButton mutate={mutate}/>
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
            <div className='grid sm:grid-cols-2 gap-4 mt-6'>
                {
                    !isLoading && data ? (
                        data?.filter((g: typeof exampleGuests[0]) => `${g.id}. ${g.fullName}`.includes(search)).map((g: typeof exampleGuests[0]) => {
                            return (
                                <GuestCard key={g.id} g={g} mutate={mutate}/>
                            )
                        })
                    ) : isLoading ? <div className='flex justify-center'><Spinner size='lg' className=' mt-4' color='danger'/> </div>: null
                }
            </div>
        </div>
    )
}
