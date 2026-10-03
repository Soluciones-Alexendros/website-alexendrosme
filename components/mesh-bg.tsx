"use client";

import { useEffect, useRef } from "react";
import { MOTION_EVENT, motionAllowed } from "@/lib/motion";

/**
 * MeshBg v2 — fondo de identidad de alexendros.me.
 *
 * Una red de nodos latón sin centro: cada nodo es soberano y los enlaces solo aparecen cuando
 * dos nodos se encuentran («menos plataformas, más protocolos»). Esta versión está VIVA en todos
 * los dispositivos, también en móvil:
 *
 * - 3 capas de profundidad (lejos / medio / cerca) con parallax al hacer scroll.
 * - Nodos «hub» con halo que respira; el resto titila con fase propia.
 * - Paquetes con estela viajando entre pares (mensajes entre iguales).
 * - El cursor (ratón) atrae y se une a la red; un toque/clic lanza una onda y despierta
 *   paquetes desde los nodos cercanos.
 * - Gobernador de rendimiento: si los fotogramas tardan, reduce nodos de forma gradual;
 *   en móvil/equipos modestos limita a ~30 fps.
 *
 * Accesibilidad (WCAG 2.2.2): `prefers-reduced-motion` → un único fotograma estático, y el
 * visitante puede decidir lo contrario con el control de pausa/reanudar del pie
 * (`<html data-motion="on|off">`, ver lib/motion.ts).
 *
 * Reglas de oro: sin dependencias, sin red, sin tracking. Colores leídos de `--ax-*` y
 * re-leídos al cambiar de tema. Pausa en pestañas ocultas. DPR ≤ 2.
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: 0 | 1 | 2; // 0 lejos · 1 medio · 2 cerca
  phase: number;
  hub: boolean;
};
type Packet = { a: number; b: number; t: number; speed: number };
type Ripple = { x: number; y: number; age: number };
type Palette = { line: string; node: string; packet: string };
type Link = [number, number, number];

const MOBILE_MAX = 768;
/** Cuánto se desplaza cada capa con el scroll (px de parallax por px de scroll). */
const PARALLAX = [0.03, 0.07, 0.13] as const;
const DEPTH_ALPHA = [0.32, 0.5, 0.78] as const;
const DEPTH_SPEED = [0.6, 1, 1.5] as const;
const RIPPLE_MS = 900;
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

    const root = document.documentElement;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let ripples: Ripple[] = [];
    let palette = readPalette(ctx);
    let linkDist = 140;
    let raf = 0;
    let running = false;
    let last = 0;
    let clock = 0;
    let sinceSpawn = 0;
    let resizeRaf = 0;
    let scrollRaf = 0;
    let scrollY = window.scrollY;
    let lastLinks: Link[] = [];
    // Gobernador: media móvil exponencial del coste de fotograma.
    let avgDt = 16.7;
    let slowMs = 0;
    let lastDraw = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const lowPower = () =>
      window.innerWidth < MOBILE_MAX || (navigator.hardwareConcurrency ?? 8) <= 4;
    /** Intervalo mínimo entre fotogramas: ~30 fps en móvil / equipos modestos, nativo en el resto. */
    const frameInterval = () => (lowPower() ? 32 : 0);

    const allowed = () =>
      motionAllowed({
        attr: root.getAttribute("data-motion"),
        systemReduce: reduceQuery.matches,
        dataReduce: root.getAttribute("data-reduce") === "true",
      });

    const makeNode = (hub: boolean): Node => {
      const roll = Math.random();
      const depth: 0 | 1 | 2 = hub ? 2 : roll < 0.4 ? 0 : roll < 0.8 ? 1 : 2;
      const sp = DEPTH_SPEED[depth];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22 * sp,
        vy: (Math.random() - 0.5) * 0.22 * sp,
        r: (Math.random() * 1.0 + 0.6) * (0.8 + depth * 0.3),
        depth,
        phase: Math.random() * Math.PI * 2,
        hub,
      };
    };

    const populate = () => {
      const small = w < MOBILE_MAX;
      const count = small ? 34 : Math.max(40, Math.min(96, Math.floor((w * h) / 20000)));
      linkDist = small ? 125 : Math.max(125, Math.min(175, w / 9));
      const hubs = small ? 3 : 6;
      nodes = Array.from({ length: count }, (_, i) => makeNode(i < hubs));
      packets = [];
      ripples = [];
    };

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
    };

    /** Posición vertical de dibujo: parallax por capa, envuelta en el alto de la ventana. */
    const py = (n: Node) => {
      const y = n.y - scrollY * PARALLAX[n.depth];
      return ((y % h) + h) % h;
    };

    const step = (k: number) => {
      for (const n of nodes) {
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - py(n);
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200 && d2 > 1) {
            const d = Math.sqrt(d2);
            const pull = ((200 - d) / 200) * 0.012 * k * DEPTH_SPEED[n.depth];
            n.vx += (dx / d) * pull;
            n.vy += (dy / d) * pull;
          }
        }
        // Amortiguación suave y tope de velocidad: deriva, nunca enjambre.
        n.vx *= 0.995;
        n.vy *= 0.995;
        const cap = 0.45 * DEPTH_SPEED[n.depth];
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > cap) {
          n.vx = (n.vx / sp) * cap;
          n.vy = (n.vy / sp) * cap;
        }
        n.x += n.vx * k;
        n.y += n.vy * k;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
      }
    };

    const links = (ys: number[]): Link[] => {
      const out: Link[] = [];
      const max2 = linkDist * linkDist;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!a) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (!b) continue;
          // Solo se enlazan capas contiguas: da sensación de profundidad real.
          if (Math.abs(a.depth - b.depth) > 1) continue;
          const dx = a.x - b.x;
          const dy = (ys[i] ?? 0) - (ys[j] ?? 0);
          const d2 = dx * dx + dy * dy;
          if (d2 < max2) out.push([i, j, 1 - Math.sqrt(d2) / linkDist]);
        }
      }
      return out;
    };

    const draw = (animated: boolean): Link[] => {
      ctx.clearRect(0, 0, w, h);
      const ys = nodes.map(py);
      const ls = links(ys);

      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.line;
      for (const [i, j, strength] of ls) {
        const a = nodes[i];
        const b = nodes[j];
        if (!a || !b) continue;
        ctx.globalAlpha = strength * 0.24 * (0.6 + 0.2 * (a.depth + b.depth));
        ctx.beginPath();
        ctx.moveTo(a.x, ys[i] ?? 0);
        ctx.lineTo(b.x, ys[j] ?? 0);
        ctx.stroke();
      }

      // El visitante se une a la red: enlaces desde el cursor a los nodos cercanos.
      if (animated && pointer.active) {
        ctx.lineWidth = 1.2;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (!n) continue;
          const d = Math.hypot(pointer.x - n.x, pointer.y - (ys[i] ?? 0));
          if (d < 175) {
            ctx.globalAlpha = (1 - d / 175) * 0.5;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(n.x, ys[i] ?? 0);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = palette.node;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n) continue;
        const y = ys[i] ?? 0;
        // Titileo con fase propia; en estático, brillo fijo.
        const tw = animated
          ? 0.82 + 0.18 * Math.sin(clock * 0.0015 * (1 + n.depth * 0.4) + n.phase)
          : 1;
        if (n.hub) {
          // Halo que respira alrededor de los hubs («protocolos»).
          const breathe = animated ? 0.5 + 0.5 * Math.sin(clock * 0.0011 + n.phase) : 0.5;
          ctx.globalAlpha = 0.07 + 0.09 * breathe;
          ctx.beginPath();
          ctx.arc(n.x, y, 9 + 6 * breathe, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.85 * tw;
          ctx.beginPath();
          ctx.arc(n.x, y, n.r + 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = DEPTH_ALPHA[n.depth] * tw;
          ctx.beginPath();
          ctx.arc(n.x, y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (animated) {
        // Paquetes con estela: un segmento corto que sigue a la cabeza.
        ctx.strokeStyle = palette.packet;
        ctx.fillStyle = palette.packet;
        for (const p of packets) {
          const a = nodes[p.a];
          const b = nodes[p.b];
          if (!a || !b) continue;
          const ay = ys[p.a] ?? 0;
          const by = ys[p.b] ?? 0;
          const x = a.x + (b.x - a.x) * p.t;
          const y = ay + (by - ay) * p.t;
          const t0 = Math.max(0, p.t - 0.16);
          const tx = a.x + (b.x - a.x) * t0;
          const ty = ay + (by - ay) * t0;
          const fade = Math.sin(p.t * Math.PI);
          ctx.globalAlpha = 0.5 * fade;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.globalAlpha = 0.22 * fade;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.95 * fade;
          ctx.beginPath();
          ctx.arc(x, y, 1.9, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ondas al tocar/clicar.
        ctx.lineWidth = 1.4;
        for (const r of ripples) {
          const life = r.age / RIPPLE_MS;
          ctx.globalAlpha = 0.5 * (1 - life);
          ctx.beginPath();
          ctx.arc(r.x, r.y, 6 + life * 120, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      return ls;
    };

    const spawnPacket = (ls: Link[], near?: { x: number; y: number }) => {
      if (ls.length === 0) return;
      let pick = ls[Math.floor(Math.random() * ls.length)];
      if (near) {
        // Prefiere el enlace más cercano al punto del toque.
        let best = Infinity;
        for (const l of ls) {
          const a = nodes[l[0]];
          if (!a) continue;
          const d = Math.hypot(a.x - near.x, py(a) - near.y);
          if (d < best) {
            best = d;
            pick = l;
          }
        }
      }
      if (pick) {
        packets.push({ a: pick[0], b: pick[1], t: 0, speed: 1 / (900 + Math.random() * 500) });
      }
    };

    /** Gobernador: si el coste medio de fotograma supera el presupuesto, se aligera la red. */
    const govern = (dt: number) => {
      avgDt = avgDt * 0.92 + dt * 0.08;
      const budget = Math.max(24, frameInterval() + 10);
      if (avgDt > budget) slowMs += dt;
      else slowMs = Math.max(0, slowMs - dt);
      if (slowMs > 1500 && nodes.length > 20) {
        slowMs = 0;
        const drop = Math.max(2, Math.floor(nodes.length * 0.15));
        nodes.splice(nodes.length - drop, drop);
        packets = packets.filter((p) => p.a < nodes.length && p.b < nodes.length);
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const minGap = frameInterval();
      if (minGap && now - lastDraw < minGap - 2) return;
      lastDraw = now;

      const dt = Math.min(64, now - last || 16.7);
      last = now;
      clock += dt;

      step(dt / 16.7);
      for (const p of packets) p.t += p.speed * dt;
      packets = packets.filter((p) => p.t < 1);
      for (const r of ripples) r.age += dt;
      ripples = ripples.filter((r) => r.age < RIPPLE_MS);

      lastLinks = draw(true);

      sinceSpawn += dt;
      if (sinceSpawn > 1100 && packets.length < 5) {
        sinceSpawn = 0;
        spawnPacket(lastLinks);
      }
      govern(dt);
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
      lastDraw = 0;
      raf = requestAnimationFrame(frame);
    };

    /** Decide entre animar o pintar un solo fotograma, según preferencias y visibilidad. */
    const sync = () => {
      if (!allowed()) {
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

    const onScroll = () => {
      scrollY = window.scrollY;
      // En estático el parallax también se refleja, sin bucle de animación.
      if (!running && !scrollRaf) {
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0;
          draw(false);
        });
      }
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
    const onPointerDown = (e: PointerEvent) => {
      if (!running) return;
      ripples.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (ripples.length > 4) ripples.shift();
      for (let i = 0; i < 2 && packets.length < 8; i++) {
        spawnPacket(lastLinks, { x: e.clientX, y: e.clientY });
      }
    };

    // Re-lee los tokens cuando cambia el tema; reacciona al control de pausa.
    const attrObserver = new MutationObserver(() => {
      palette = readPalette(ctx);
      if (!running) draw(false);
      sync();
    });
    attrObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "data-reduce", "data-motion"],
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener(MOTION_EVENT, sync);
    root.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", sync);
    reduceQuery.addEventListener("change", sync);

    return () => {
      stop();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      attrObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener(MOTION_EVENT, sync);
      root.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", sync);
      reduceQuery.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="mesh-canvas" data-testid="particle-bg" />;
}
