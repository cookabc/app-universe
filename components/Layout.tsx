'use client'

import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import Image from "next/image";
import Link from "next/link";
import React from "react";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-in",
});

export const metadata: Metadata = {
    title: 'AGISchool - AGI学园 - AI教学平台',
}

const cx = (...classNames: string[]) => classNames.filter(Boolean).join(" ");

export default function RootLayout({children}: { children: React.ReactNode }) {
    const currentYear = new Date().getFullYear();
    return (
        <div
            className={cx(inter.variable, "font-mr bg-light dark:bg-dark") + ' flex flex-col h-screen justify-between'}>
            <header className="header fixed top-0 px-5 z-20 bg-white w-full h-[64px] flex"
                    style={{borderBottom: '1px solid var(--ant-primary-color)'}}>
                <Link href="/" className="mr-5 font-900 text-2xl flex items-center justify-center">
                    <Image src="logo.svg" height={60} width={250} alt="Logo" priority/>
                </Link>
            </header>
            {children}
            <footer className="flex items-center justify-center text-[14px] py-5">
                <p className="my-0">
                    Copyright © <span>{currentYear}</span> AGI School
                </p>
            </footer>
        </div>
    )
}
