import { useEffect } from "react";

/**
 * Deterrents against casual copying: blocks context menu, text selection,
 * drag of media, and the common devtools/view-source shortcuts.
 * Disabled inside iframes (Lovable preview / editors).
 */
export function CodeProtection() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.self !== window.top) return;

    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onDragStart = (e: DragEvent) => e.preventDefault();
    const onCopy = (e: ClipboardEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const blocked =
        e.key === "F12" ||
        (e.ctrlKey && !e.shiftKey && ["u", "s", "c"].includes(key)) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
        (e.metaKey && e.altKey && ["i", "j", "c", "u"].includes(key));
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("keydown", onKeyDown, true);

    const style = document.createElement("style");
    style.textContent = `
      body { -webkit-user-select: none; -ms-user-select: none; user-select: none; -webkit-touch-callout: none; }
      input, textarea, [contenteditable="true"] { -webkit-user-select: text; user-select: text; }
      img, video { -webkit-user-drag: none; user-drag: none; pointer-events: auto; }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("keydown", onKeyDown, true);
      style.remove();
    };
  }, []);

  return null;
}
