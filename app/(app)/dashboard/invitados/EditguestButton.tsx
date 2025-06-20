import { Button } from '@heroui/button'
import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Checkbox } from '@heroui/checkbox';
import { FaPen, FaPlus } from 'react-icons/fa6';
import { Guest } from '@/lib/types';
import { Autocomplete, AutocompleteItem, MenuTriggerAction } from '@heroui/autocomplete';
import { addToast } from '@heroui/toast';
import api from '@/lib/api';

const initGuest = {
    additionals: 0,
    confirmAttendance: false,
    fullName: '',
    tableId: 0,
    ticketGenerated: false
}


const exampleTables = [
    {
        "capacity": 10,
        "createdAt": "15/06/2025",
        "id": 1,
        "name": "Mesa"
    },
    {
        "capacity": 10,
        "createdAt": "15/06/2025",
        "id": 2,
        "name": "Mesa 2"
    },
    {
        "capacity": 8,
        "createdAt": "15/06/2025",
        "id": 3,
        "name": "Mesa un poco más pequeña"
    },
    {
        "capacity": 11,
        "createdAt": "15/06/2025",
        "id": 4,
        "name": "Mesa con una silla más de lo normal"
    },
    {
        "capacity": 10,
        "createdAt": "15/06/2025",
        "id": 5,
        "name": "Mesa 5"
    },
]



export default function EditGuestButton({ guest, mutate }: { guest: Guest, mutate: () => void }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [values, setValues] = useState(initGuest)

    const { additionals, confirmAttendance, fullName } = values;

    const [autocompleteValues, setAutocompleteValues] = useState({
        key: '',
        input: '',
        items: exampleTables
    })

    const [isLoading, setIsLoading] = useState(false)

    function handleChange(e: string | number | boolean, name: string) {
        setValues(prev => ({ ...prev, [name]: e }))
    }

    function onSelectionChange(key: string | null) {
        setAutocompleteValues(prev => {

            const selectedTable = prev.items.find(t => t.id?.toString() == key)

            return {
                key: key || '',
                input: selectedTable ? `${selectedTable?.id}. ${selectedTable?.name}` : '',
                items: prev.items.filter(i => i.name.includes(selectedTable?.name || ''))
            }
        })
    };
    function onInputChange(value: string) {
        setAutocompleteValues(prev => {
            return {
                key: value === '' ? '' : prev.key,
                input: value,
                items: exampleTables.filter(i => `${i.id}. ${i.name}`.toLowerCase().includes(value.toLowerCase() || ''))
            }
        })
    };

    function onOpenChangeAutocomplete(isOpen: boolean, menuTrigger: MenuTriggerAction) {
        if (menuTrigger === "manual" && isOpen) {
            setAutocompleteValues((prevState) => ({
                ...prevState,
                items: exampleTables,
            }));
        }
    };

    async function editGuest(onClose: () => void) {

        if (!fullName) {
            addToast({
                title: 'Error de validación',
                description: 'Es necesario otorgarle un nombre al invitado',
                color: 'warning'
            })
            return
        }
        if (additionals < 1) {
            addToast({
                title: 'Error de validación',
                description: 'No se puede tener menos de 0 acompañantes',
                color: 'warning'
            })
            return
        }

        setIsLoading(true)

        try {
            await api.patch(`guests/${guest.id}`, { additionals, fullName, confirmAttendance })
            addToast({
                title: 'Invitado actualizado exitosamente',
                color: 'success'
            })
            onClose()
            mutate()

        } catch (error) {

            console.log(error)

            addToast({
                title: 'Hubo un error',
                description: 'Hubo un error al actualizar al invitado. Por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {

        if (!guest.id) return

        setValues(guest)

        const selectedTable = exampleTables.find(t => t.id?.toString() == guest.tableId?.toString())

        if (!selectedTable) return

        setAutocompleteValues({
            key: selectedTable?.id?.toString(),
            input: `${selectedTable.id}. ${selectedTable.name}`,
            items: exampleTables
        })
    }, [guest.id])

    return (
        <>
            <Button size='sm' color='primary' variant='bordered' onPress={onOpen}
                startContent={
                    <FaPen />
                }
            >
                Editar
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Editar invitado {guest.id}. {guest.fullName}</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <Input
                                    color='primary'
                                    variant='underlined'
                                    label='Nombre del invitado'
                                    labelPlacement='outside'
                                    value={values.fullName}
                                    onValueChange={e => handleChange(e, 'fullName')}
                                />
                                <div className=' flex gap-6 items-end'>
                                    {/*<Checkbox color='success' className='' isSelected={values.confirmAttendance} onValueChange={e => handleChange(e, 'confirmAttendance')}><p className=' text-sm text-primary'>¿Asistirá?</p></Checkbox>*/}
                                    <NumberInput
                                        color='primary'
                                        variant='underlined'
                                        label='Adicionales'
                                        labelPlacement='outside' value={values.additionals} onValueChange={e => handleChange(e, 'additionals')} />
                                </div>
                                {/*<Autocomplete
                                    color='primary'
                                    variant='underlined'
                                    items={autocompleteValues.items}
                                    label='Mesa asignada'
                                    labelPlacement='outside'
                                    selectedKey={autocompleteValues.key}
                                    inputValue={autocompleteValues.input}
                                    onSelectionChange={e => onSelectionChange(e as string)}
                                    onInputChange={onInputChange}
                                    onOpenChange={onOpenChangeAutocomplete}
                                >
                                    {(item) => (
                                        <AutocompleteItem key={item.id?.toString()}>
                                            <p className=' text-white'>{item.id}. {item.name}</p>
                                        </AutocompleteItem>
                                    )}
                                </Autocomplete>*/}

                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={() => editGuest(onClose)} variant='bordered' isLoading={isLoading}>
                                    Editar invitado
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
