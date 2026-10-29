"use client";

import { useRef, useState } from "react";
import { copyAddress, openMail } from "@/lib/contact";
import { playSound } from "@/audio/state";

export function ContactActions() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onEmail(e: React.MouseEvent<HTMLButtonElement>) {
    playSound("blip");
    openMail(e.nativeEvent);
  }

  async function onCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget; // capture before await
    const ok = await copyAddress(e.nativeEvent);
    clearTimeout(timer.current);
    if (!ok) {
      setStatus("Couldn’t copy. Try “Email me” instead.");
      return;
    }
    playSound("blip");
    // Pixel-pop lives in the lazy motion chunk; loads on first copy.
    void import("@/motion/pixel-pop").then((m) => m.pixelPopFrom(button, 10));
    setCopied(true);
    setStatus("Email address copied to clipboard.");
    timer.current = setTimeout(() => {
      setCopied(false);
      setStatus("");
    }, 2200);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-solid"
          onClick={onEmail}
          data-magnetic
          data-cursor="link"
        >
          Email me
        </button>
        <button
          type="button"
          className="btn btn-ghost relative min-w-[11.5rem]"
          onClick={onCopy}
          data-magnetic
          data-cursor="link"
          data-copy
        >
          <span aria-hidden="true">{copied ? "Copied" : "Copy address"}</span>
          <span className="sr-only">Copy email address</span>
        </button>
      </div>
      <p className="sr-only" aria-live="polite" role="status">
        {status}
      </p>
    </div>
  );
}
