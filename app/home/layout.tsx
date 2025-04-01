import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from "@/context/AuthContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
    </AuthProvider>
    </html>
  )
}

