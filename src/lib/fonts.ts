import { IBM_Plex_Mono, IBM_Plex_Sans, Plus_Jakarta_Sans } from 'next/font/google'

const plexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-sans',
})

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    variable: '--font-display',
})

const plexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-jetbrains-mono',
})

export const fontVariableClassName = `${plexSans.variable} ${plusJakarta.variable} ${plexMono.variable} antialiased min-w-[320px]`
