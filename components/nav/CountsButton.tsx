import api from '@/lib/api'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { addToast } from '@heroui/toast'
import React from 'react'
import { FaClipboardList } from 'react-icons/fa6'
import useSWR from 'swr'

const fetcher = () => api.get('tickets/count').then(res => res.data).catch(() => addToast({title: 'Hubo un error', description: 'Hubo un error al obtener los datos de invitados e invitaciones', color: 'danger'}))

export default function CountsButton() {

    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const { data, isLoading, mutate } = useSWR('tickets/count', fetcher)

    console.log(data)

    return (
        <>
            <Button className=' bg-opacity-0 rounded-full' isIconOnly onPress={onOpen}>
                <FaClipboardList className=' text-2xl text-primary' />
            </Button>
             <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Detalle de Invitados e Invitaciones</ModalHeader>
                            <ModalBody className='flex flex-col gap-4'>
                                <li className=' ml-4 list-disc'>Invitados que asistirán: <span className=' opacity-75'>{data?.guestConfirmed}</span></li>
                                <li className=' ml-4 list-disc'>Invitados que no asistirán: <span className=' opacity-75'>{data?.guestNotConfirmed}</span></li>
                                <Divider  className='-mb-1.5'/>
                                <p>Invitados totales: <span className=' opacity-75'>{data?.guestTotal}</span></p>
                                <Divider className='-mt-1.5'/>
                                <li className=' ml-4 list-disc'>Tickets de invitado: <span className=' opacity-75'>{data?.namedTickets}</span></li>
                                <li className=' ml-4 list-disc'>Tickets generales: <span className=' opacity-75'>{data?.generalTickets}</span></li>
                                <Divider className='-mb-1.5'/>
                                <p>Tickets totales: <span className=' opacity-75'>{data?.totalTickets}</span></p>
                                <Divider className='-mt-1.5'/>
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
