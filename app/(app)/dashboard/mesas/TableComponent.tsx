'use client'
import { Table } from '@/lib/types'
import { Button } from '@heroui/button'
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/drawer'
import { useDisclosure } from '@heroui/modal'
import Link from 'next/link'
import React from 'react'
import { MdTableBar } from 'react-icons/md'

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

export default function TableComponent({ table }: { table: Table }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Link className='mx-auto flex justify-center items-center relative group' href={`/dashboard/mesas/${table.id}/table`}>
                <MdTableBar className=' text-9xl opacity-75 text-[#e8e8e8]' />
                <p className='absolute left-0 bottom-4'>
                    {table.id}.
                </p>
                <div 
                    className=' text-sm text-center absolute w-[97%] mx-auto p-3 bg-[#e8e8e8] rounded-sm text-[#140408] font-medium -mt-[3.25rem] transition-all group-hover:w-full group-hover:py-3.5 shadow-md'
                >{table.name}</div>
            </Link>
            {/*<Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement='left' size='sm' className='bg-[#140408]/80 backdrop-blur-xl'>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Detalles de la mesa: {table.id}.</DrawerHeader>
                            <DrawerBody>
                                <h2 className=' mr-4'>Capacidad: <span className=' opacity-75'>{table.capacity}</span></h2>
                                <p>Invitados:</p>
                                {

                                }
                            </DrawerBody>
                            <DrawerFooter>
                                <Button variant="bordered" color='warning' onPress={onClose}>
                                    Cerrar
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>*/}
        </>
    )
}
