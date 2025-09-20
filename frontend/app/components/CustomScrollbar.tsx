'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

interface CustomScrollbarProps {
  color?: string;
  thickness?: number;
  position?: 'left' | 'right';
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ 
  color = "rgba(0, 0, 0, 0.8)", 
  thickness = 2,
  position = 'right'
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Throttled scroll handler for better performance
    let ticking = false;
    
    const updateScrollProgress = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        setScrollY(currentScrollY);
        
        const scrollTop = currentScrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        setScrollProgress(progress);
        
        // Set scrolling state
        setIsScrolling(true);
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Set timeout to mark scrolling as finished
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      }
      ticking = false;
    };

    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', requestScrollUpdate, { passive: true });
      updateScrollProgress(); // Initial call
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', requestScrollUpdate);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Continuous animation loop with slower speed
  useEffect(() => {
    const animate = () => {
      setAnimationTime(Date.now() * 0.001); // Convert to seconds
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate continuously animated wavy path with more waves and slower animation
  const generateWavyPath = () => {
    // Calculate actual available height
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 64 : 800; // 64px = 4rem top offset
    const startY = 10;
    const endY = containerHeight - 10;
    const amplitude = 4; // Reduced amplitude for thinner waves
    const frequency = 0.12; // Increased frequency for more waves
    const timeOffset = animationTime * 0.8; // Slower animation speed
    const baseX = 15; // Center point at 15px for 30px wide SVG
    
    let path = `M ${baseX} ${startY}`; // Start point
    
    for (let y = startY; y <= endY; y += 1) {
      const waveOffset = Math.sin((y * frequency) + timeOffset) * amplitude;
      const waveX = position === 'left' ? baseX - waveOffset : baseX + waveOffset;
      path += ` L ${waveX} ${y}`;
    }
    
    return path;
  };

  // Calculate the exact X position on the wave for the circle
  const getCircleXPosition = (yPosition: number) => {
    const amplitude = 4; // Match the path amplitude
    const frequency = 0.12; // Match the path frequency
    const timeOffset = animationTime * 0.8; // Match the path animation speed
    const baseX = 15; // Center at 15px within 30px SVG
    const waveOffset = Math.sin((yPosition * frequency) + timeOffset) * amplitude;
    return position === 'left' ? baseX - waveOffset : baseX + waveOffset;
  };

  // Calculate Y position for the circle based on scroll progress
  const getCircleYPosition = () => {
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 64 : 800;
    const startY = 10;
    const endY = containerHeight - 10;
    return startY + (endY - startY) * scrollProgress;
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Header height is typically 4rem (64px)
  const headerHeight = 64;
  const isHeaderScrolledOut = scrollY > headerHeight;

  const positionClass = position === 'left' ? 'left-6' : 'right-12';

  return (
    <div 
      className={`fixed ${positionClass} z-50 pointer-events-none transition-all duration-300 ease-out`} 
      style={{ 
        top: isHeaderScrolledOut ? '0px' : '4rem',
        height: isHeaderScrolledOut ? '100vh' : 'calc(100vh - 4rem)',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
    >
      
      <svg 
        width="30" 
        height="100%" 
        className="absolute top-0 left-0 z-20"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)' // Force GPU layer
        }}
      >
        {/* Main animated wavy line with enhanced visibility */}
        <motion.path
          d={generateWavyPath()}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          style={{
            filter: `drop-shadow(0 0 6px ${color.replace('0.8', '0.6')})`
          }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut" },
          }}
        />
        
        {/* Background glow for the main line */}
        <motion.path
          d={generateWavyPath()}
          stroke={color.replace('0.8', '0.2')}
          strokeWidth={thickness + 1}
          fill="none"
          style={{
            filter: 'blur(2px)'
          }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut" },
          }}
        />
        
        {/* Secondary wave effect for more dynamic animation */}
        <motion.path
          d={generateWavyPath()}
          stroke={color.replace('0.8', '0.3')}
          strokeWidth={thickness - 0.5}
          fill="none"
          style={{
            transform: `translateX(${Math.sin(animationTime * 0.6) * 2}px)`
          }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        
        {/* Tertiary wave effect for even more depth */}
        <motion.path
          d={generateWavyPath()}
          stroke={color.replace('0.8', '0.15')}
          strokeWidth={thickness - 1}
          fill="none"
          style={{
            transform: `translateX(${Math.cos(animationTime * 0.4) * 1.5}px)`
          }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Enhanced scroll position indicator with glow */}
        <motion.circle
          cx={getCircleXPosition(getCircleYPosition())}
          cy={getCircleYPosition()}
          r={isScrolling ? 5 : 4}
          fill={color.replace('0.8', '0.95')}
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="0.5"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.9, 0.6, 0.9]
          }}
          transition={{ 
            duration: 0.3,
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            filter: `drop-shadow(0 0 8px ${color.replace('0.8', '0.7')}) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))`
          }}
        />
        
        {/* Background glow for the indicator */}
        <motion.circle
          cx={getCircleXPosition(getCircleYPosition())}
          cy={getCircleYPosition()}
          r={isScrolling ? 7 : 6}
          fill={color.replace('0.8', '0.1')}
          style={{
            filter: 'blur(3px)'
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Floating particles effect when not scrolling */}
        {!isScrolling && (
          <>
            <motion.circle
              cx={(position === 'left' ? 13 : 10) + Math.sin(animationTime * 1.2) * 2}
              cy={100 + Math.cos(animationTime * 0.9) * 12}
              r="1"
              fill={color.replace('0.8', '0.4')}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.6, 1.2, 0.6]
              }}
              transition={{
                duration: 6, // Slower particle animation
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx={(position === 'left' ? 12 : 8) + Math.cos(animationTime * 1.1) * 1.5}
              cy={200 + Math.sin(animationTime * 1.3) * 10}
              r="0.8"
              fill={color.replace('0.8', '0.3')}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 8, // Even slower particle animation
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.circle
              cx={(position === 'left' ? 14 : 11) + Math.sin(animationTime * 0.8) * 1}
              cy={350 + Math.cos(animationTime * 1.1) * 8}
              r="0.6"
              fill={color.replace('0.8', '0.25')}
              animate={{
                opacity: [0.25, 0.5, 0.25],
                scale: [0.3, 0.9, 0.3]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default memo(CustomScrollbar);