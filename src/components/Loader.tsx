"use client";
import { motion } from "motion/react";
import { loaderStore } from "@/lib/stores";
import Image from "next/image";
import MajorLogo from "@/assets/Major Logo.svg";
import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import { BackgroundBeams } from "./ui/background-beams";

export type LoaderProps = {
  children: React.ReactNode | React.ReactElement;
};

const SLOGAN = "Building the internet we deserve.";

export default function Loader(props: LoaderProps) {
  const { setState, state, setComingInternal, comingInternal } = loaderStore();
  const [internalState, setInternalState] = useState(false);

  useEffect(() => {
    const countdown = setTimeout(() => {
      setInternalState(true);

      setTimeout(() => {
        setState(false);
        if (comingInternal) {
          setComingInternal(false);
        }
      }, 500);
    }, 1700);

    return () => clearTimeout(countdown);
  }, []);
  return (
    <div>
     
      <motion.div
        initial={{
          height: "100vh",
          //   left: "0%",
        }}
        animate={{
          height: state ? "100vh" : "0%",
          //   left: state ? "0%" : "-100%",
        }}
        className="w-[100vw] top-0 left-0 bottom-0 right-0 overflow-hidden bg-gray-100 text-black fixed z-[100]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{
            opacity: internalState ? 0 : 1,
            scale: 1,
            y: 0,
          }}
          className="flex w-screen flex-col h-screen items-center justify-center"
        >
          <Image src={MajorLogo} width={100} alt="Logo" className="invert" draggable={false} />
          {/* <p className="text-black mt-3 text-xs flex gap-1">
            {SLOGAN.split(" ").map((z, i) => {
              return (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ delay: 0.2 * i + 0.25 }}
                  key={i}
                >
                  {z}
                </motion.span>
              );
            })}
          </p> */}
          <BackgroundBeams/>
        </motion.div>
      </motion.div>

      <div className="mx-auto flex md:flex-row flex-col gap-[3rem] max-w-5xl px-[2rem] mt-[5rem]">
        <NavigationBar />
        {props.children}
      </div>
    </div>
  );
}
