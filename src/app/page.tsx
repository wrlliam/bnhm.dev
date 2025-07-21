"use client";
import Hero from "@/components/Hero";
import NavigationBar from "@/components/NavigationBar";
import SubModule from "@/components/SubModule";

export default function Root() {
  return (
    <div className="flex flex-col max-w-2xl">
      <Hero />
      <SubModule />
    </div>
  );
}
