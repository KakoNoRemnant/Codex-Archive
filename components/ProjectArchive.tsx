"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { archiveProjects } from "@/data/projects";
import styles from "./ProjectArchive.module.css";

export default function ProjectArchive() {
  const archiveRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (
      !archiveRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.context(() => {
      gsap.from([`.${styles.header}`, `.${styles.heading}`], {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: archiveRef.current,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(`.${styles.row}`, {
        opacity: 0,
        y: 70,
        duration: 0.85,
        stagger: 0.13,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.list}`,
          start: "top 82%",
          once: true,
        },
      });
    }, archiveRef);

    return () => animation.revert();
  }, []);

  return (
    <section
      ref={archiveRef}
      className={styles.archive}
      aria-labelledby="archive-title"
    >
      <header className={styles.header}>
        <p>Archive index</p>
        <p>2025 — 2026</p>
      </header>

      <h2 className={styles.heading} id="archive-title">
        More projects
      </h2>

      <div className={styles.list}>
        {archiveProjects.map((project) => (
          <Link
            className={styles.row}
            href={`/projects/${project.slug}`}
            key={project.number}
          >
            <span className={styles.number}>{project.number}</span>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.category}>{project.category}</p>
            <span className={styles.year}>{project.year}</span>
            <svg
              className={styles.arrow}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M4 12 12 4M6 4h6v6" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
