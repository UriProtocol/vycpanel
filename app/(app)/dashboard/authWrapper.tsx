import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {

    const router = useRouter()

    useEffect(() =>{
        if(!localStorage.getItem('token')){
            router.push('/login')
        }
    }, [])


    return (
        <>{children}</>
    )
}
