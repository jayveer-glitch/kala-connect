'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

const ArtisticCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringDarkCard, setIsHoveringDarkCard] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([]);
  const particleIdRef = useRef(0);

  // Event handlers defined at component level
  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);
  
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.matches('button, a, input, textarea, [role="button"]') ||
                         target.closest('button, a, input, textarea, [role="button"]');
    setIsHovering(!!isInteractive);
    
    // Check if hovering over a dark gallery card
    const isDarkCard = target.closest('[data-dark-card="true"]') ||
                      target.closest('.dark-gallery-card') ||
                      target.matches('[data-dark-card="true"]');
    setIsHoveringDarkCard(!!isDarkCard);
  }, []);

  useEffect(() => {
    // Throttled mouse position updates for better performance
    let ticking = false;
    
    const updateMousePosition = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
          
          // Add particle trail every few pixels (reduced frequency)
          if (Math.random() > 0.8) { // Reduced from 0.7 to 0.8
            const newParticle = {
              id: particleIdRef.current++,
              x: e.clientX + (Math.random() - 0.5) * 10,
              y: e.clientY + (Math.random() - 0.5) * 10,
              timestamp: Date.now()
            };
            
            setParticles(prev => [...prev.slice(-8), newParticle]); // Reduced from 12 to 8
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', updateMousePosition, { passive: true });
      window.addEventListener('mousemove', handleMouseOver, { passive: true });
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Clean up old particles less frequently for better performance
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.timestamp < 600)); // Reduced from 800ms
    }, 200); // Increased from 100ms

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', updateMousePosition);
        window.removeEventListener('mousemove', handleMouseOver);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      clearInterval(interval);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseOver]);

  return (
    <>
      {/* AGGRESSIVE cursor hiding */}
      <style jsx global>{`
        *, *::before, *::after {
          cursor: none !important;
        }
        html {
          cursor: none !important;
        }
        body {
          cursor: none !important;
        }
        #__next {
          cursor: none !important;
        }
        div, span, p, h1, h2, h3, h4, h5, h6, button, a, input, textarea {
          cursor: none !important;
        }
      `}</style>

      {/* Particle Trail - GPU Optimized */}
      {particles.map((particle, index) => {
        const age = Date.now() - particle.timestamp;
        const opacity = Math.max(0, 1 - age / 600); // Reduced from 800
        const scale = Math.max(0.1, 1 - age / 500); // Reduced from 600
        const colors = ['#0047AB', '#E07A5F', '#2C2C2C', '#F8F5F2'];
        
        return (
          <div
            key={particle.id}
            style={{
              position: 'fixed',
              left: particle.x - 4,
              top: particle.y - 4,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors[index % colors.length],
              opacity: opacity * 0.8,
              transform: `scale(${scale}) translateZ(0)`, // Added translateZ for GPU
              willChange: 'transform, opacity', // Hint for GPU acceleration
              pointerEvents: 'none',
              zIndex: 999999998,
              boxShadow: `0 0 ${10 * opacity}px ${colors[index % colors.length]}40`
            }}
          />
        );
      })}

      {/* Main Artistic Cursor - GPU Optimized */}
      <div
        style={{
          position: 'fixed',
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: '40px',
          height: '40px',
          pointerEvents: 'none',
          zIndex: 999999999,
          transform: `scale(${isHovering ? 1.4 : isClicking ? 0.7 : 1}) translateZ(0)`,
          willChange: 'transform', // GPU acceleration hint
          transition: 'transform 0.05s ease-out',
        }}
      >
        {/* Outer Ring with Living Ink Theme */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            border: `3px solid ${isHoveringDarkCard ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 44, 44, 0.3)'}`,
            background: isHoveringDarkCard 
              ? 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' 
              : 'linear-gradient(45deg, rgba(44,44,44,0.1), rgba(248,245,242,0.1))',
            animation: 'rotate 3s linear infinite',
            boxShadow: isHoveringDarkCard 
              ? `
                0 0 30px rgba(255,255,255,0.6),
                0 0 60px rgba(255,255,255,0.3),
                inset 0 0 20px rgba(255,255,255,0.1)
              `
              : `
                0 0 20px rgba(44,44,44,0.2),
                inset 0 0 20px rgba(248,245,242,0.1)
              `,
            transition: 'all 0.05s ease-out'
          }}
        />
        
        {/* Inner Dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            backgroundColor: isHoveringDarkCard ? '#FFFFFF' : '#2C2C2C',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: isHoveringDarkCard 
              ? '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.4)' 
              : '0 0 10px rgba(44,44,44,0.6)',
            transition: 'all 0.05s ease-out'
          }}
        />
        
        {/* Hover State - Orbital Particles */}
        {isHovering && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#F8F5F2',
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `
                    translate(-50%, -50%) 
                    rotate(${(i * 60) + (Date.now() * 0.1) % 360}deg) 
                    translateX(25px)
                  `,
                  animation: 'orbit 2s linear infinite',
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: '0 0 6px rgba(248,245,242,0.8)'
                }}
              />
            ))}
          </>
        )}
        
        {/* Click Ripple Effect */}
        {isClicking && (
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              border: '2px solid #2C2C2C',
              animation: 'ripple 0.6s ease-out forwards',
              opacity: 0.8
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(25px); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(25px); }
        }
        
        @keyframes ripple {
          0% { 
            transform: scale(1) translateZ(0); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(3) translateZ(0); 
            opacity: 0; 
          }
        }
      `}</style>
    </>
  );
};

export default memo(ArtisticCursor);