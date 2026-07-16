"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedProject.module.css";

export default function FeaturedProject() {
  const projectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const projectPanel =
        projectRef.current?.querySelector<HTMLElement>(`.${styles.project}`);

      if (!projectPanel) {
        return;
      }

      const hero = document.querySelector("#top");
      let hapticReady = true;
      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: projectRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          fastScrollEnd: true,
          snap: {
            snapTo: (progress, self) => {
              if (progress <= 0.08) {
                return 0;
              }

              if (progress >= 0.92) {
                return 1;
              }

              return self?.direction === -1 ? 0 : 1;
            },
            delay: 0.02,
            duration: { min: 0.12, max: 0.25 },
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            if (self.progress > 0.72 && hapticReady) {
              navigator.vibrate?.(12);
              hapticReady = false;
            }

            if (self.progress < 0.42) {
              hapticReady = true;
            }
          },
        },
      });

      transition.fromTo(
        projectPanel,
        {
          clipPath: "inset(0 0 68% 0)",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
        },
      );

      if (hero) {
        transition.to(
          hero,
          {
            opacity: 0.12,
            scale: 0.98,
            yPercent: -5,
            ease: "none",
          },
          0,
        );
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: projectRef.current,
          start: "top 85%",
          end: "top 20%",
          scrub: 0.35,
          fastScrollEnd: true,
        },
      });

      timeline
        .from(`.${styles.artwork}`, {
          clipPath: "inset(12% 8% 12% 8%)",
          scale: 0.92,
          ease: "none",
        })
        .from(
          [
            `.${styles.header}`,
            `.${styles.title}`,
            `.${styles.summary}`,
          ],
          {
            opacity: 0,
            y: 50,
            stagger: 0.08,
            ease: "none",
          },
          0.15,
        );
    }, projectRef);

    return () => animation.revert();
  }, []);

  return (
    <div
      ref={projectRef}
      className={styles.projectStage}
      id="selected-work"
    >
      <section
        className={styles.project}
        aria-labelledby="project-one-title"
      >
        <header className={styles.header}>
          <span>Selected work / 01</span>
          <span>2026</span>
        </header>

        <Link
          className={styles.artwork}
          href="/projects/neural-form"
          aria-label="View the Neural Form project"
        >
          <Image
            className={styles.artworkImage}
            src="/images/neutral-form.gif"
            alt="Animated experimental artwork for Neural Form"
            fill
            sizes="(max-width: 700px) 100vw, 96vw"
            unoptimized
          />
          <span className={styles.artworkIndex}>01</span>
        </Link>

        <div className={styles.details}>
          <h2 className={styles.title} id="project-one-title">
            <Link href="/projects/neural-form">Neural Form</Link>
          </h2>

          <div className={styles.summary}>
            <p>Digital identity and interactive experience.</p>
            <span>Art direction / Web design</span>
          </div>
        </div>
      </section>
    </div>
  );
}
