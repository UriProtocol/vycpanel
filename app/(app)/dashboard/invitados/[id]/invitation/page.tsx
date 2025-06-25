'use client'
import api from '@/lib/api'
import { addToast } from '@heroui/toast'
import { useParams } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

const fetcher = ([url]: [url: string]) => api.get(url).then(res => res.data).catch(() => addToast({ title: 'Hubo un error', description: 'Hubo un error al obtener los datos de las invitaciones', color: 'danger' }))


export default function SeeInvitation() {

  const { id } = useParams()

  const { data, isLoading } = useSWR([`guests/tickets/${id || ''}`], fetcher)

  if (isLoading) return <div className='flex justify-center'><Spinner color='danger' size='lg' className=' mt-6 mx-auto' /></div>

  if (data) {
    return <InvitationComponent data={data} />
  }

  return null
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Spinner } from '@heroui/spinner'

function InvitationComponent({ data }: { data: any }) {

  const [openEnvelope, setOpenEnvelope] = useState(true)
  const [currentQrIndex, setCurrentQrIndex] = useState(0)

  const [isDownloading, setIsDownloading] = useState(false)

  const { id } = useParams()

  async function handleDownload() {

    try {
      const response = await api.get(`tickets/regenerate/${id}`, {
        responseType: 'blob' // Important: tell the API client to handle the response as a blob
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${id}.pdf`); // Set the filename
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      addToast({
        title: 'Hubo un error',
        description: 'Hubo un error al descargar el PDF. por favor intentalo más tarde',
        color: 'danger'
      })
    }

  }

  return (
    <motion.div
      className=' bg-[#1c0009]'
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: 1
      }}
      onClick={() => {
        if (!openEnvelope) setOpenEnvelope(true)
      }}
    >
      {/*Contenido*/}
      <motion.div
        animate={{
          translateY: openEnvelope ? 0 : 10,
          opacity: openEnvelope ? 1 : 0
        }}
        transition={{
          duration: 0.5,
          delay: 0.5
        }}
        className='fixed inset-0 flex flex-col gap-4 justify-center items-center w-full h-full text-center opacity-0'>
        <p className=' text-[#f2a366] text-5xl'>V & C</p>
        <p className=' text-[#f7dac6] text-xl mt-4 montserrat'>
          Invitado: <span className=' opacity-70'>{data[0].fullName}</span>
        </p>
        {
          !!data[0].additionals && (
            <p className=' text-[#f7dac6] text-xl montserrat'>
              Acompañantes:  <span className=' opacity-70'>{data[0].additionals}</span>
            </p>
          )
        }
        <p className=' text-[#f7dac6] text-xl montserrat'>
          Fecha:  <span className=' opacity-70'>Viernes 18 de Julio</span>
        </p>
        <p className=' text-[#f7dac6] text-xl montserrat'>
          Lugar:  <span className=' opacity-70'>Jardin y Salón Velvet</span>
        </p>
        {
          !!data[0].additionals && (
            <p className=' opacity-50 text-base text-[#f7dac6] montserrat -mb-5'>{currentQrIndex === 0 ? `Qr de ${data[0].fullName}` : `Qr del acompañante ${currentQrIndex}`}</p>
          )
        }
        <img src={data[0].qrCodeUrls[0]?.slice(0, -5) + `${currentQrIndex}.png`} className=' w-40 h-40 mt-4 rounded-xs' alt='Código qr' />
        <div className=' flex'>
          {
            data[0].qrCodeUrls.map((qr: string, index: number) => {

              if (data[0].additionals < 1) return null

              return (
                <button key={index} onClick={() => setCurrentQrIndex(index)} className={` border-x-[1px] border-y-2 ${index == 0 && 'border-l-2'} ${index == data[0].qrCodeUrls.length - 1 && 'border-r-2'} px-3 py-0.5 text-lg montserrat ${currentQrIndex == index && 'bg-rose-900'}`}>
                  {index + 1}
                </button>
              )
            })
          }
        </div>
        <div className='grid grid-cols-2 gap-4 max-w-2xl w-[75vw] mt-8'>
          <a
            href="/dashboard/invitados"
            className="w-full flex justify-center py-2 rounded-sm bg-rose-950/80 shadow text-[#f7dac6] montserrat font-semibold transition-all hover:bg-rose-950 hover:-translate-y-1 active:-translate-y-0.5 backdrop-blur-xl"
          >
            Volver
          </a>

          <button
            disabled={isDownloading}
            onClick={handleDownload}
            className={`w-full flex justify-center py-2 rounded-sm border-3 bg-rose-950/20 border-[#f7dac680] text-[#f7dac6] shadow montserrat font-semibold transition-all hover:border-[#f7dac6] hover:-translate-y-1 active:-translate-y-0.5 backdrop-blur-xl ${isDownloading && 'opacity-60 pointer-events-none'}`}
          >
            Descargar
          </button>
        </div>

        {/*<motion.div animate={{ x: openEnvelope ? 0 : -40, opacity: openEnvelope ? 1 : 0 }} transition={{ delay: 0.75 }} className='absolute left-3 top-6  w-3 h-3 bg-[#f2a366] rounded-2xl opacity-0' />
                <motion.div animate={{ x: openEnvelope ? 0 : -40, opacity: openEnvelope ? 1 : 0 }} transition={{ delay: 0.75 }} className='absolute left-4 top-12 bottom-12 w-1 bg-[#f2a366] rounded-2xl opacity-0' />
                <motion.div animate={{ x: openEnvelope ? 0 : -40, opacity: openEnvelope ? 1 : 0 }} transition={{ delay: 0.75 }} className='absolute left-3 bottom-6  w-3 h-3 bg-[#f2a366] rounded-2xl opacity-0' />
                <motion.div animate={{ x: openEnvelope ? 0 : 40, opacity: openEnvelope ? 1 : 0 }} transition={{ delay: 0.75 }} className='absolute right-4 top-12 bottom-12 w-1 bg-[#f2a366] round opacity-0d-2xl ' />
                <motion.div animate={{ x: openEnvelope ? 0 : 40, opacity: openEnvelope ? 1 : 0 }} transition={{ delay: 0.75 }} className='absolute right-3 top-6  w-3 h-3 bg-[#f2a366] rounded-2xl ' />
                <motion.div animate={{ x: openEnvelope ? 0 : 40, opacity: openEnvelope ? 1 : 0 }} transition={{ delay: 0.75 }} className='absolute right-3 bottom-6  w-3 h-3 bg-[#f2a366] rounded-2xl opacity-0' />*/}
      </motion.div>
    </motion.div>
  )
}