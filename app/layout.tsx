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
import WelcomeCarousel from "@/app/components/welcome";
import Image from "react-bootstrap/Image";
import React from "react";


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

        <body className={inter.className}>
        <AuthContextProvider>
            <Navbar />
            {noAuthRequired.includes(pathname) ? (
                children
            ) : (
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
            )}

        </AuthContextProvider>
        </body>
        </html>
    );
}
