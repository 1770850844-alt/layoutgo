import { useEffect, useRef } from 'react';

type Speck = {
  x: number;
  y: number;
  depth: number;
  drift: number;
  phase: number;
  color: string;
};

const palette = ['#3152a2', '#d49b3f', '#66a99a'];
const particleSettings = {
  count: 500,
  density: 100,
  starSize: 32,
  focalDepth: 8,
  turbulence: 0,
  brightness: 100,
  glitterIntensity: 3
};

export function GlitterBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const specks: Speck[] = Array.from({ length: particleSettings.count }, (_, index) => ({
      x: (1 - particleSettings.density / 100) / 2 + Math.random() * (particleSettings.density / 100),
      y: (1 - particleSettings.density / 100) / 2 + Math.random() * (particleSettings.density / 100),
      depth: particleSettings.focalDepth / 100 + Math.random() * (1 - particleSettings.focalDepth / 100),
      drift: 0.08 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      color: palette[index % palette.length]
    }));

    let width = 1;
    let height = 1;
    let frame = 0;
    let lastTime = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      const delta = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      context.clearRect(0, 0, width, height);

      for (const speck of specks) {
        if (!reduceMotion) {
          speck.y -= speck.drift * delta * 0.08;
          speck.x += Math.sin(now / 2350 + speck.phase) * delta * 0.01;
          if (particleSettings.turbulence) {
            speck.x += Math.cos(now / 630 + speck.phase) * delta * particleSettings.turbulence * 0.002;
          }
          if (speck.y < -0.04) {
            speck.y = 1.04;
            speck.x = Math.random();
          }
        }

        const size = (0.72 + speck.depth * 1.8) * (particleSettings.starSize / 20);
        const sparkle = 0.72 + Math.sin(now / 1500 + speck.phase) * (particleSettings.glitterIntensity / 10);
        const alpha = (0.14 + speck.depth * 0.25) * sparkle * (particleSettings.brightness / 100);
        context.globalAlpha = alpha;
        context.fillStyle = speck.color;
        context.fillRect(speck.x * width, speck.y * height, size, size);
      }
      context.globalAlpha = 1;
      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw(lastTime);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="glitter-backdrop" aria-hidden="true" />;
}
