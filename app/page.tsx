import Image from "next/image";
import WelcomeCarousel from "@/app/components/welcome";
import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WelcomeCarousel>

      </WelcomeCarousel>
    </main>
  );
}
