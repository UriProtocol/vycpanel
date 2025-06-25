import { Button } from '@heroui/button'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Checkbox } from '@heroui/checkbox';
import { FaPlus } from 'react-icons/fa6';
import api from '@/lib/api';
import { addToast } from '@heroui/toast';

const initValues = {
    additionals: 0,
    fullName: '',
    confirmAttendance: false
}

export default function AddGuestButton({ mutate }: { mutate: () => void }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [values, setValues] = useState(initValues)

    const [isLoading, setIsLoading] = useState(false)

    const { additionals, fullName, confirmAttendance } = values;

    function handleChange(value: string | boolean | number, type: 'additionals' | 'fullName' | 'confirmAttendance') {
        setValues(prev => ({ ...prev, [type]: value }))
    }


    async function addGuest(onClose: () => void) {

        if (!fullName) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario otorgarle un nombre al invitado',
                color: 'warning'
            })
            return
        }
        if (additionals < 0) {
            addToast({
                title: 'Error de validación',
                description: 'No se puede tener menos de 0 acompañantes',
                color: 'warning'
            })
            return
        }

        setIsLoading(true)

        try {
            await api.post('guests', { additionals, fullName, confirmAttendance })
            addToast({
                title: 'Invitado agregado exitosamente',
                color: 'success'
            })
            setValues(initValues)
            onClose()
            mutate()

        } catch (error) {

            console.log(error)

            //@ts-expect-error
            if (error?.response?.data?.error?.includes('already exists')) {
                addToast({
                    title: 'Hubo un error',
                    description: 'Hubo un error al agregar al invitado. Ya existe un invitado con este nombre',
                    color: 'danger'
                })
                return
            }

            addToast({
                title: 'Hubo un error',
                description: 'Hubo un error al agregar al invitado. Por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onPress={onOpen} className=' text-lg min-w-0 px-2' color='success' isIconOnly variant='bordered'>
                <FaPlus />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Agregar invitado</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <Input
                                    value={fullName}
                                    onValueChange={(e) => handleChange(e, 'fullName')}
                                    color='primary'
                                    variant='underlined'
                                    label='Nombre del invitado'
                                    labelPlacement='outside' />
                                <div className=' flex gap-6 items-end'>
                                    <Checkbox
                                        isSelected={confirmAttendance}
                                        onValueChange={(e) => handleChange(e, 'confirmAttendance')}
                                        className=''
                                        color='success'><p className=' text-sm text-primary'>¿Asistirá?</p></Checkbox>
                                    <NumberInput
                                        value={additionals}
                                        onValueChange={(e) => handleChange(e, 'additionals')}
                                        color='primary'
                                        variant='underlined'
                                        label='Adicionales'
                                        labelPlacement='outside' />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button isLoading={isLoading} color="primary" variant='bordered' onPress={() => addGuest(onClose)}>
                                    Agregar invitado
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
