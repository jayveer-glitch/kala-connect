'use client';

import React, { useState, useEffect } from 'react';

interface ScrollbarBackgroundProps {
  position?: 'left' | 'right';
}

const ScrollbarBackground: React.FC<ScrollbarBackgroundProps> = ({ 
  position = 'right'
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  // Header height is typically 4rem (64px)
  const headerHeight = 64;
  const isHeaderScrolledOut = scrollY > headerHeight;
  
  const positionStyle = position === 'left' 
    ? { left: '0.75rem' } // equivalent to left-3
    : { right: '3.75rem' }; // equivalent to right-15 (15 * 0.25rem)

  return (
    <div 
      className={`fixed z-40 pointer-events-none transition-all duration-300 ease-out`} 
      style={{ 
        top: isHeaderScrolledOut ? '0px' : '4rem',
        height: isHeaderScrolledOut ? '100vh' : 'calc(100vh - 4rem)',
        ...positionStyle 
      }}
    >
      {/* Simple rectangular background to keep scrollbar centered */}
      <div
        className="absolute top-0 left-0 w-8 h-full"
        style={{
          background: 'rgba(255, 255, 255, 1)',
          transform: 'translateX(11px)' // Center it with the scrollbar
        }}
      />
    </div>
  );
};

export default ScrollbarBackground;