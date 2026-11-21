// A small, dependency-free confetti burst for celebratory moments.
// Skipped entirely for visitors who prefer reduced motion.

const COLORS = ["#ff5a36", "#ffb800", "#18c37e", "#2f80ff", "#a259ff", "#ffffff"];

type Piece = {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; vr: number; color: string; shape: 0 | 1;
};

export function burstConfetti(origin?: HTMLElement | null, count = 140): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100vw", height: "100vh",
    pointerEvents: "none", zIndex: "9999",
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const rect = origin?.getBoundingClientRect();
  const ox = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const oy = rect ? rect.top + Math.min(rect.height / 3, 80) : window.innerHeight / 3;

  const pieces: Piece[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 7 + Math.random() * 9;
    return {
      x: ox, y: oy,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6, rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() < 0.7 ? 0 : 1,
    };
  });

  const start = performance.now();
  const DURATION = 3200;

  const frame = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const fade = t > DURATION - 800 ? Math.max(0, (DURATION - t) / 800) : 1;
    for (const p of pieces) {
      p.vy += 0.28;           // gravity
      p.vx *= 0.985;          // drag
      p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 0) {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    if (t < DURATION) requestAnimationFrame(frame);
    else { window.removeEventListener("resize", resize); canvas.remove(); }
  };
  requestAnimationFrame(frame);
}
