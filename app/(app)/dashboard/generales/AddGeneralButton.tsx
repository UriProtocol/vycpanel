import { Button } from '@heroui/button'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Checkbox } from '@heroui/checkbox';
import { FaPlus } from 'react-icons/fa6';
import { addToast } from '@heroui/toast';
import api from '@/lib/api';

export default function AddGeneralButton({ mutate }: { mutate: () => void }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    const [count, setCount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)


    async function addGeneral(onClose: () => void) {

        if (!count || count < 1) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario seleccionar una cantidad mayor a 0',
                color: 'warning'
            })
            return
        }

        if (count > 5) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario seleccionar una cantidad menor a 5',
                color: 'warning'
            })
            return
        }

        setIsLoading(true)

        try {
            await api.post(`tickets/create-generals?count=${count}`)
            setCount(1)
            onClose()
            
            addToast({
                title: "Actualizando",
                description: "Actualizando invitaciones generales. Espera un momento...",
                color: 'primary',
                promise: new Promise((resolve) => setTimeout(() => {
                    mutate()
                    addToast({
                        title: 'Invitaciones generales creadas exitosamente',
                        color: 'success'
                    })
                    resolve(true)
                }, 10000)),
            });

        } catch (error) {

            console.log(error)

            addToast({
                title: 'Hubo un error',
                description: 'Hubo un error al crear las invitaciones. Por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onPress={onOpen} className=' text-lg min-w-0 px-2' color='success' variant='bordered' fullWidth>
                <FaPlus />
                <p className=' ml-2 text-base'>Generar invitaciones</p>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className=' bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Generar invitaciones generales</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <NumberInput
                                    color='primary'
                                    variant='underlined'
                                    label='Cantidad a crear'
                                    labelPlacement='outside'
                                    value={count}
                                    onValueChange={setCount}
                                    maxValue={10}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant='bordered' onPress={() => addGeneral(onClose)} isLoading={isLoading}>
                                    Generar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
