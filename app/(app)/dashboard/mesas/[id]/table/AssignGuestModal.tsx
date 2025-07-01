import api from '@/lib/api';
import { Guest, Table } from '@/lib/types';
import { Button } from '@heroui/button'
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaChair, FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'


export default function AssignGuestModal(
    { mutate, table, data, mutateGuests, isLoading, search, debouncedSearch, setSearch, size, setSize }:
        { mutate: () => void, table: Table, data: any, mutateGuests: () => void, isLoading: boolean, search: string, debouncedSearch: string, setSearch: (search: string) => void, size: number, setSize: any }
) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoadingAssign, setIsLoadingAssign] = useState(false)

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

    //-----------------------Infinite scroll logic--------------------
    const guests = data ? data.flatMap((page: any) => page.data) : []
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
    const isEmpty = data?.[0]?.data?.length === 0
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length < 20)

    // Infinite scroll loader
    const loadMoreRef = React.useRef<HTMLDivElement>(null)

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries
        if (target.isIntersecting && !isLoadingMore && !isReachingEnd) {
            setSize(size + 1)
        }
    }, [isLoadingMore, isReachingEnd, setSize, size])

    useEffect(() => {

        const scrollContainer = document.querySelector('.modal-body');
        if (!scrollContainer) {
            return
        }

        const observer = new IntersectionObserver(handleObserver, {
            root: scrollContainer,
            rootMargin: '20px',
            threshold: 0,
        })

        if (loadMoreRef.current) observer.observe(loadMoreRef.current)

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current)
        }
    }, [handleObserver, isLoading, debouncedSearch, isOpen])

    //-----------------------Infinite scroll logic--------------------

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
                            <ModalBody className='flex flex-col gap-3 max-h-[70vh] min-h-[70vh] overflow-auto modal-body'>
                                <p className=' text-xs opacity-75 mb-2'>Presiona el ícono de la silla para asignar a un invitado a la mesa</p>
                                {
                                    isLoading && <Spinner color='danger' size='lg' className=' mx-auto mt-6' />
                                }
                                {
                                    !isLoading && guests.map((g: Guest) => {

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
                                <div ref={loadMoreRef} className='flex justify-center my-4'>
                                    {isLoadingMore ? (
                                        <Spinner size='lg' color='danger' />
                                    ) : isReachingEnd ? (
                                        <p className='text-gray-500'>No hay más invitados</p>
                                    ) : null}
                                </div>
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
