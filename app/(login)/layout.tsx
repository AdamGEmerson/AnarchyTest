import { GeistSans } from 'geist/font/sans'
import '../globals.css'
import SessionList from "@/components/SessionList";
import AuthButton from "@/components/AuthButton";
import {cookies} from "next/headers";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={GeistSans.className}>
    <body className="bg-background text-foreground">
    <main className="min-h-screen flex flex-col items-center justify-around">
      <div className="w-full flex flex-row items-center h-screen">
        {children}
      </div>
    </main>
    </body>
    </html>
  )
}