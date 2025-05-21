import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "../context/AuthProvider";
import { AppProvider } from "../context/AppContext";
import { ThemeProvider } from "../context/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'RelayRoom',
  description: 'RelayRoom – Seamless real-time chat for everyone.',
  keywords: ['RelayRoom', 'chat', 'messaging', 'real-time communication'],
  robots: 'index, follow',
  openGraph: {
    title: 'RelayRoom',
    description: 'RelayRoom – Seamless real-time chat for everyone.',
    url: 'https://relayroom.vercel.app',
    siteName: 'RelayRoom',
    type: 'website',
    images: [
      {
        url: 'https://relayroom.vercel.app/images.jpeg',
        width: 400,
        height: 400,
        alt: 'RelayRoom Home',
      },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <AppProvider>{children}</AppProvider>
          </ThemeProvider>
        </AuthProvider>
        <Toaster expand={true} richColors />
      </body>
    </html>
  );
}
