'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CobaltOrbProps {
  titleComplete: boolean;
  terracottaVisible: boolean;
  questionsVisible: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface TrailPoint extends Position {
  opacity: number;
  id: number;
}

export default function CobaltOrb({ titleComplete, terracottaVisible, questionsVisible }: CobaltOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState<Position>({ x: 50, y: 30 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'title' | 'terracotta' | 'questions' | 'floating'>('intro');
  
  const trailIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Choreographed movement paths for different phases
  const movementPaths = {
    intro: [
      { x: 50, y: 30, duration: 2000 },
    ],
    title: [
      { x: 45, y: 25, duration: 1500 },
      { x: 55, y: 20, duration: 1500 },
    ],
    terracotta: [
      { x: 20, y: 45, duration: 2000 },
      { x: 80, y: 40, duration: 2000 },
    ],
    questions: [
      { x: 15, y: 60, duration: 1000 },
      { x: 85, y: 65, duration: 1000 },
      { x: 15, y: 75, duration: 1000 },
      { x: 85, y: 80, duration: 1000 },
    ],
    floating: [
      { x: 20, y: 20, duration: 4000 },
      { x: 80, y: 25, duration: 4000 },
      { x: 75, y: 70, duration: 4000 },
      { x: 25, y: 75, duration: 4000 },
    ]
  };

  // Update phase based on props
  useEffect(() => {
    if (questionsVisible) {
      setCurrentPhase('questions');
    } else if (terracottaVisible) {
      setCurrentPhase('terracotta');
    } else if (titleComplete) {
      setCurrentPhase('title');
    } else {
      setCurrentPhase('intro');
    }
  }, [titleComplete, terracottaVisible, questionsVisible]);

  // Animate the orb movement
  useEffect(() => {
    let currentPathIndex = 0;
    let startTime = Date.now();
    let startPosition = position;

    const animateMovement = () => {
      const path = movementPaths[currentPhase];
      if (!path || path.length === 0) return;

      const currentTarget = path[currentPathIndex];
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / currentTarget.duration, 1);

      // Smooth easing function
      const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = easeInOut(progress);

      const newPosition = {
        x: startPosition.x + (currentTarget.x - startPosition.x) * easedProgress,
        y: startPosition.y + (currentTarget.y - startPosition.y) * easedProgress
      };

      setPosition(newPosition);

      // Add trail point
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, {
          x: newPosition.x,
          y: newPosition.y,
          opacity: 1,
          id: trailIdRef.current++
        }];
        
        // Keep only recent trail points
        return newTrail.slice(-20);
      });

      if (progress >= 1) {
        // Move to next point in path
        currentPathIndex = (currentPathIndex + 1) % path.length;
        startTime = Date.now();
        startPosition = newPosition;
      }

      animationFrameRef.current = requestAnimationFrame(animateMovement);
    };

    animateMovement();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentPhase]);

  // Fade trail points
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setTrail(prevTrail => 
        prevTrail
          .map(point => ({ ...point, opacity: point.opacity - 0.05 }))
          .filter(point => point.opacity > 0)
      );
    }, 50);

    return () => clearInterval(fadeInterval);
  }, []);

  // Draw trail on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw trail
    trail.forEach((point, index) => {
      const x = (point.x / 100) * canvas.width;
      const y = (point.y / 100) * canvas.height;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      gradient.addColorStop(0, `rgba(0, 71, 171, ${point.opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(0, 71, 171, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [trail]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 3 }}
      />
      
      {/* Cobalt Orb */}
      <div
        ref={orbRef}
        className="cobalt-orb"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        <div className="orb-core" />
        <div className="orb-glow" />
        <div className="orb-pulse" />
      </div>

      <style jsx>{`
        .cobalt-orb {
          position: fixed;
          width: 40px;
          height: 40px;
          transform: translate(-50%, -50%);
          z-index: 4;
          pointer-events: none;
        }

        .orb-core {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, #4A90E2, #0047AB);
          border-radius: 50%;
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(0, 71, 171, 0.6),
            0 0 40px rgba(0, 71, 171, 0.3);
          animation: orbFloat 3s ease-in-out infinite;
        }

        .orb-glow {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, rgba(0, 71, 171, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: glowPulse 2s ease-in-out infinite alternate;
        }

        .orb-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(0, 71, 171, 0.4);
          border-radius: 50%;
          animation: pulsePulse 2s ease-in-out infinite;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }

        @keyframes glowPulse {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes pulsePulse {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cobalt-orb {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </>
  );
}