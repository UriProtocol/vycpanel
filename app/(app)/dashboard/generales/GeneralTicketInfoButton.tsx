import { Button } from '@heroui/button'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal'
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Checkbox } from '@heroui/checkbox';
import { FaEye, FaPlus } from 'react-icons/fa6';
import { addToast } from '@heroui/toast';
import api from '@/lib/api';
import { GeneralTicket } from '@/lib/types';

export default function GeneralTicketInfoButton({ ticket }: { ticket: GeneralTicket }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false)

    async function downloadPdf(onClose: () => void) {

        setIsLoading(true)

        try {
            const response = await fetch(ticket.pdfUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `general-${ticket.folio}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            addToast({
                title: 'Error al descargar PDF',
                color: 'danger'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onPress={onOpen} className='mt-2' color='primary' variant='bordered' fullWidth isDisabled={!ticket.qrCodeUrl || !ticket.pdfUrl} size='sm'>
                <FaEye className=' text-sm' />
                <p className=' ml-2 text-sm'>Ver Invitación</p>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className=' bg-[#140408]/80 backdrop-blur-xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-xl">Invitación General #{ticket.folio}</ModalHeader>
                            <ModalBody className='flex flex-col gap-6'>
                                <p className=' text-[#f7dac6] text-lg montserrat'>
                                    Fecha:  <span className=' opacity-70'>Viernes 18 de Julio</span>
                                </p>
                                <p className=' text-[#f7dac6] text-lg montserrat'>
                                    Lugar:  <span className=' opacity-70'>Jardin y Salón Velvet</span>
                                </p>
                                <img src={ticket?.qrCodeUrl} className=' w-40 h-40 rounded-xs mx-auto' alt='Código qr' />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" variant='bordered' onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="success" variant='bordered' onPress={() => downloadPdf(onClose)} isLoading={isLoading}>
                                    Descargar PDF
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}
