import { Guest } from '@/lib/types';
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Checkbox } from '@heroui/checkbox';
import { Input } from '@heroui/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { NumberInput } from '@heroui/number-input';
import React, { useState } from 'react'
import { FaEye, FaPen, FaPlus, FaXmark } from "react-icons/fa6";
import EditGuestButton from './EditguestButton';
import api from '@/lib/api';
import { addToast } from '@heroui/toast';
import ViewOrGenerateInvitationButton from './ViewOrGenerateInvitationButton';


export default function GuestCard({ g, mutate }: { g: Guest, mutate: () => void}) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    async function handelDeleteGuest(onClose: () => void){
        setIsLoadingDelete(true)
        try {
            await api.delete(`guests/${g.id}`)
            addToast({
                title: 'Invitado eliminado exitosamente',
                color: 'warning'
            })
            mutate()
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al intentar eliminar a este invitado. Por favor intentalo más tarde',
                color: 'danger'
            })
        }finally{
            setIsLoadingDelete(false)
            onClose()
        }
    }

    return (
        <>
            <Card className='p-2 bg-opacity-60 relative bg-[#140408]/80 '>
                <CardHeader>
                    <p>{g.id}. {g.fullName}</p>
                    <p className=' text-xs opacity-50 absolute top-[1.15rem] right-12'>{new Date(g.createdAt).toLocaleDateString()}</p>
                    <Button 
                        onPress={onOpen}
                        isIconOnly 
                        className=' text-red-600/25 transition-all hover:text-red-600/40 text-xl top-4 right-4 absolute p-0 min-h-0 min-w-0 bg-opacity-0 w-fit h-fit'>
                        <FaXmark />
                    </Button>
                </CardHeader>
                <CardBody className='flex flex-col gap-4 text-sm'>
                    <div className='flex gap-2'>
                        <span className=' text-semibold'>¿Asistirá?:</span> <p className=' opacity-70'>{g.confirmAttendance ? 'Si' : 'No'}</p>
                    </div>
                    <div className='flex gap-2'>
                        <span className=' text-semibold'>Mesa asignada:</span> <p className=' opacity-70'>{g.tableId ? g.tableId : 'Sin mesa'}</p>
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                        <EditGuestButton guest={g} mutate={mutate}/>
                        <ViewOrGenerateInvitationButton g={g} mutate={mutate}/>
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Eliminar invitado {g.id}</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <h1 className=' text-lg'>
                                    ¿Estás seguro que deseas eliminar al invitado "{g.fullName}"?
                                </h1>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" onPress={onClose} variant='bordered'>
                                    Cancelar
                                </Button>
                                <Button isLoading={isLoadingDelete} color="danger" onPress={() => handelDeleteGuest(onClose)} variant='bordered'>
                                    Eliminar invitado
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
