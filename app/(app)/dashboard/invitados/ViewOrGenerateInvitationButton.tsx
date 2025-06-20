import api from '@/lib/api'
import { Guest } from '@/lib/types'
import { Button } from '@heroui/button'
import { addToast } from '@heroui/toast'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaEye, FaPlus } from 'react-icons/fa6'
import useSWR from 'swr'


export default function ViewOrGenerateInvitationButton({ g, mutate }: { g: Guest, mutate: () => void }) {

    const router = useRouter()

    async function generateInvitation() {
        try {
            await api.get(`tickets/activate/${g.id}`)
            addToast({
                title: 'Invitación(es) generada(s) exitosamente',
                color: 'success'
            })
            mutate()
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Ocurrió un error',
                description: 'Ocurrió un error al generar la invitación, por favor intentalo de nuevo más tarde',
                color: 'danger'
            })
        }
    }

    return (
        <>
            <Button
                onPress={g.ticketGenerated ? () => {router.push(`/dashboard/invitados/${g.id}/invitation`)} : generateInvitation}
                color='success'
                variant='bordered'
                className=' col-span-2'
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
        </>
    )
}
