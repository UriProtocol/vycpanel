import { Button } from '@heroui/button'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Checkbox } from '@heroui/checkbox';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { addToast } from '@heroui/toast';
import api from '@/lib/api';

export default function DeleteGeneralsButton({ mutate }: { mutate: () => void }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    const [count, setCount] = useState(1)
    const [isLoading, setIsLoading] = useState(false)


    async function deleteGenerals(onClose: () => void) {

        if (!count || count < 1) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario seleccionar una cantidad mayor a 0',
                color: 'warning'
            })
            return
        }

        setIsLoading(true)

        try {
            await api.delete(`generals?count=${count}`)
            addToast({
                title: 'Invitaciones generales eliminadas exitosamente',
                color: 'success'
            })
            setCount(1)
            onClose()
            mutate()

        } catch (error) {

            //@ts-expect-error
            if (error?.response?.data?.error?.includes('only')) {
                addToast({
                    title: 'Hubo un error',
                    description: 'No puedes eliminar más invitaciones generales de las que existen',
                    color: 'danger'
                })
            }

            addToast({
                title: 'Hubo un error',
                description: 'Hubo un error al eliminar las invitaciones. Por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onPress={onOpen} className=' text-lg min-w-0' color='danger' variant='bordered' isIconOnly>
                <FaTrash />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className=' bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Eliminar invitaciones generales</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <p>Solo se eliminarán invitaciones sin mesa asignada</p>
                                <NumberInput
                                    color='primary'
                                    variant='underlined'
                                    label='Cantidad a eliminar'
                                    labelPlacement='outside'
                                    value={count}
                                    onValueChange={setCount}
                                    maxValue={5}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant='bordered' onPress={() => deleteGenerals(onClose)} isLoading={isLoading}>
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
