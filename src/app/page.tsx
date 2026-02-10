"use client";
import {
  ColModuleAbout,
  ColModuleExperience,
  ColModuleProjects,
} from "@/components/ColModule";
import Hero from "@/components/Hero";
import NavigationBar from "@/components/NavigationBar";
import Sectionbar from "@/components/SectionsBar";
import SubModule from "@/components/SubModule";

export default function Root() {
  return (
    <div className="flex flex-col max-w-2xl mb-[5rem]">
      <Hero />
      {/* <SubModule /> */}
      <ColModuleAbout />
      {/* <Sectionbar /> */}
      <ColModuleExperience />
      <ColModuleProjects />
    </div>
  );
}
