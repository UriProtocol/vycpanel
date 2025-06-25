import api from '@/lib/api'
import { Guest } from '@/lib/types'
import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { addToast } from '@heroui/toast'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaEye, FaPlus } from 'react-icons/fa6'
import useSWR from 'swr'


export default function ViewOrGenerateInvitationButton({ g, mutate }: { g: Guest, mutate: () => void }) {

    const router = useRouter()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false)

    async function generateInvitation(onClose: () => void) {
        setIsLoading(true)
        try {
            await api.get(`tickets/activate/${g.id}`)
            addToast({
                title: 'Invitación(es) generada(s) exitosamente',
                color: 'success'
            })
            mutate()
            onClose()
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al generar la invitación, por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                onPress={g.ticketGenerated ? () => { router.push(`/dashboard/invitados/${g.id}/invitation`) } : onOpen}
                color='success'
                variant='bordered'
                className={` ${g.ticketGenerated ? 'col-span-3' : 'col-span-2'}`}
                size='sm'
                fullWidth
                startContent={
                    g.ticketGenerated ? <FaEye /> : <FaPlus />
                }
            >
                {
                    g.ticketGenerated ? 'Ver Invitación' : 'Generar Invitación'
                }
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Generar invitación. Invitado {g.id}</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <h1 className=' text-lg'>
                                    ¿Estás seguro que deseas generar la invitación del invitado &quot;{g.fullName}&quot;? <br /><br />
                                    Una vez generada la invitación, no podrás editarlo.
                                </h1>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                    <Button isLoading={isLoading} color="success" onPress={() => generateInvitation(onClose)} variant='bordered'>
                                    Generar invitación
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
