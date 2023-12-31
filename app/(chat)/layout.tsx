import { GeistSans } from "geist/font/sans";
import "../globals.css";
import SessionList from "@/components/SessionList";
import AuthButton from "@/components/AuthButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <div className="w-full flex flex-row items-center h-screen">
            <div className="flex flex-col gap-8 w-1/6 justify-around h-full p-4 items-center">
              <SessionList serverSessions={[]} />
              <AuthButton />
            </div>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
