"use client";

import { useEffect, useState } from "react";
import styles from "./CodeTerminal.module.css";

type Tone = "keyword" | "function" | "string" | "number" | "comment";

type Token = {
  text: string;
  tone?: Tone;
};

const code: Token[][] = [
  [
    { text: "// NEURAL FORM / GENERATIVE SYSTEM", tone: "comment" },
  ],
  [
    { text: "const ", tone: "keyword" },
    { text: "signal", tone: "function" },
    { text: " = new " },
    { text: "NeuralForm", tone: "function" },
    { text: "({" },
  ],
  [
    { text: "  topology: " },
    { text: '"adaptive"', tone: "string" },
    { text: "," },
  ],
  [
    { text: "  nodes: " },
    { text: "128", tone: "number" },
    { text: "," },
  ],
  [
    { text: "  sensitivity: " },
    { text: "0.86", tone: "number" },
    { text: "," },
  ],
  [{ text: "});" }],
  [],
  [
    { text: "function ", tone: "keyword" },
    { text: "evolve", tone: "function" },
    { text: "(frame: number) {" },
  ],
  [
    { text: "  signal." },
    { text: "map", tone: "function" },
    { text: "((node, index) => {" },
  ],
  [
    { text: "    node.phase = " },
    { text: "noise", tone: "function" },
    { text: "(index, frame * " },
    { text: "0.002", tone: "number" },
    { text: ");" },
  ],
  [{ text: "  });" }],
  [],
  [
    { text: "  return ", tone: "keyword" },
    { text: "signal." },
    { text: "render", tone: "function" },
    { text: "();" },
  ],
  [{ text: "}" }],
  [],
  [
    { text: "requestAnimationFrame", tone: "function" },
    { text: "(evolve);" },
  ],
];

const preparedCode = code.map((tokens, lineIndex) => {
  const lineLength = tokens.reduce(
    (total, token) => total + token.text.length,
    0,
  );
  const start = code.slice(0, lineIndex).reduce(
    (total, line) =>
      total +
      line.reduce(
        (lineTotal, token) => lineTotal + token.text.length,
        0,
      ) +
      1,
    0,
  );

  return { tokens, lineLength, start };
});

const totalCharacters = preparedCode.reduce(
  (total, line) => total + line.lineLength + 1,
  0,
);

export default function CodeTerminal() {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(
        () => setVisibleCharacters(totalCharacters),
        0,
      );

      return () => window.clearTimeout(reducedMotionTimer);
    }

    let currentCharacter = 0;
    let timer: number;

    const typeNextCharacter = () => {
      if (currentCharacter >= totalCharacters) {
        timer = window.setTimeout(() => {
          currentCharacter = 0;
          setVisibleCharacters(0);
          typeNextCharacter();
        }, 1800);
        return;
      }

      currentCharacter += 1;
      setVisibleCharacters(currentCharacter);
      timer = window.setTimeout(
        typeNextCharacter,
        18 + Math.random() * 34,
      );
    };

    timer = window.setTimeout(typeNextCharacter, 350);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.terminal} aria-hidden="true">
      <header className={styles.header}>
        <span>fashion_design.ts</span>
        <span>runtime / active</span>
      </header>

      <div className={styles.code}>
        {preparedCode.map(({ tokens, lineLength, start }, lineIndex) => {
          const visibleOnLine = Math.max(
            0,
            Math.min(lineLength, visibleCharacters - start),
          );
          const isActiveLine =
            visibleCharacters >= start &&
            visibleCharacters <= start + lineLength;
          let tokenOffset = 0;

          const renderedTokens = tokens.map((token, tokenIndex) => {
            const shownLength = Math.max(
              0,
              Math.min(
                token.text.length,
                visibleOnLine - tokenOffset,
              ),
            );
            tokenOffset += token.text.length;

            return (
              <span
                className={token.tone ? styles[token.tone] : undefined}
                key={`${lineIndex}-${tokenIndex}`}
              >
                {token.text.slice(0, shownLength)}
              </span>
            );
          });

          return (
            <div className={styles.line} key={lineIndex}>
              <span className={styles.lineNumber}>
                {String(lineIndex + 1).padStart(2, "0")}
              </span>
              <code>
                {renderedTokens}
                {isActiveLine && <span className={styles.caret} />}
              </code>
            </div>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <span>UTF-8</span>
        <span>TYPE / SCRIPT</span>
        <span>{Math.round((visibleCharacters / totalCharacters) * 100)}%</span>
      </footer>
    </div>
  );
}
