"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useStore } from "zustand";
import { mousePos, loaderStore } from "@/lib/stores";
import { img } from "motion/react-client";

export default function CursorFollower() {
  const posX = useStore(mousePos, (state) => state.posX);
  const posY = useStore(mousePos, (state) => state.posY);
  const setPosX = useStore(mousePos, (state) => state.setPosX);
  const setPosY = useStore(mousePos, (state) => state.setPosY);
  const isLoading = useStore(loaderStore, (state) => state.state);

  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const rafRef = useRef<number>(0);

  // Memoized mouse move handler for performance
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Cancel previous animation frame to prevent stacking
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(() => {
        setPosX(e.clientX);
        setPosY(e.clientY);
      });
    },
    [setPosX, setPosY],
  );

  const handleMouseDown = useCallback(() => {
    setIsClicked(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsOnScreen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOnScreen(false);
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isLink = target.closest('a, button, [role="button"], [tabindex="0"]');
    setIsHoveringLink(!!isLink);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isVisible) return;
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, {
      passive: true,
    });
    document.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseOver,
    isVisible,
  ]);

  if (isLoading || !isVisible) return null;

  const getOpacity = () => {
    if (!isOnScreen) return "opacity-30";
    return "opacity-100";
  };

  return (
    <>
      <img
        src={`/${isHoveringLink ? "cursor-clicked.png" : "cursor.png"}`}
        className="fixed top-0 left-0 pointer-events-none z-50 w-[35px] h-[35px]"
        style={{
          transform: `translate(${posX + 7}px, ${posY}px) rotate(-15deg) translate(-50%, -50%)`,
          transformOrigin: "center",
        }}
      />
    </>
    // <div
    //   className={`
    //     fixed top-0 left-0 pointer-events-none z-50
    //     transition-all ease-out
    //     animate-in fade-in zoom-in-95 duration-300
    //     ${getSize()}
    //     ${getOpacity()}
    //     ${
    //       isClicked
    //         ? "bg-gradient-to-br from-blue-500/70 via-purple-500/70 to-pink-500/70 shadow-lg shadow-purple-500/40"
    //         : isHoveringLink
    //           ? "bg-gradient-to-br from-green-400/60 via-blue-400/60 to-purple-400/60 shadow-lg shadow-blue-400/30"
    //           : isOnScreen
    //             ? "bg-gradient-to-br from-blue-400/60 via-purple-400/60 to-pink-400/50"
    //             : "bg-gradient-to-br from-gray-400/40 via-gray-300/30 to-gray-200/20"
    //     }
    //     rounded-full backdrop-blur-sm border border-white/20
    //   `}
    //   style={{
    //     transform: `translate(${posX - centerOffset}px, ${
    //       posY - centerOffset
    //     }px)`,
    //     willChange: "transform, width, height, opacity",
    //     boxShadow: isClicked
    //       ? "0 0 25px rgba(139, 69, 219, 0.5), 0 0 50px rgba(59, 130, 246, 0.3)"
    //       : isHoveringLink
    //         ? "0 0 20px rgba(59, 130, 246, 0.4), 0 0 35px rgba(34, 197, 94, 0.2)"
    //         : isOnScreen
    //           ? "0 0 12px rgba(139, 69, 219, 0.25)"
    //           : "0 0 6px rgba(107, 114, 128, 0.15)",
    //   }}
    // >
    //   {/* Inner glow effect */}
    //   <div
    //     className={`
    //       absolute inset-0 rounded-full
    //       ${
    //         isClicked
    //           ? "bg-gradient-to-br from-white/30 to-transparent animate-pulse"
    //           : isHoveringLink
    //             ? "bg-gradient-to-br from-white/25 to-transparent"
    //             : "bg-white/10"
    //       }
    //     `}
    //   />
    // </div>
  );
}
