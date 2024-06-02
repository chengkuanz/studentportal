'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "@/app/components/navbar";
import {AuthContextProvider} from "@/context/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRouter";
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";
import NavbarComp from "@/app/components/navbar";
import Sidebar from "@/app/components/sidebar";


const noAuthRequired = ["/","/login", "/signup"];


const inter = Inter({ subsets: ["latin"] });


export function getLayoutMetadata(): Metadata {
  return {
    title: "Language Learning Student Portal",
    description: "Language Learning Student Portal",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();

    return (
        <html lang="en">
        <body className="dark">

        <AuthContextProvider>
            <div className='flex flex-col min-h-screen relative bg-neutral-800 text-white'>
                <Navbar/>
                <div className='sidebar-and-main'>
                    <Sidebar/>
                    <main className='flex-1 flex flex-col p-4 inline-block max-w-[82vw] ml-auto'>


                        {noAuthRequired.includes(pathname) ? (
                            children
                        ) : (
                            <ProtectedRoute>
                                {children}
                            </ProtectedRoute>
                        )}
                    </main>
                </div>
            </div>
        </AuthContextProvider>
        </body>

        </html>
);
}
