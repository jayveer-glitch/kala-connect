'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MagicTextBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

interface InkBlot {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
}

export default function MagicTextBox({ value, onChange, placeholder = "Share your thoughts...", delay = 0 }: MagicTextBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inkBlots, setInkBlots] = useState<InkBlot[]>([]);
  const [lastTypedPosition, setLastTypedPosition] = useState({ x: 0, y: 0 });
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inkBlotsIdRef = useRef(0);

  // Show the component after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle typing with ink bleed effect
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const textarea = textAreaRef.current;
    
    if (textarea && newValue.length > value.length) {
      // Character was added - create ink bleed effect
      const rect = textarea.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        // Calculate approximate cursor position
        const fontSize = 16;
        const lineHeight = 24;
        const charWidth = 8;
        
        const lines = newValue.split('\n');
        const currentLine = lines.length - 1;
        const currentChar = lines[currentLine].length - 1;
        
        const x = Math.min(currentChar * charWidth + 20, containerRect.width - 40);
        const y = currentLine * lineHeight + 40;
        
        // Create ink blot at typing position
        const newInkBlot: InkBlot = {
          x,
          y,
          size: Math.random() * 8 + 4,
          opacity: 0.8,
          id: inkBlotsIdRef.current++
        };
        
        setInkBlots(prev => [...prev, newInkBlot]);
        setLastTypedPosition({ x, y });
      }
    }
    
    onChange(newValue);
  };

  // Fade out ink blots
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setInkBlots(prev => 
        prev
          .map(blot => ({ ...blot, opacity: blot.opacity - 0.03, size: blot.size * 1.01 }))
          .filter(blot => blot.opacity > 0)
      );
    }, 50);

    return () => clearInterval(fadeInterval);
  }, []);

  if (!isVisible) {
    return <div className="magic-textbox-placeholder" style={{ height: '120px', opacity: 0 }} />;
  }

  return (
    <div 
      ref={containerRef}
      className={`magic-textbox-container ${isFocused ? 'focused' : ''}`}
    >
      {/* Corner Brackets */}
      <div className="corner-bracket top-left" />
      <div className="corner-bracket top-right" />
      <div className="corner-bracket bottom-left" />
      <div className="corner-bracket bottom-right" />
      
      {/* Ink Blots */}
      <div className="ink-blots-container">
        {inkBlots.map(blot => (
          <div
            key={blot.id}
            className="ink-blot"
            style={{
              left: `${blot.x}px`,
              top: `${blot.y}px`,
              width: `${blot.size}px`,
              height: `${blot.size}px`,
              opacity: blot.opacity,
            }}
          />
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="magic-textarea"
        rows={4}
      />

      {/* Focus Glow Effect */}
      {isFocused && <div className="focus-glow" />}

      <style jsx>{`
        .magic-textbox-container {
          position: relative;
          margin: 20px 0;
          padding: 20px;
          animation: textboxReveal 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes textboxReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .corner-bracket {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #E07A5F;
          transition: all 0.3s ease;
        }

        .top-left {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .top-right {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        .bottom-left {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        .bottom-right {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }

        .focused .corner-bracket {
          border-color: #0047AB;
          box-shadow: 0 0 10px rgba(0, 71, 171, 0.5);
          transform: scale(1.1);
        }

        .ink-blots-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .ink-blot {
          position: absolute;
          background: radial-gradient(circle, #2C2C2C 0%, rgba(44, 44, 44, 0.3) 70%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          animation: inkBleed 0.5s ease-out;
        }

        @keyframes inkBleed {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        .magic-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: inherit;
          font-size: 16px;
          line-height: 1.5;
          color: #2C2C2C;
          padding: 10px;
          position: relative;
          z-index: 2;
          min-height: 80px;
        }

        .magic-textarea::placeholder {
          color: rgba(44, 44, 44, 0.4);
          font-style: italic;
        }

        .focus-glow {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: radial-gradient(circle, rgba(0, 71, 171, 0.05) 0%, transparent 70%);
          border-radius: 8px;
          animation: focusGlow 2s ease-in-out infinite alternate;
          z-index: 0;
        }

        @keyframes focusGlow {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1.02); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .magic-textbox-container {
            padding: 15px;
          }
          
          .corner-bracket {
            width: 15px;
            height: 15px;
          }
          
          .magic-textarea {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}