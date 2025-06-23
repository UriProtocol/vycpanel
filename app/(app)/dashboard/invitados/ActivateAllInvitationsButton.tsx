import api from '@/lib/api'
import { Guest } from '@/lib/types'
import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { addToast } from '@heroui/toast'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaEye, FaPlus } from 'react-icons/fa6'
import useSWR from 'swr'


export default function ActivateAllInvitationsButton({ mutate }: { mutate: () => void }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false)

    async function generateInvitation(onClose: () => void) {
        setIsLoading(true)
        try {
            await api.get(`tickets/activate-all`)
            addToast({
                title: 'Invitaciones generadas exitosamente',
                color: 'success'
            })
            mutate()
            onClose()
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al generar las invitaciones, por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                onPress={onOpen}
                color='primary'
                variant='bordered'
                fullWidth
                startContent={<FaPlus />}
            >
                {
                   'Generar todas las invitaciones'
                }
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Generar todas las invitaciones</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <h1 className=' text-lg'>
                                    ¿Estás seguro que deseas generar las invitaciones de todos los invitados registrados? <br /><br />
                                    Una vez generadas las invitaciones. No podrás editarlos.
                                </h1>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                    <Button isLoading={isLoading} color="success" onPress={() => generateInvitation(onClose)} variant='bordered'>
                                    Generar invitaciones
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
