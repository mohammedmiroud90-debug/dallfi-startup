"use client";

import dynamic from "next/dynamic";
import BarLoader from "@/components/BarLoader";

const HeroTower3D = dynamic(() => import("@/components/HeroTower3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <BarLoader />
    </div>
  ),
});

export default function HeroTowerLazy() {
  return (
    <div className="h-full w-full bg-transparent">
      <HeroTower3D />
    </div>
  );
}
