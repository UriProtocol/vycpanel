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
import Link from 'next/link';


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
            <div className='px-5 py-4 bg-opacity-60 relative bg-rose-950/20 rounded-sm '>
                <div>
                    <p className='max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap'>{g.id}. {g.fullName}</p>
                    <p className=' text-xs opacity-50 absolute top-[1.15rem] right-12'>{new Date(g.createdAt).toLocaleDateString()}</p>
                    <Button 
                        onPress={onOpen}
                        isIconOnly 
                        className=' text-red-600/25 transition-all hover:text-red-600/40 text-xl top-4 right-4 absolute p-0 min-h-0 min-w-0 bg-opacity-0 w-fit h-fit'>
                        <FaXmark />
                    </Button>
                </div>
                <div className='flex flex-col gap-2 text-sm mt-3'>
                    <div className='flex gap-2'>
                        <span className=' text-semibold'>¿Asistirá?:</span> <p className=' opacity-70'>{g.confirmAttendance ? 'Si' : 'No'}</p>
                    </div>
                    <div className='flex gap-2'>
                        <span className=' text-semibold'>Mesa asignada:</span>
                        {
                            g.tableId ? (
                                <Link href={`/dashboard/mesas/${g.tableId}/table`} className=' opacity-70 underline-offset-2 underline'>{g.tableId}</Link>
                            ) : <p className=' opacity-70'>Sin mesa</p>
                        }
                    </div>
                    <div className='grid grid-cols-3 gap-4 mt-3'>
                        {
                            !g.ticketGenerated && (
                                <EditGuestButton guest={g} mutate={mutate}/>
                            )
                        }
                        <ViewOrGenerateInvitationButton g={g} mutate={mutate}/>
                    </div>
                </div>
            </div>
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
