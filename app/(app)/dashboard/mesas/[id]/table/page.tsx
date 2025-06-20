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
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import useSWR from 'swr'

const fetcher = ([url]: [url: string]) => api.get(url).then(res => res.data).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener los datos de la mesa', color: 'danger' }))

export default function page() {

    const { id } = useParams()

    const { data: table, isLoading: isLoadingTable } = useSWR([`tables/guests/${id || ''}`], fetcher)

      const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    const router = useRouter()

    async function handelDeleteTable(onClose: () => void){
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
        }finally{
            setIsLoadingDelete(false)
            onClose()
        }
    }


    return (
        <>
            <div className=' flex flex-col gap-4'>
                <h1 className=' text-2xl text-success text-center my-4'>Detalles de la mesa {id}</h1>
                {
                    isLoadingTable && (
                        <Spinner className=' mx-auto' size='lg' />
                    )
                }
                {
                    table && (
                        <>
                            <p >Fecha de creación: <span className=' opacity-70'>{new Date(table.createdAt).toLocaleDateString()}</span></p>
                            <Input 
                                variant='underlined'
                                color='primary'
                                label='Nombre'
                                //labelPlacement='outside'
                                defaultValue={table.name}
                            />
                            <NumberInput 
                                variant='underlined'
                                color='primary'
                                label='Capacidad'
                                //labelPlacement='outside'
                                defaultValue={table.capacity}
                            />
                            <div className='grid grid-cols-2 gap-4'>
                                <Button 
                                    variant='bordered'
                                    color='primary'
                                    size='sm'
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant='bordered'
                                    color='danger'
                                    size='sm'
                                    onPress={onOpen}
                                >
                                    Eliminar
                                </Button>
                            </div>
                            <Divider />
                            <p>Invitados:</p>
                            <div className='flex flex-col gap-3'>
                                <Button
                                    variant='bordered'
                                    color='success'
                                >
                                    <FaPlus />
                                    Asignar invitado
                                </Button>
                            </div>
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
                                    ¿Estás seguro que deseas eliminar la mesa "{table.name}"?
                                </h1>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                <Button isLoading={isLoadingDelete} color="danger" onPress={() => handelDeleteTable(onClose)} variant='bordered'>
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
