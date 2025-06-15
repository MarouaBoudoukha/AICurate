import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/navigation/TabBar";
import { ClientProviders } from "@/components/client-providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AICurate',
  description: 'Discover, review, and track AI applications',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AICurate',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-none">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body 
        className={cn(
          inter.className,
          "flex flex-col min-h-[100dvh] overscroll-none touch-pan-y bg-background antialiased"
        )}
      >
        <ClientProviders>
          <div className="flex-1 flex flex-col w-full max-w-screen-sm mx-auto bg-white relative">
            <main className="flex-1 overflow-y-auto pb-[calc(4.5rem+env(safe-area-inset-bottom))] overscroll-none">
              {children}
            </main>
            <TabBar className="fixed bottom-0 left-0 right-0 z-50" />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
