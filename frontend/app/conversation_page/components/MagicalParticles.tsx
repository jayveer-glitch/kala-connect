'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface MagicalParticlesProps {
  intensity?: number;
  color?: string;
}

export default function MagicalParticles({ intensity = 20, color = 'cobalt' }: MagicalParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<FloatingParticle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const colorMap = {
    cobalt: { hue: 220, saturation: 100, lightness: 50 },
    terracotta: { hue: 15, saturation: 70, lightness: 60 },
    ink: { hue: 240, saturation: 100, lightness: 20 },
    gold: { hue: 45, saturation: 100, lightness: 50 }
  };

  const createParticle = (canvas: HTMLCanvasElement): FloatingParticle => {
    const colorInfo = colorMap[color as keyof typeof colorMap] || colorMap.cobalt;
    
    return {
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 1.5 - 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      hue: colorInfo.hue + (Math.random() - 0.5) * 30,
      life: 0,
      maxLife: Math.random() * 300 + 200
    };
  };

  const updateParticle = (particle: FloatingParticle, canvas: HTMLCanvasElement): boolean => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;
    
    // Add some magical floating motion
    particle.x += Math.sin(particle.life * 0.01) * 0.2;
    particle.vy *= 0.999; // Slight deceleration
    
    // Fade out as particle ages
    const ageRatio = particle.life / particle.maxLife;
    particle.opacity = (1 - ageRatio) * 0.6;
    
    // Remove particle if it's too old or off screen
    return particle.life < particle.maxLife && 
           particle.y > -10 && 
           particle.x > -10 && 
           particle.x < canvas.width + 10;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: FloatingParticle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    
    // Create a glowing effect
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    
    gradient.addColorStop(0, `hsl(${particle.hue}, 70%, 70%)`);
    gradient.addColorStop(0.5, `hsl(${particle.hue}, 60%, 50%)`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the core particle
    ctx.globalAlpha = particle.opacity * 0.8;
    ctx.fillStyle = `hsl(${particle.hue}, 80%, 60%)`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particles
    if (particlesRef.current.length < intensity && Math.random() < 0.3) {
      particlesRef.current.push(createParticle(canvas));
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const shouldKeep = updateParticle(particle, canvas);
      if (shouldKeep) {
        drawParticle(ctx, particle);
      }
      return shouldKeep;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (isVisible) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, intensity, color]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="magical-particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.7
      }}
    />
  );
}