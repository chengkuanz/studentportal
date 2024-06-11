import Image from "next/image";
import WelcomeCarousel from "@/app/components/welcome";
import Footer from "@/app/components/footer";
import Features from "@/app/components/features";
import React from "react";

export default function Home() {
    return (
        <>
            <WelcomeCarousel />
            <Features />
            <Footer />
        </>
    );
}

