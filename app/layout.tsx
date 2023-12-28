import React from "react";
import {Metadata} from "next";
import {Inter} from 'next/font/google';
import Image from "next/image";
import Link from "next/link";
import "@/app/style/globals.css";

export const metadata: Metadata = {
    title: 'AGISchool - AGI学园 - AI教学平台',
    metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-in",
});

const cx = (...classNames: string[]) => classNames.filter(Boolean).join(" ");
export default function RootLayout({children}: { children: React.ReactNode }) {
    const currentYear = new Date().getFullYear();
    return (
        <html lang="en">
        <body className={inter.className}>
        <div
            className={cx(inter.variable, "font-mr bg-light dark:bg-dark") + ' flex flex-col h-screen justify-between'}>
            <header className="header fixed top-0 px-5 z-20 bg-white w-full h-[64px] flex"
                    style={{borderBottom: '1px solid var(--ant-primary-color)'}}>
                <Link href="/" className="mr-5 font-900 text-2xl flex items-center justify-center">
                    <Image src="logo.svg" height={60} width={250} alt="Logo" priority/>
                </Link>
            </header>
            <div className="h-full mt-[64px]">
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}
