"use client"
import { ThemeSwitch } from '@/components/theme-switch'
import React, { useState } from 'react'
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { addToast } from '@heroui/toast';

export default function LoginPage() {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')



    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        //const success = await login({ email, password: pass });

        try {
            const {data} = await api.post('login', { email, password: pass })
            localStorage.setItem('token',data.token)

            router.push('/dashboard/mesas')

        } catch (error) {

            //@ts-expect-error
            if (error?.response?.data?.error == 'invalid credentials') {

                addToast({
                    title: "Credenciales inválidas",
                    description: "El usuario no existe en el sistema",
                    color: 'danger',
                })
                return
            }

            addToast({
                title: "Ocurrió un error inesperado",
                description: "Por favor vuelve a intentarlo más tarde",
                color: 'danger',
            })
            //if (success) {
            //    router.push('/dashboard');
            //} else {
            //    console.error('Error al iniciar sesión')
            //}
        };
    }

    return (
        <div className='flex w-full h-screen items-center justify-center'>
            <Card className=' p-6 xl:w-[30rem] bg-opacity-60 relative bg-[#140408]/80 text-primary w-full h-full sm:w-fit sm:h-fit'>
                <CardHeader className='flex justify-center mb-6'>
                    <h1 className=' text-2xl font-semibold text-center'>Acceder al panel V&C</h1>
                </CardHeader>
                <CardBody className=''>
                    <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                        <Input
                            label='Correo electrónico'
                            labelPlacement='outside'
                            size='lg'
                            type='email'
                            //placeholder='tuemail@gmail.com'
                            value={email}
                            onValueChange={setEmail}
                            //required
                            color='primary'
                            variant='underlined'
                        />
                        <Input
                            label='Contraseña'
                            labelPlacement='outside'
                            type='password'
                            size='lg'
                            //placeholder='tucontraseña'
                            value={pass}
                            onValueChange={setPass}
                            //required
                            color='primary'
                            variant='underlined'
                        />
                        <Button
                            color='success'
                            variant='bordered'
                            type='submit'
                            className=' mt-4'
                        >
                            Iniciar sesión
                        </Button>
                    </form>
                </CardBody>
            </Card>

            {/*<div className=' fixed bottom-4 right-4'>
                <ThemeSwitch />
            </div>*/}
        </div>
    )
}
