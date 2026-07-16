"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MAX_WHEEL_DELTA = 120;

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.3,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.62,
      anchors: true,
      stopInertiaOnNavigate: true,
      virtualScroll: (scroll) => {
        if (scroll.event instanceof WheelEvent) {
          scroll.deltaY = Math.max(
            -MAX_WHEEL_DELTA,
            Math.min(MAX_WHEEL_DELTA, scroll.deltaY),
          );
        }

        return true;
      },
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return null;
}
