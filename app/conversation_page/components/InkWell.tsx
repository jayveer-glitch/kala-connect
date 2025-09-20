'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface InkWellProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  id: number;
}

export default function InkWell({ onClick, disabled = false, className = '' }: InkWellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [showSplatter, setShowSplatter] = useState(false);
  
  const inkwellRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);
  const mousePosRef = useRef({ x: 50, y: 50 });

  // Continuous ripple effect
  useEffect(() => {
    if (disabled) return;

    const createRipple = () => {
      const baseX = 50 + (Math.random() - 0.5) * 20;
      const baseY = 50 + (Math.random() - 0.5) * 20;
      
      const newRipple: Ripple = {
        x: isHovered ? mousePosRef.current.x : baseX,
        y: isHovered ? mousePosRef.current.y : baseY,
        size: 0,
        opacity: isHovered ? 0.8 : 0.4,
        id: rippleIdRef.current++,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 40
      };
      
      setRipples(prev => [...prev, newRipple]);
    };

    const interval = setInterval(createRipple, isHovered ? 200 : 800);
    return () => clearInterval(interval);
  }, [isHovered, disabled]);

  // Enhanced physics-based ripple animation
  useEffect(() => {
    const animateRipples = () => {
      setRipples(prev => 
        prev
          .map(ripple => {
            const newRipple = { ...ripple };
            
            // Physics-based movement
            newRipple.x += newRipple.vx;
            newRipple.y += newRipple.vy;
            newRipple.life++;
            
            // Size growth with physics
            newRipple.size += 1.5 + (newRipple.life * 0.1);
            
            // Magnetic attraction to cursor when hovered
            if (isHovered) {
              const dx = mousePosRef.current.x - newRipple.x;
              const dy = mousePosRef.current.y - newRipple.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 5) {
                const attraction = 0.02;
                newRipple.vx += (dx / distance) * attraction;
                newRipple.vy += (dy / distance) * attraction;
              }
            }
            
            // Damping
            newRipple.vx *= 0.99;
            newRipple.vy *= 0.99;
            
            // Opacity fade based on life
            const lifeRatio = newRipple.life / newRipple.maxLife;
            newRipple.opacity = (1 - lifeRatio) * (isHovered ? 0.8 : 0.4);
            
            return newRipple;
          })
          .filter(ripple => ripple.life < ripple.maxLife && ripple.opacity > 0.01 && ripple.size < 200)
      );
    };

    const animationFrame = setInterval(animateRipples, 16);
    return () => clearInterval(animationFrame);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!inkwellRef.current) return;
    
    const rect = inkwellRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    mousePosRef.current = { x, y };
  };

  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    setShowSplatter(true);
    
    // Create explosion of ripples
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const explosionRipple: Ripple = {
          x: mousePosRef.current.x + (Math.random() - 0.5) * 40,
          y: mousePosRef.current.y + (Math.random() - 0.5) * 40,
          size: 0,
          opacity: 1,
          id: rippleIdRef.current++,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: 30 + Math.random() * 20
        };
        setRipples(prev => [...prev, explosionRipple]);
      }, i * 50);
    }

    setTimeout(() => {
      onClick();
    }, 1000);
  };

  return (
    <>
      <div className={`inkwell-container ${className}`}>
        <div
          ref={inkwellRef}
          className={`inkwell ${disabled ? 'disabled' : ''} ${isClicked ? 'clicked' : ''}`}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => !disabled && setIsHovered(false)}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          {/* Ink Pool */}
          <div className="ink-pool">
            {/* Ripples */}
            <div className="ripples-container">
              {ripples.map(ripple => (
                <div
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: `${ripple.x}%`,
                    top: `${ripple.y}%`,
                    width: `${ripple.size}px`,
                    height: `${ripple.size}px`,
                    opacity: ripple.opacity,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>
            
            {/* Text */}
            <div className={`${playfair.className} inkwell-text`}>
              Weave the Story
            </div>
          </div>
          
          {/* Magnetic Pull Effect */}
          {isHovered && !disabled && (
            <div 
              className="magnetic-pull"
              style={{
                left: `${mousePosRef.current.x}%`,
                top: `${mousePosRef.current.y}%`
              }}
            />
          )}
        </div>
      </div>

      {/* Splatter Transition */}
      {showSplatter && (
        <div className="splatter-overlay">
          <div className="splatter-animation" />
        </div>
      )}

      <style jsx>{`
        .inkwell-container {
          display: flex;
          justify-content: center;
          margin: 60px 0;
        }

        .inkwell {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: inkwellFloat 4s ease-in-out infinite;
        }

        .inkwell.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .inkwell.clicked {
          animation: inkwellClick 1s ease-out forwards;
        }

        @keyframes inkwellFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }

        @keyframes inkwellClick {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.2); opacity: 0; }
        }

        .ink-pool {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, #4A90E2, #0047AB);
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          box-shadow: 
            inset 0 10px 20px rgba(255, 255, 255, 0.2),
            0 0 30px rgba(0, 71, 171, 0.6),
            0 0 60px rgba(0, 71, 171, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inkwell:hover .ink-pool {
          box-shadow: 
            inset 0 10px 20px rgba(255, 255, 255, 0.3),
            0 0 40px rgba(0, 71, 171, 0.8),
            0 0 80px rgba(0, 71, 171, 0.4);
          animation: inkPoolPulse 0.5s ease-in-out;
        }

        @keyframes inkPoolPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .ripples-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          overflow: hidden;
        }

        .ripple {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
          animation: rippleExpand 2s ease-out;
        }

        @keyframes rippleExpand {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 150px;
            height: 150px;
            opacity: 0;
          }
        }

        .inkwell-text {
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .inkwell:hover .inkwell-text {
          font-size: 1.3rem;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          animation: textGlow 0.5s ease-in-out;
        }

        @keyframes textGlow {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.05); }
        }

        .magnetic-pull {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: magneticPulse 1s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes magneticPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.4; }
        }

        .splatter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
        }

        .splatter-animation {
          width: 100%;
          height: 100%;
          background: #0047AB;
          clip-path: circle(0% at 50% 50%);
          animation: splatterExplosion 1.5s ease-out forwards;
        }

        @keyframes splatterExplosion {
          0% {
            clip-path: circle(0% at 50% 50%);
          }
          30% {
            clip-path: circle(50% at 50% 50%);
          }
          100% {
            clip-path: circle(150% at 50% 50%);
            opacity: 0;
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .inkwell {
            width: 150px;
            height: 150px;
          }
          
          .inkwell-text {
            font-size: 1rem;
          }
          
          .inkwell:hover .inkwell-text {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </>
  );
}