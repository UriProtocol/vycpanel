"use client"
import api from '@/lib/api'
import { Button } from '@heroui/button'
import { addToast } from '@heroui/toast'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const initData = {
  folio: "",
  guestName: "",
  tableName: "",
  ticketStatus: ""
}

export default function ScannerPage() {

  const [rawScanner, setRawScanner] = useState<IDetectedBarcode[] | null>()
  const [scannerResult, setScannerResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(initData)
  //const [error, setError] = useState('')

  async function handleScan() {

    setIsLoading(true)
    try {

      const data = await api.get(`tickets/scan-qr/${scannerResult}`).then(res => res.data)

      setData(data)

      addToast({
        title: 'Invitación encontrada',
        color: 'success'
      })

    } catch (error) {

      console.log(error)

      //@ts-expect-error
      if (error?.response?.data?.includes('does not match')) {
        addToast({
          title: 'Hubo un error',
          description: 'El código QR no coincide con ningún invitado',
          color: 'danger'
        })
        return
      }
      //@ts-expect-error
      if (error?.response?.data?.includes('invalid code')) {
        addToast({
          title: 'Hubo un error',
          description: 'El código QR es inválido',
          color: 'danger'
        })
        return
      }
      //@ts-expect-error
      if (error?.response?.data?.includes('already used')) {
        addToast({
          title: 'Hubo un error',
          description: 'Esta invitación ya fue escaneada anteriormente.',
          color: 'danger'
        })
        return
      }

      addToast({
        title: 'Hubo un error',
        description: 'Ocurrió un error desconocido al escanear la invitación. Por favor intentalo más tarde.',
        color: 'danger'
      })

    } finally {
      setIsLoading(false)
      setScannerResult('')
      setRawScanner(null)
    }

  }

  function handleReset() {
    setData(initData)
    setScannerResult('')
  }

  useEffect(() => {
    if (!rawScanner) {
      setScannerResult('')
      return
    }

    setScannerResult(rawScanner[0].rawValue)

  }, [JSON.stringify(rawScanner)])

  return (
    <>
      {
        !data.guestName ? (
          <>
            <p className=' mt-4 text-center opacity-80 text-sm'>Coloca el código dentro del recuadro rojo y presiona</p>
            <p className=' mt-1 text-center opacity-80 text-sm'>"Escanear invitación"</p>
            <div className=' mx-auto max-w-[min(70%,25rem)] mt-4 p-1.5 bg-primary shadow rounded-sm'>
              <Scanner onScan={(result) => setRawScanner(result)} />
            </div>
            {
              !!scannerResult && (
                <motion.div
                  className=' w-full'
                  initial={{
                    y: -5,
                    opacity: 0
                  }}
                  animate={{
                    y: 0,
                    opacity: 1
                  }}
                >

                  <Button fullWidth className='mt-4' color='success' variant='bordered' onPress={handleScan} isLoading={isLoading}>Escanear Invitación</Button>
                </motion.div>
              )
            }
          </>
        ) : (
          <motion.div
            className='flex flex-col gap-4 items-center justify-center text-xl py-8'
            initial={{
              y: -5,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
          >
            {
              !!data.guestName && (
                <p>Nombre del invitado: <span className=' opacity-75'>{data.guestName}</span></p>
              )
            }
            {
              !!data.folio && (
                <p>Invitación general #{data.folio}</p>
              )
            }
            <p>Nombre de la mesa: <span className=' opacity-75'>{data.tableName || 'Sin mesa'}</span></p>
            <p>Estatus del invitado: <span className=' opacity-75'>{data.ticketStatus == 'active' ? 'Asistirá' : 'No asistirá'}</span></p>
            <Button fullWidth className='mt-4' color='success' variant='bordered' onPress={handleReset}>Escanear otra invitación</Button>
          </motion.div>
        )
      }
      {/*{
        rawScanner
      }
      {
        scannerResult
      }
      {
        error
      }*/}
    </>
  )
}
