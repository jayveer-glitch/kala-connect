'use client';

import React from 'react';

interface AnimatedPatternProps {
  className?: string;
  opacity?: number;
  speed?: number;
}

const AnimatedPattern: React.FC<AnimatedPatternProps> = ({ 
  className = "",
  opacity = 0.9,
  speed = 20
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Static pattern layer - Isometric cubes */}
      <div 
        className="absolute w-full h-full"
        style={{
          backgroundColor: '#ffffff',
          opacity: opacity,
          backgroundImage: `
            linear-gradient(30deg, #5d5850 12%, transparent 12.5%, transparent 87%, #5d5850 87.5%, #5d5850), 
            linear-gradient(150deg, #5d5850 12%, transparent 12.5%, transparent 87%, #5d5850 87.5%, #5d5850), 
            linear-gradient(30deg, #5d5850 12%, transparent 12.5%, transparent 87%, #5d5850 87.5%, #5d5850), 
            linear-gradient(150deg, #5d5850 12%, transparent 12.5%, transparent 87%, #5d5850 87.5%, #5d5850), 
            linear-gradient(60deg, #5d585077 25%, transparent 25.5%, transparent 75%, #5d585077 75%, #5d585077), 
            linear-gradient(60deg, #5d585077 25%, transparent 25.5%, transparent 75%, #5d585077 75%, #5d585077)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
        }}
      />
    </div>
  );
};

export default AnimatedPattern;
