"use client"
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@heroui/button'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import AuthWrapper from './authWrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        "Mesas",
        "Invitados",
        "Generales",
        "Scanner",
        //'Tickets'
    ];

    const pathname = usePathname()
    const router = useRouter()

    function handleLogout(){
        localStorage.removeItem('token')
        router.push('/login')
    }

    return (
        <AuthWrapper>
            <div className='h-screen w-full'>

                <Navbar className='bg-[#140408]/80 backdrop-blur-xl shadow' isMenuOpen={isMenuOpen}>
                    <NavbarContent>
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className=""
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                        <NavbarBrand className=' cursor-pointer' as={Link} href={'/dashboard'}>
                            <p className="font-bold text-inherit">V & C</p>
                        </NavbarBrand>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        {/*<ThemeSwitch />*/}
                        <NavbarItem>
                            <Button color="danger" variant="bordered" onPress={handleLogout}>
                                Cerrar sesión
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarMenu className=' pt-6'>
                        {menuItems.map((item, index) => (
                            <NavbarMenuItem key={`${item}-${index}`} className=' flex justify-center text-center py-3'>
                                <Link
                                    className={`w-full mx-auto text-3xl ${pathname.toLowerCase().includes(item.toLowerCase()) ? 'text-success' : 'text-primary opacity-80'}`}
                                    href={`/dashboard/${item.toLowerCase()}`}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {item}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>
                <div className=' pt-2 px-6 max-h-[calc(100vh-4rem)] overflow-auto'>
                    {children}
                </div>
            </div>
        </AuthWrapper>
    )
}
