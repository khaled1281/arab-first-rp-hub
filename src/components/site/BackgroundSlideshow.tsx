import { useEffect, useState } from "react";
import bg1 from "@/assets/bg-1.png.asset.json";
import bg2 from "@/assets/bg-2.png.asset.json";
import bg3 from "@/assets/bg-3.png.asset.json";
import bg4 from "@/assets/bg-4.png.asset.json";

const slides = [bg1.url, bg2.url, bg3.url, bg4.url];

export function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === index ? 0.38 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
    </div>
  );
}
