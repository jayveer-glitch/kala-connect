import './globals.css'
import { Playfair_Display, Inter, Poppins } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import Navbar from './components/Navbar'

// Living Ink on Handmade Paper Typography
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'KalaConnect - Your Hands Create the Art. Let AI Tell the Story.',
  description: 'Transform traditional craftsmanship into digital stories through AI-powered innovation, empowering artisans to share their heritage with the world.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: 'https://res.cloudinary.com/dlspc4akf/image/upload/v1758462061/Screenshot_2025-09-21_125102_lferqv.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'KalaConnect - Your Hands Create the Art. Let AI Tell the Story.',
    description: 'Transform traditional craftsmanship into digital stories through AI-powered innovation, empowering artisans to share their heritage with the world.',
    images: ['https://res.cloudinary.com/dlspc4akf/image/upload/v1758462061/Screenshot_2025-09-21_125102_lferqv.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${inter.variable} ${poppins.variable} font-inter bg-paper text-charcoal`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}