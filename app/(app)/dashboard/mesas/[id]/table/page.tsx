'use client'
import api from '@/lib/api'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { NumberInput } from '@heroui/number-input'
import { Spinner } from '@heroui/spinner'
import { addToast } from '@heroui/toast'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus, FaXmark } from 'react-icons/fa6'
import useSWR from 'swr'
import { AnimatePresence, motion } from 'framer-motion'
import AssignGuestModal from './AssignGuestModal'
import { GeneralTicket, Guest, Table } from '@/lib/types'
import UnassignGuestModal from './UnassignGuestModal'
import AssignGeneralModal from './AssignGeneralModal'
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 20;

const getGuestsKey = (pageIndex: number, previousPageData: any, search: string) => {
    // Reached the end
    if (previousPageData && !previousPageData.data.length) return null

    // First page, we don't have `previousPageData`
    if (pageIndex === 0) return `guests/unassigned?page=1&page_size=${PAGE_SIZE}&search=${search}`

    // Add the search parameter to subsequent pages
    return `guests/unassigned?page=${pageIndex + 1}&page_size=${PAGE_SIZE}&search=${search}`
}

const guestsFetcher = (url: string) => api.get(url).then(res => res.data).catch(() => {
    addToast({
        title: 'Hubo un error',
        description: 'Hubo un error al obtener a los invitados',
        color: 'danger'
    })
    return {data: []}
})

const getGeneralsKey = (pageIndex: number, previousPageData: any) => {
    // Reached the end
    if (previousPageData && !previousPageData.data.length) return null

    // First page, we don't have `previousPageData`
    if (pageIndex === 0) return `tickets/generals-unassigned?page=1&page_size=${PAGE_SIZE}`

    // Add the search parameter to subsequent pages
    return `tickets/generals-unassigned?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
}

const generalsFetcher = (url: string) => api.get(url).then(res => res.data).catch(() => {
    addToast({
        title: 'Hubo un error',
        description: 'Hubo un error al obtener a los invitados',
        color: 'danger'
    })
    return { data: [] }
})

const fetcher = ([url]: [url: string]) => api.get(url).then(res => res.data as Table).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener los datos de la mesa', color: 'danger' }))
//const guestsFetcher = () => api.get('guests').then(res => res.data as {data: Guest[]}).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener a los invitados', color: 'danger' }))
//const generalsFetcher = () => api.get('tickets/generals').then(res => res.data as {data: GeneralTicket[]}).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener las invitaciones generales', color: 'danger' }))

const initValues = {
    nombre: '',
    capacidad: 0
}

export default function TablesPage() {

    const { id } = useParams()

    const { data: table, isLoading: isLoadingTable, mutate } = useSWR([`tables/guests/${id || ''}`], fetcher)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoadingDelete, setIsLoadingDelete] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [values, setValues] = useState(initValues)

    //-------------For guests infinite scroll----------------------
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const { data: guestsData, size: sizeGuests, setSize: setSizeGuests, isLoading: isLoadingGuests, mutate: mutateGuests } = useSWRInfinite(
        (pageIndex, previousPageData) => getGuestsKey(pageIndex, previousPageData, debouncedSearch),
        guestsFetcher,
        {
            revalidateFirstPage: false,
        }
    )

    useEffect(() => {

        setSizeGuests(1)
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search])
    //-------------For guests infinite scroll----------------------
    //-------------For generals infinite scroll--------------------
      const { data: generalsData, size: sizeGenerals, setSize: setSizeGenerals, isLoading: isLoadingGenerals, mutate: mutateGenerals } = useSWRInfinite(
        (pageIndex, previousPageData) => getGeneralsKey(pageIndex, previousPageData),
        generalsFetcher,
        {
            revalidateFirstPage: false,
        }
    )

    //-------------For generals infinite scroll--------------------


    const router = useRouter()

    async function handleDeleteTable(onClose: () => void) {
        setIsLoadingDelete(true)
        try {
            await api.delete(`tables/${id}`)
            addToast({
                title: 'Mesa eliminada exitosamente',
                color: 'warning'
            })
            router.push('/dashboard/mesas')

        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al intentar eliminar esta mesa. Por favor intentalo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoadingDelete(false)
            onClose()
        }
    }
    async function handleUpdateTable() {
        setIsLoadingUpdate(true)

        if (guestSize.occupied > values.capacidad) {
            addToast({
                title: 'No se pudo actualizar',
                description: 'No se pudo actualizar esta mesa: La capacidad de la mesa debe de ser mayor al número de invitados asignados. Si quieres reducir la capacidad, desvincula invitados primero.',
                color: 'danger'
            })
            return
        }

        try {
            await api.patch(`tables/${id}`, {
                capacity: values.capacidad,
                name: values.nombre
            })
            addToast({
                title: 'Mesa actualizada exitosamente',
                color: 'success'
            })
            mutate()
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al intentar actualizar esta mesa. Por favor intentalo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoadingUpdate(false)
        }
    }


    function handleChange(value: string | number, type: 'nombre' | 'capacidad') {
        if (!hasChanged) setHasChanged(true)
        setValues(prev => ({ ...prev, [type]: value }))
    }

    const guestSize = useMemo(() => {

        if (!table) {
            return {
                occupied: 0,
                capacity: 0
            }
        }

        const occupied = (table?.guests?.reduce((acc: number, cur: Guest) => acc + cur.additionals, 0) || 0) + (table?.guests?.length || 0) + table?.generals?.length || 0
        const capacity = occupied + table?.capacity

        return {
            occupied,
            capacity
        }
    }, [table?.guests?.length, table?.generals?.length])


    useEffect(() => {

        if (!table?.id) return

        setValues({
            nombre: table.name,
            capacidad: table.capacity
        })

    }, [table?.id])


    return (
        <>
            <div className=' flex flex-col gap-4'>
                <h1 className=' text-2xl text-success text-center my-4'>Detalles de la mesa {id}</h1>
                {
                    isLoadingTable && (
                        <Spinner className=' mx-auto' size='lg' color='danger' />
                    )
                }
                {
                    !!table && (
                        <>
                            <p >Fecha de creación: <span className=' opacity-70'>{new Date(table.createdAt).toLocaleDateString()}</span></p>
                            <Input
                                variant='underlined'
                                color='primary'
                                label='Nombre'
                                //labelPlacement='outside'
                                className=' -mt-2'
                                value={values.nombre}
                                onValueChange={e => handleChange(e, 'nombre')}
                            />
                            <NumberInput
                                variant='underlined'
                                color='primary'
                                label='Capacidad'
                                //labelPlacement='outside'
                                value={values.capacidad}
                                onValueChange={e => handleChange(e, 'capacidad')}
                                maxValue={20}
                                isDisabled
                            />
                            <div className='grid grid-cols-2 gap-4 mt-2'>
                                <Button
                                    variant='bordered'
                                    color='danger'
                                    size='sm'
                                    onPress={onOpen}
                                >
                                    Eliminar mesa
                                </Button>
                                <AnimatePresence>
                                    {
                                        hasChanged && !!values.capacidad && !!values.nombre && (
                                            <motion.div
                                                className=' w-full'
                                                initial={{
                                                    y: -5,
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    y: 0,
                                                    opacity: 1
                                                }}
                                                exit={{
                                                    y: -5,
                                                    opacity: 0
                                                }}
                                            >
                                                <Button
                                                    variant='bordered'
                                                    color='primary'
                                                    size='sm'
                                                    fullWidth
                                                    onPress={handleUpdateTable}
                                                    isLoading={isLoadingUpdate}
                                                >
                                                    Guardar cambios
                                                </Button>
                                            </motion.div>
                                        )
                                    }
                                </AnimatePresence>
                            </div>
                            <Divider />
                            <div className='flex justify-between'>
                                <p>Capacidad: </p>
                                <p>{guestSize.occupied} / {guestSize.capacity}</p>
                            </div>
                            {
                                !!table?.guests?.length && (
                                    <>
                                        <div className=' flex justify-between'>
                                            <p>Invitados: </p>
                                        </div>
                                        <div className='flex flex-col gap-3 mb-4'>
                                            {
                                                table?.guests?.map((g: Guest) => {

                                                    return (
                                                        <div key={g.id + '-guest'} className='bg-rose-950/30 rounded-sm p-4 flex items-center justify-between'>
                                                            <div>
                                                                <p className='text-ellipsis overflow-hidden whitespace-nowrap text-sm mb-0.5'>{g.fullName}</p>
                                                                {
                                                                    g.additionals ? (
                                                                        <p className=' text-xs opacity-65'>Acompañantes: {g.additionals}</p>
                                                                    ) : (
                                                                        <p className=' text-xs opacity-65'>Sin acompañantes</p>
                                                                    )
                                                                }
                                                            </div>
                                                            <UnassignGuestModal mutate={mutate} mutateGuests={mutateGuests} id={g.id} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                )
                            }
                            {
                                !!table?.generals?.length && (
                                    <>
                                        <div className=' flex justify-between'>
                                            <p>Tickets generales: </p>
                                        </div>
                                        <div className='flex flex-col gap-3 mb-4'>
                                            {
                                                table?.generals?.map((g: GeneralTicket) => {

                                                    return (
                                                        <div key={g.id + '-general'} className='bg-rose-950/30 rounded-sm p-4 flex items-center justify-between'>
                                                            <div>
                                                                <p className='text-ellipsis overflow-hidden whitespace-nowrap text-sm mb-0.5'>Ticket general #{g.folio}</p>
                                                            </div>
                                                            <UnassignGuestModal mutate={mutate} mutateGuests={mutateGuests} id={g.id} isGeneral />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>

                                )
                            }
                            {
                                guestSize.occupied < guestSize.capacity && (
                                    <div className='grid grid-cols-2 gap-3'>
                                        <AssignGuestModal 
                                            mutate={mutate} 
                                            table={table} 
                                            data={guestsData} 
                                            isLoading={isLoadingGuests} 
                                            mutateGuests={mutateGuests} 
                                            size={sizeGuests} 
                                            setSize={setSizeGuests} 
                                            search={search}
                                            debouncedSearch={debouncedSearch}
                                            setSearch={setSearch}
                                        />
                                        <AssignGeneralModal 
                                            mutate={mutate} 
                                            table={table} 
                                            data={generalsData} 
                                            isLoading={isLoadingGenerals} 
                                            mutateGenerals={mutateGenerals} 
                                            size={sizeGenerals} 
                                            setSize={setSizeGenerals} 
                                        />
                                        {/*<AssignGeneralModal mutate={mutate} table={table} data={generalTickets?.data || []} isLoading={isLoadingGeneralTickets} mutateGuests={mutateGeneralTickets} />*/}
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
            {/*Delete confirmation modal*/}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Eliminar mesa {id}</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <h1 className=' text-lg'>
                                    ¿Estás seguro que deseas eliminar la mesa &quot;{table?.name}&quot;?
                                </h1>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                <Button isLoading={isLoadingDelete} color="danger" onPress={() => handleDeleteTable(onClose)} variant='bordered'>
                                    Eliminar mesa
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
