"use client";

import { motion } from "motion/react"
import Link from "@/components/Link";
import { CornerDownRight } from "lucide-react";

export default function FOF() {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col gap-2 w-[500px]">
          <h1>Seems you're a bit lost..</h1>
          <Link
            className="text-[10px] group flex justify-between bg-accent-main uppercase font-semibold mt-2 text-white px-[12px] py-[10px] rounded-md "
            href={"/"}
          >
            Head Back Home
            <CornerDownRight className="text-white opacity-0  smooth_transition h-[15px] group-hover:opacity-100" />
          </Link>
        </div>
      </div>
    );
}