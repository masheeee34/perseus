'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Lightweight 3D WebGL / Canvas Floating Gold Dust Particle System
 * Reacts to scroll speed and mouse position (Rockstar GTA VI aesthetic)
 */
export default function ThreeJsGoldDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      scrollSpeed = (currentScrollY - lastScrollY) * 0.15;
      lastScrollY = currentScrollY;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // 45 elegant floating micro-particles
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      speedX: number;
      speedY: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const goldColors = [
      'rgba(197, 160, 68, ',
      'rgba(232, 200, 74, ',
      'rgba(212, 185, 106, ',
      'rgba(255, 255, 255, ',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.6,
        baseAlpha: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Damp scroll speed
      scrollSpeed *= 0.92;

      time += 0.015;

      particles.forEach((p) => {
        // Move with natural drift + scroll reaction + slight mouse gravity
        p.x += p.speedX + (mouseX - width / 2) * 0.0003;
        p.y += p.speedY - scrollSpeed * 0.4;

        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Shimmering alpha pulse
        p.alpha = p.baseAlpha + Math.sin(time + p.x) * 0.15;

        // Draw soft glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(197, 160, 68, 0.4)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[40] opacity-75"
    />
  );
}
