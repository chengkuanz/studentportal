import Image from "next/image";
import WelcomeCarousel from "@/app/components/welcome";
import Footer from "@/app/components/footer";
import React from "react";

export default function Home() {
    return (
        <>
            <WelcomeCarousel />
            <Footer />
        </>
    );
}

