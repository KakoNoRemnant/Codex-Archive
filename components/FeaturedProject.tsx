"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type ProjectMedia } from "@/data/projects";
import styles from "./FeaturedProject.module.css";

const PROJECT_DURATION = 6500;

function MediaItem({ media, index }: { media: ProjectMedia; index: number }) {
  if (media.type === "video") {
    return (
      <video
        className={styles.media}
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={index === 0 ? media.alt : undefined}
      />
    );
  }

  return (
    <Image
      className={styles.media}
      src={media.src}
      alt={index === 0 ? media.alt : ""}
      fill
      sizes="(max-width: 700px) 88vw, 55vw"
      unoptimized={media.src.endsWith(".gif")}
    />
  );
}

export default function FeaturedProject() {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredMedia, setHoveredMedia] = useState<number | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const activeProject = projects[activeIndex];
  const focusedMedia = hoveredMedia ?? selectedMedia;

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (
        isTransitioning ||
        nextIndex === activeIndex ||
        nextIndex < 0 ||
        nextIndex >= projects.length
      ) {
        return;
      }

      const content = contentRef.current;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!content || reducedMotion) {
        setHoveredMedia(null);
        setSelectedMedia(null);
        setActiveIndex(nextIndex);
        return;
      }

      setIsTransitioning(true);
      const mediaCards = content.querySelectorAll<HTMLElement>(
        `.${styles.mediaCard}`,
      );
      const textElements = content.querySelectorAll<HTMLElement>(
        `.${styles.projectTitle}, .${styles.projectInformation}`,
      );

      gsap
        .timeline({
          onComplete: () => {
            setHoveredMedia(null);
            setSelectedMedia(null);
            setActiveIndex(nextIndex);
            setIsTransitioning(false);
          },
        })
        .to(mediaCards, {
          opacity: 0,
          yPercent: (index) => (index % 2 === 0 ? -28 : 32),
          xPercent: (index) => (index === 1 ? -18 : 12),
          scale: 0.88,
          rotation: (index) => (index - 1) * 2.5,
          duration: 0.65,
          stagger: 0.055,
          ease: "power3.inOut",
        })
        .to(
          textElements,
          {
            opacity: 0,
            y: 35,
            duration: 0.42,
            stagger: 0.04,
            ease: "power2.in",
          },
          0.05,
        );
    },
    [activeIndex, isTransitioning],
  );

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const mediaCards = content.querySelectorAll<HTMLElement>(
      `.${styles.mediaCard}`,
    );
    const textElements = content.querySelectorAll<HTMLElement>(
      `.${styles.projectTitle}, .${styles.projectInformation}`,
    );
    const animation = gsap.context(() => {
      gsap.fromTo(
        mediaCards,
        {
          opacity: 0,
          yPercent: (index) => (index % 2 === 0 ? 30 : -24),
          xPercent: (index) => (index === 1 ? -15 : 12),
          scale: 0.82,
          rotation: (index) => (index - 1) * -3,
        },
        {
          opacity: 1,
          yPercent: 0,
          xPercent: 0,
          scale: 1,
          rotation: 0,
          duration: 1.15,
          stagger: 0.09,
          ease: "power4.out",
        },
      );

      gsap.fromTo(
        textElements,
        { opacity: 0, y: 55 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          delay: 0.18,
          ease: "power3.out",
        },
      );
    }, content);

    return () => animation.revert();
  }, [activeIndex]);

  useEffect(() => {
    if (
      !isInView ||
      isPaused ||
      isTransitioning ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      transitionTo((activeIndex + 1) % projects.length);
    }, PROJECT_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isInView, isPaused, isTransitioning, transitionTo]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.intersectionRatio >= 0.55),
      { threshold: [0, 0.55] },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!stageRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const panel = stageRef.current?.querySelector<HTMLElement>(
        `.${styles.showcase}`,
      );
      const hero = document.querySelector("#top");
      const heroIntroduction = document.querySelector(
        "[data-hero-introduction]",
      );

      if (!panel) {
        return;
      }

      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top bottom",
          end: "top 76%",
          scrub: true,
          fastScrollEnd: true,
        },
      });

      transition.fromTo(
        panel,
        { clipPath: "inset(0 0 68% 0)" },
        { clipPath: "inset(0 0 0% 0)", ease: "none" },
      );

      if (hero) {
        transition.to(
          hero,
          { opacity: 0.1, scale: 0.98, yPercent: -5, ease: "none" },
          0,
        );
      }

      if (heroIntroduction) {
        transition.to(
          heroIntroduction,
          { opacity: 0, yPercent: -18, ease: "none" },
          0,
        );
      }
    }, stageRef);

    return () => animation.revert();
  }, []);

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false);
    }
  }

  const media = activeProject.media ?? [];

  return (
    <div ref={stageRef} className={styles.stage} id="selected-work">
      <section
        className={styles.showcase}
        aria-labelledby="showcase-project-title"
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={handleBlur}
      >
        <header className={styles.header}>
          <span>Selected projects / {activeProject.number}</span>
          <span>
            {activeProject.year} / {String(activeIndex + 1).padStart(2, "0")}—
            {String(projects.length).padStart(2, "0")}
          </span>
        </header>

        <div className={styles.viewport}>
          <article
            ref={contentRef}
            className={styles.projectContent}
            key={activeProject.slug}
          >
            <div className={styles.mediaComposition}>
              {media.length > 0
                ? media.slice(0, 3).map((item, index) => (
                    <button
                      className={`${styles.mediaCard} ${
                        focusedMedia === index ? styles.focusedMediaCard : ""
                      } ${
                        focusedMedia !== null && focusedMedia !== index
                          ? styles.backgroundMediaCard
                          : ""
                      }`}
                      type="button"
                      aria-label={`Focus artwork ${index + 1}: ${item.alt}`}
                      aria-pressed={selectedMedia === index}
                      onPointerEnter={() => setHoveredMedia(index)}
                      onPointerLeave={() => setHoveredMedia(null)}
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible")) {
                          setHoveredMedia(index);
                        }
                      }}
                      onBlur={() => setHoveredMedia(null)}
                      onClick={() =>
                        setSelectedMedia((current) =>
                          current === index ? null : index,
                        )
                      }
                      key={`${item.src}-${index}`}
                    >
                      <span className={styles.mediaCardSurface}>
                        <MediaItem media={item} index={index} />
                      </span>
                    </button>
                  ))
                : Array.from({ length: 3 }, (_, index) => (
                    <div
                      className={`${styles.mediaCard} ${styles.fallbackCard}`}
                      key={`${activeProject.slug}-${index}`}
                      aria-hidden="true"
                    >
                      {index === 0 && (
                        <>
                          <span className={styles.fallbackLabel}>Project file</span>
                          <span className={styles.fallbackNumber}>
                            {activeProject.number}
                          </span>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <span className={styles.fallbackLabel}>CODEX / Archive</span>
                          <span className={styles.fallbackTitle}>
                            {activeProject.title
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join(" / ")}
                          </span>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <span className={styles.fallbackLabel}>
                            {activeProject.year} / Study
                          </span>
                          <span className={styles.fallbackCategory}>
                            {activeProject.category}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
            </div>

            <div className={styles.projectDetails}>
              <h2 className={styles.projectTitle} id="showcase-project-title">
                <Link href={`/projects/${activeProject.slug}`}>
                  {activeProject.title}
                </Link>
              </h2>

              <div className={styles.projectInformation}>
                <p>{activeProject.summary}</p>
                <span>{activeProject.category}</span>
              </div>
            </div>
          </article>
        </div>

        <footer className={styles.footer}>
          <div className={styles.projectNavigation} aria-label="Choose project">
            {projects.map((project, index) => (
              <button
                className={index === activeIndex ? styles.activeButton : ""}
                type="button"
                aria-label={`Show ${project.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => transitionTo(index)}
                key={project.slug}
              >
                {project.number}
              </button>
            ))}
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <span
              className={
                isPaused || !isInView ? styles.progressPaused : ""
              }
              key={activeProject.slug}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              aria-label="Previous project"
              onClick={() =>
                transitionTo(
                  (activeIndex - 1 + projects.length) % projects.length,
                )
              }
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13 8H3M7 4 3 8l4 4" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => transitionTo((activeIndex + 1) % projects.length)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
            <Link
              className={styles.openProject}
              href={`/projects/${activeProject.slug}`}
            >
              Open project
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
