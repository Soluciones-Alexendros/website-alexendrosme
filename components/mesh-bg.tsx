"use client";

import { useEffect, useRef } from "react";

/**
 * MeshBg — fondo de identidad de alexendros.me.
 *
 * Una red de nodos latón sobre la atmósfera violeta: cada nodo es un punto
 * soberano y los enlaces aparecen solo cuando dos nodos se encuentran. Es la
 * imagen literal de «menos plataformas, más protocolos»: nadie en el centro,
 * todo conectado por caminos abiertos. Ocasionalmente un paquete viaja por un
 * enlace (un mensaje entre pares) y el cursor se une a la red como un nodo más.
 *
 * Reglas de oro (mismas que el resto del sistema):
 * - Sin dependencias, sin red, sin tracking: solo Canvas 2D.
 * - Colores leídos de los tokens `--ax-*` y re-leídos al cambiar de tema.
 * - prefers-reduced-motion / data-reduce / viewport estrecho → un único frame
 *   estático (la personalidad se mantiene, el movimiento no).
 * - Pausa en pestañas ocultas. DPR limitado a 2. Coste O(n²) con n ≤ 90.
 */

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Packet = { a: number; b: number; t: number; speed: number };
type Palette = { line: string; node: string; packet: string };

const MOBILE_MAX = 768;
const FALLBACK_DARK: Palette = { line: "#c9a24a", node: "#c9a24a", packet: "#f0d98a" };
const FALLBACK_LIGHT: Palette = { line: "#7a5a12", node: "#7a5a12", packet: "#5b4009" };

/** Devuelve `value` si el canvas lo entiende como color; si no, `fallback`. */
function validColor(ctx: CanvasRenderingContext2D, value: string, fallback: string): string {
  if (!value) return fallback;
  const sentinel = "#010203";
  ctx.fillStyle = sentinel;
  ctx.fillStyle = value;
  return ctx.fillStyle === sentinel ? fallback : value;
}

function readPalette(ctx: CanvasRenderingContext2D): Palette {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const light =
    root.getAttribute("data-theme") === "light" ||
    (!root.hasAttribute("data-theme") &&
      window.matchMedia("(prefers-color-scheme: light)").matches);
  const fb = light ? FALLBACK_LIGHT : FALLBACK_DARK;
  const accent = styles.getPropertyValue("--ax-accent").trim();
  const bright = styles.getPropertyValue("--ax-accent-bright").trim();
  return {
    line: validColor(ctx, accent, fb.line),
    node: validColor(ctx, accent, fb.node),
    // En claro, --ax-accent-bright es MÁS oscuro que el acento (hover); es lo que queremos.
    packet: validColor(ctx, bright, fb.packet),
  };
}

export function MeshBg() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let palette = readPalette(ctx);
    let linkDist = 140;
    let raf = 0;
    let running = false;
    let last = 0;
    let sinceSpawn = 0;
    let resizeRaf = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const isStatic = () =>
      reduceQuery.matches ||
      document.documentElement.getAttribute("data-reduce") === "true" ||
      window.innerWidth < MOBILE_MAX;

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = w < MOBILE_MAX;
      const count = small ? 26 : Math.max(34, Math.min(90, Math.floor((w * h) / 21000)));
      linkDist = small ? 120 : Math.max(120, Math.min(170, w / 9));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.1 + 0.7,
      }));
      packets = [];
    };

    const step = (k: number) => {
      for (const n of nodes) {
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 190 * 190 && d2 > 1) {
            const d = Math.sqrt(d2);
            const pull = ((190 - d) / 190) * 0.012 * k;
            n.vx += (dx / d) * pull;
            n.vy += (dy / d) * pull;
          }
        }
        // Amortiguación suave y tope de velocidad: deriva, nunca enjambre.
        n.vx *= 0.995;
        n.vy *= 0.995;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 0.45) {
          n.vx = (n.vx / sp) * 0.45;
          n.vy = (n.vy / sp) * 0.45;
        }
        n.x += n.vx * k;
        n.y += n.vy * k;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
      }
    };

    const links = (): Array<[number, number, number]> => {
      const out: Array<[number, number, number]> = [];
      const max2 = linkDist * linkDist;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!a) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < max2) out.push([i, j, 1 - Math.sqrt(d2) / linkDist]);
        }
      }
      return out;
    };

    const draw = (animated: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const ls = links();

      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.line;
      for (const [i, j, strength] of ls) {
        const a = nodes[i];
        const b = nodes[j];
        if (!a || !b) continue;
        ctx.globalAlpha = strength * 0.22;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // El visitante se une a la red: enlaces desde el cursor a los nodos cercanos.
      if (animated && pointer.active) {
        for (const n of nodes) {
          const d = Math.hypot(pointer.x - n.x, pointer.y - n.y);
          if (d < 170) {
            ctx.globalAlpha = (1 - d / 170) * 0.42;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = palette.node;
      for (const n of nodes) {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (animated) {
        ctx.fillStyle = palette.packet;
        for (const p of packets) {
          const a = nodes[p.a];
          const b = nodes[p.b];
          if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const fade = Math.sin(p.t * Math.PI);
          ctx.globalAlpha = 0.25 * fade;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.9 * fade;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      return ls;
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(48, now - last || 16.7);
      last = now;
      const k = dt / 16.7;

      step(k);

      // Avanza paquetes y descarta los que llegaron.
      for (const p of packets) p.t += p.speed * dt;
      packets = packets.filter((p) => p.t < 1);

      const ls = draw(true);

      sinceSpawn += dt;
      if (sinceSpawn > 1400 && packets.length < 4 && ls.length > 0) {
        sinceSpawn = 0;
        const pick = ls[Math.floor(Math.random() * ls.length)];
        if (pick) packets.push({ a: pick[0], b: pick[1], t: 0, speed: 1 / 1100 });
      }
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    /** Decide entre animar o pintar un solo frame, según preferencias y visibilidad. */
    const sync = () => {
      if (isStatic()) {
        stop();
        draw(false);
        return;
      }
      if (document.hidden) {
        stop();
        return;
      }
      start();
    };

    layout();
    sync();

    const onResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const widthChanged = window.innerWidth !== w;
        const heightJump = Math.abs(window.innerHeight - h) > h * 0.25;
        // En móvil la barra del navegador cambia innerHeight al hacer scroll: se ignora.
        if (widthChanged || heightJump) {
          layout();
          sync();
        }
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!finePointer.matches || e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    // Re-lee los tokens cuando cambia el tema (data-theme / class en <html>).
    const themeObserver = new MutationObserver(() => {
      palette = readPalette(ctx);
      if (!running) draw(false);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "data-reduce"],
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", sync);
    reduceQuery.addEventListener("change", sync);

    return () => {
      stop();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", sync);
      reduceQuery.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="mesh-canvas" data-testid="particle-bg" />;
}
