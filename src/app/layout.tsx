'use client';

import Footer from '@/components/Footer';
import '../styles/globals.css';
import Nav from '@/components/Nav';
import ScrollToTheTopButton from '@/components/ScrollToTheTopButton';
import { SessionProvider } from "next-auth/react"

import React, { ReactNode } from 'react';
export interface LayoutProps {
    children: ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html lang='en'>
            <body>
                <SessionProvider>

                    <div className='main'>
                        <div className='gradient' />
                    </div>

                    <main className='app'>
                        <Nav />
                        {children}
                        <ScrollToTheTopButton />
                    </main>
                    <Footer />

                </SessionProvider>
            </body>
        </html>
    )
};

export default RootLayout;
