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
const PROJECT_EXIT_DURATION = 0.58;
const PROJECT_ENTER_DURATION = 0.82;

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
      unoptimized
    />
  );
}

export default function FeaturedProject() {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const transitionLockRef = useRef(true);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const activeProject = projects[activeIndex];

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (
        transitionLockRef.current ||
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
        setActiveIndex(nextIndex);
        return;
      }

      transitionLockRef.current = true;
      setIsTransitioning(true);
      const mediaCards = content.querySelectorAll<HTMLElement>(
        `.${styles.mediaCard}`,
      );
      const textElements = content.querySelectorAll<HTMLElement>(
        `.${styles.projectTitle}, .${styles.projectInformation}`,
      );

      transitionTimelineRef.current = gsap
        .timeline({
          onComplete: () => {
            transitionTimelineRef.current = null;
            setActiveIndex(nextIndex);
          },
        })
        .to(mediaCards, {
          opacity: 0,
          yPercent: (index) => (index % 2 === 0 ? -8 : 8),
          xPercent: (index) => (index === 1 ? -4 : 4),
          scale: 0.97,
          rotation: (index) => (index - 1) * 0.6,
          duration: PROJECT_EXIT_DURATION,
          stagger: 0.035,
          ease: "power2.inOut",
        })
        .to(
          textElements,
          {
            opacity: 0,
            y: 12,
            duration: 0.46,
            stagger: 0.025,
            ease: "power2.inOut",
          },
          0.05,
        );
    },
    [activeIndex],
  );

  useEffect(() => {
    const lock = transitionLockRef;
    const timeline = transitionTimelineRef;

    return () => {
      timeline.current?.kill();
      timeline.current = null;
      lock.current = false;
    };
  }, []);

  useEffect(() => {
    const content = contentRef.current;

    if (
      !content ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const unlockFrame = window.requestAnimationFrame(() => {
        transitionLockRef.current = false;
        setIsTransitioning(false);
      });

      return () => window.cancelAnimationFrame(unlockFrame);
    }

    const mediaCards = content.querySelectorAll<HTMLElement>(
      `.${styles.mediaCard}`,
    );
    const textElements = content.querySelectorAll<HTMLElement>(
      `.${styles.projectTitle}, .${styles.projectInformation}`,
    );
    const animation = gsap.context(() => {
      transitionTimelineRef.current = gsap
        .timeline({
          onComplete: () => {
            transitionTimelineRef.current = null;
            transitionLockRef.current = false;
            setIsTransitioning(false);
          },
        })
        .fromTo(
          mediaCards,
          {
            opacity: 0,
            yPercent: (index) => (index % 2 === 0 ? 8 : -8),
            xPercent: (index) => (index === 1 ? -4 : 4),
            scale: 0.96,
            rotation: (index) => (index - 1) * -0.6,
          },
          {
            opacity: 1,
            yPercent: 0,
            xPercent: 0,
            scale: 1,
            rotation: 0,
            duration: PROJECT_ENTER_DURATION,
            stagger: 0.045,
            ease: "power3.out",
          },
        )
        .fromTo(
          textElements,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.045,
            ease: "power2.out",
          },
          0.08,
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
  const displayedMedia = media.slice(0, 3);

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
                ? displayedMedia.map((item, frameIndex) => (
                    <div className={styles.mediaCard} key={item.src}>
                      <span className={styles.mediaCardSurface}>
                        <MediaItem media={item} index={frameIndex} />
                      </span>
                      <span className={styles.frameData} aria-hidden="true">
                        <span>FRAME {String(frameIndex + 1).padStart(2, "0")}</span>
                        <span>ARCHIVE</span>
                      </span>
                    </div>
                  ))
                : Array.from({ length: 3 }, (_, index) => (
                    <div
                      className={`${styles.mediaCard} ${styles.fallbackCard}`}
                      key={`${activeProject.slug}-${index}`}
                      aria-hidden="true"
                    >
                      {index === 0 && (
                        <>
                          <span className={styles.fallbackLabel}>
                            Project file
                          </span>
                          <span className={styles.fallbackNumber}>
                            {activeProject.number}
                          </span>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <span className={styles.fallbackLabel}>
                            CODEX / Archive
                          </span>
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
          <div className={styles.archiveLabel} aria-hidden="true">
            <span>CODEX / FILE INDEX</span>
            <span>{String(projects.length).padStart(2, "0")} RECORDS</span>
          </div>

          <div className={styles.projectNavigation} aria-label="Choose project">
            {projects.map((project, index) => (
              <button
                className={index === activeIndex ? styles.activeButton : ""}
                type="button"
                aria-label={`Show ${project.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                disabled={isTransitioning}
                onClick={() => transitionTo(index)}
                key={project.slug}
              >
                <span className={styles.fileNumber}>{project.number}</span>
                <span className={styles.fileTitle}>{project.title}</span>
                <span className={styles.fileState} aria-hidden="true">
                  {index === activeIndex ? "ACTIVE" : "OPEN"}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.recordAction}>
            <span>
              RECORD {activeProject.number} / {activeProject.year}
            </span>
            <Link
              className={styles.openProject}
              href={`/projects/${activeProject.slug}`}
            >
              Enter record
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
