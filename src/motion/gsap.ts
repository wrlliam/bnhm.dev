/**
 * GSAP + plugins. Only imported from the lazily loaded motion runtime, so none
 * of this is in the first-load bundle.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.config({ nullTargetWarn: false });
gsap.defaults({ ease: "power4.out" });

export { gsap, ScrollTrigger, SplitText, useGSAP };
