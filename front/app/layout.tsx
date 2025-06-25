import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skillbridge',
  description: 'Plateforme de gestion de projets et de mise en relation avec des prestataires',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
