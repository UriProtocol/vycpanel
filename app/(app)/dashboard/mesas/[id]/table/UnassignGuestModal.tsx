import api from '@/lib/api'
import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { addToast } from '@heroui/toast'
import React, { useState } from 'react'
import { FaXmark } from 'react-icons/fa6'

export default function UnassignGuestModal({ mutate, mutateGuests, id, isGeneral = false }: { mutate: () => void, mutateGuests: ()=> void, id: number, isGeneral?: boolean }) {

    const [isLoadingUnassign, setIsLoadingUnassign] = useState(false)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    async function handleUnassign(onClose: () => void) {
        setIsLoadingUnassign(true)
        try {

            const endpoint = isGeneral ? `generals/unassign/${id}` : `guests/unassign/${id}`

            await api.patch(endpoint)
            addToast({
                title: 'Invitado desvinculado exitosamente',
                color: 'warning'
            })
            mutate()
            mutateGuests()
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al intentar desvincular a este invitado. Por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoadingUnassign(false)
            onClose()
        }
    }

    return (
        <>
            <Button isIconOnly className=' bg-opacity-0 rounded-full' onPress={onOpen}>
                <FaXmark className=' text-2xl text-success' />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Desvincular invitado</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <h1 className=' text-lg'>
                                    ¿Estás seguro que deseas desvincular a este invitado?
                                </h1>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                <Button isLoading={isLoadingUnassign} color="success" onPress={() => handleUnassign(onClose)} variant='bordered'>
                                    Desvincular
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
