import { Header } from "@/components/header/header";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { Work } from "@/components/work/work";
import { Rack } from "@/components/rack/rack";
import { Experience } from "@/components/experience/experience";
import { Education } from "@/components/education/education";
import { Stack } from "@/components/stack/stack";
import { Contact } from "@/components/contact/contact";
import { Footer } from "@/components/footer/footer";
import { MotionBoot } from "@/motion/motion-boot";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Work />
        <Rack />
        <Experience />
        <Education />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <MotionBoot />
    </>
  );
}
