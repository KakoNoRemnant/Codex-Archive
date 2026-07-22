"use client";

import { useEffect } from "react";

function isCopyableTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-copyable]"));
}

export default function ContentProtection() {
  useEffect(() => {
    function preventCopy(event: ClipboardEvent) {
      if (!isCopyableTarget(event.target)) {
        event.preventDefault();
      }
    }

    function preventDrag(event: DragEvent) {
      if (!isCopyableTarget(event.target)) {
        event.preventDefault();
      }
    }

    function preventContextMenu(event: MouseEvent) {
      if (!isCopyableTarget(event.target)) {
        event.preventDefault();
      }
    }

    function preventProtectedShortcut(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        ["c", "x", "f"].includes(event.key.toLowerCase()) &&
        !isCopyableTarget(event.target)
      ) {
        event.preventDefault();
      }
    }

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventProtectedShortcut);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventProtectedShortcut);
    };
  }, []);

  return null;
}
