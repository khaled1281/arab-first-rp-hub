import { useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

/** Pointer-reactive 3D tilt wrapper with a moving light sheen. */
export function TiltCard({ children, className = "", intensity = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ rx: number; ry: number; mx: number; my: number; active: boolean }>({
    rx: 0,
    ry: 0,
    mx: 50,
    my: 50,
    active: false,
  });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({
      rx: (0.5 - py) * intensity,
      ry: (px - 0.5) * intensity,
      mx: px * 100,
      my: py * 100,
      active: true,
    });
  };

  const reset = () => setStyle((s) => ({ ...s, rx: 0, ry: 0, active: false }));

  return (
    <div className="scene-3d h-full" onPointerMove={onMove} onPointerLeave={reset}>
      <div
        ref={ref}
        className={`group/tilt relative h-full transition-[transform,box-shadow] duration-300 ease-out will-change-transform ${className}`}
        style={{
          transform: `perspective(1000px) rotateX(${style.rx}deg) rotateY(${style.ry}deg) translateZ(0) scale(${
            style.active ? 1.03 : 1
          })`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{
            background: `radial-gradient(320px circle at ${style.mx}% ${style.my}%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 65%)`,
          }}
          aria-hidden="true"
        />
        {children}
      </div>
    </div>
  );
}
