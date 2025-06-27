import './globals.css'
import ProfileHeader from '@/components/ProfileHeader'
import { ClientIdProvider } from "@/components/ClientIdProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ClientIdProvider>
          <ProfileHeader />
          <main>
            {children}
          </main>
        </ClientIdProvider>
      </body>
    </html>
  )
}
