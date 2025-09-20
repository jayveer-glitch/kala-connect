import './globals.css'
import { Playfair_Display, Inter, Poppins } from 'next/font/google'
import type { Metadata } from 'next'
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
  title: 'KalaConnect - Your Hands Create the Art. Let AI Tell the Story.',
  description: 'Transform traditional craftsmanship into digital stories through AI-powered innovation, empowering artisans to share their heritage with the world.',
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