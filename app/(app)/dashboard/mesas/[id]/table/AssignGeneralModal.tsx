import api from '@/lib/api';
import { GeneralTicket, Guest, Table } from '@/lib/types';
import { Button } from '@heroui/button'
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import React, { useMemo, useState } from 'react'
import { FaChair, FaHashtag, FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'
import useSWR from 'swr';


export default function AssignGeneralModal({ mutate, table, data, mutateGuests, isLoading }: { mutate: () => void, table: Table, data: GeneralTicket[], mutateGuests: () => void, isLoading: boolean }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [search, setSearch] = useState('')
    const [isLoadingAssign, setIsLoadingAssign] = useState(false)

    const filteredGenerals = useMemo(() => {
        const tableGeneralsIds = new Set(table.generals.map(general => general.id));
        return data?.filter((general: GeneralTicket) => !tableGeneralsIds.has(general.id) && `${general.folio}`.includes(search)) || [];
    }, [table.generals?.length, data?.length, search]);

    async function handleAssign(g: GeneralTicket, onClose: () => void) {

        if (table.capacity < 1) {
            addToast({
                title: 'No se pudo asignar la invitación general',
                description: 'No se puede asignar la invitación: La mesa no cuenta con capacidad suficiente',
                color: 'danger'
            })
            return
        }

        setIsLoadingAssign(true)

        try {

            await api.patch(`generals/assign/${g.id}/${table.id}`)
            addToast({
                title: 'Invitación asignada exitosamente',
                description: `La invitación general #${g.folio} ha sido asignado a la mesa ${table.id} exitosamente`,
                color: 'success'
            })
            mutate()
            mutateGuests()

        } catch (error) {
            addToast({
                title: 'Hubo un error',
                description: `Hubo un error al asignar la invitación. Por favor intentalo de nuevo más tarde.`,
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
                color='primary'
                onPress={onOpen}
            >
                <FaPlus />
                Asignar invitación general
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-2 text-xl">
                                <p >
                                    Asignar invitación general a la mesa: {table.id}
                                </p>
                                <Input
                                    color='success'
                                    variant='underlined'
                                    className=''
                                    startContent={
                                        <div className='flex gap-4'>
                                            <FaMagnifyingGlass className=' opacity-60' />
                                            <FaHashtag className=' opacity-60'/>
                                        </div>
                                    }
                                    placeholder='Buscar por folio...'
                                    value={search}
                                    onValueChange={setSearch}
                                />
                            </ModalHeader>
                            <ModalBody className='flex flex-col gap-3 max-h-[70vh] min-h-[70vh] overflow-auto'>
                                <p className=' text-xs opacity-75 mb-2'>Presiona el ícono de la silla para asignar a una invitación general a la mesa</p>
                                {
                                    isLoading && <Spinner color='danger' size='lg' className=' mx-auto mt-6' />
                                }
                                {
                                    !isLoading && filteredGenerals.map((g: GeneralTicket) => {

                                        return (
                                            <div key={g.id} className='bg-rose-950/30 rounded-sm p-4 flex items-center justify-between'>
                                                <div>
                                                    <p className=' text-ellipsis overflow-hidden whitespace-nowrap text-sm mb-0.5'>Ticket general #{g.folio}</p>
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
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
