import api from '@/lib/api';
import { Guest, Table } from '@/lib/types';
import { Button } from '@heroui/button'
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import React, { useMemo, useState } from 'react'
import { FaChair, FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'
import useSWR from 'swr';


export default function AssignGuestModal({ mutate, table, data, mutateGuests, isLoading }: { mutate: () => void, table: Table, data: Guest[], mutateGuests: () => void, isLoading: boolean }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [search, setSearch] = useState('')
    const [isLoadingAssign, setIsLoadingAssign] = useState(false)

    const filteredGuests = useMemo(() => {
        const tableGuestIds = new Set(table.guests.map(guest => guest.id));
        return data?.filter((guest: Guest) => !tableGuestIds.has(guest.id) && (guest.confirmAttendance && !guest.tableId) && `${guest.fullName}`.toLowerCase().includes(search)) || [];
    }, [table.guests?.length, data?.length, search]);

    async function handleAssign(g: Guest, onClose: () => void) {
        const guestSize = g.additionals + 1

        if (guestSize > table.capacity) {
            addToast({
                title: 'No se pudo asignar al invitado',
                description: 'No se pudo asignar al invitado: La mesa no cuenta con capacidad suficiente',
                color: 'danger'
            })
            return
        }

        setIsLoadingAssign(true)

        try {

            await api.patch(`guests/assign/${g.id}/${table.id}`)
            addToast({
                title: 'Invitado asignado exitosamente',
                description: `El invitado ${g.fullName} ha sido asignado a la mesa ${table.id} exitosamente`,
                color: 'success'
            })
            mutate()
            mutateGuests()

        } catch (error) {
            addToast({
                title: 'Hubo un error',
                description: `Hubo un error al asignar al invitado a la mesa. Por favor intentalo de nuevo más tarde.`,
                color: 'danger'
            })

        } finally {
            //onClose()
            setIsLoadingAssign(false)
        }
    }

    return (
        <>
            <Button
                variant='bordered'
                color='success'
                onPress={onOpen}
            >
                <FaPlus />
                Asignar invitado
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-2 text-xl">
                                <p >
                                    Asignar invitados a la mesa: {table.id}
                                </p>
                                <Input
                                    color='success'
                                    variant='underlined'
                                    className=''
                                    startContent={
                                        <FaMagnifyingGlass className=' opacity-60 mr-2' />
                                    }
                                    placeholder='Buscar por nombre...'
                                    value={search}
                                    onValueChange={setSearch}
                                />
                            </ModalHeader>
                            <ModalBody className='flex flex-col gap-3 max-h-[70vh] min-h-[70vh] overflow-auto'>
                                <p className=' text-xs opacity-75 mb-2'>Presiona el ícono de la silla para asignar a un invitado a la mesa</p>
                                {
                                    isLoading && <Spinner color='danger' size='lg' className=' mx-auto mt-6' />
                                }
                                {
                                    !isLoading && filteredGuests.map((g: Guest) => {

                                        return (
                                            <div key={g.id} className='bg-rose-950/30 rounded-sm p-4 flex items-center justify-between'>
                                                <div>
                                                    <p className=' text-ellipsis overflow-hidden whitespace-nowrap text-sm mb-0.5'>{g.fullName}</p>
                                                    {
                                                        g.additionals ? (
                                                            <p className=' text-xs opacity-65'>Acompañantes: {g.additionals}</p>
                                                        ) : (
                                                            <p className=' text-xs opacity-65'>Sin acompañantes</p>
                                                        )
                                                    }
                                                </div>
                                                <Button isIconOnly className=' bg-opacity-0 rounded-full' onPress={() => handleAssign(g, onClose)} isDisabled={isLoadingAssign}>
                                                    <FaChair className=' text-2xl text-success' />
                                                </Button>
                                            </div>
                                        )
                                    })
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                {/*<Button isLoading={isLoadingDelete} color="danger" onPress={() => handelDeleteTable(onClose)} variant='bordered'>
                                    Eliminar mesa
                                </Button>*/}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
