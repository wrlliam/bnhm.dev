"use client";
import { motion } from "motion/react";
import { loaderStore } from "@/lib/stores";
import Image from "next/image";
import MajorLogo from "@/assets/Major Logo.svg";
import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";

export type LoaderProps = {
  children: React.ReactNode | React.ReactElement;
};

export default function Loader(props: LoaderProps) {
  const { setState, state, setComingInternal, comingInternal } = loaderStore();
  const [internalState, setInternalState] = useState(false);

  useEffect(() => {
    setInternalState(true);

    const countdown = setTimeout(() => {
      setState(false);
      if (comingInternal) {
        setComingInternal(false);
      }
    }, 300);

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
          //   height: state ? "100vh" : "0%",
          opacity: state ? 1 : 0,
          backdropFilter: state ? "blur(15px)" : "blur(0px)",
          pointerEvents: state ? "all" : "none",
          //   left: state ? "0%" : "-100%",
        }}
        className="w-[100vw] top-0 left-0 bottom-0 right-0 overflow-hidden bg-gray-100 text-black fixed z-[100]"
      ></motion.div>

      <div className="flex flex-col items-start max-w-[46rem] mx-auto mt-[12rem] mb-[5rem] px-6">
        <NavigationBar />
        {props.children}
      </div>
    </div>
  );
}
