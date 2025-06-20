import { Button } from '@heroui/button'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Checkbox } from '@heroui/checkbox';
import { FaPlus } from 'react-icons/fa6';
import { addToast } from '@heroui/toast';
import api from '@/lib/api';

export default function AddTableButton({mutate}: {mutate: () => void}) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    const [name, setName] = useState('')    
    const [capacity, setCapacity] = useState(0)    
    const [isLoading, setIsLoading] = useState(false)


     async function addTable(onClose: () => void) {

        if (!name) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario otorgarle un nombre a la mesa',
                color: 'warning'
            })
            return
        }
        if (capacity < 1) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario otorgarle una capacidad mayor a 0 a la mesa',
                color: 'warning'
            })
            return
        }

        setIsLoading(true)

        try {
            await api.post('tables', { name, capacity })
            addToast({
                title: 'Mesa agregada exitosamente',
                color: 'success'
            })
            setName('')
            setCapacity(0)
            onClose()
            mutate()

        } catch (error) {

            console.log(error)

            addToast({
                title: 'Hubo un error',
                description: 'Hubo un error al agregar la mesa. Por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onPress={onOpen} className=' text-lg min-w-0 px-2' color='success' isIconOnly variant='bordered'>
                <FaPlus />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className=' bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Agregar mesa</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <Input
                                    color='primary'
                                    variant='underlined'
                                    label='Nombre de la mesa'
                                    labelPlacement='outside'
                                    value={name}
                                    onValueChange={setName}
                                />
                                <NumberInput 
                                    color='primary'
                                    variant='underlined'
                                    label='Capacidad' 
                                    labelPlacement='outside' 
                                     value={capacity}
                                    onValueChange={setCapacity}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant='bordered' onPress={() => addTable(onClose)}>
                                    Agregar mesa
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
