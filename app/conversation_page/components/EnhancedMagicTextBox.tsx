'use client';

import React, { useState, useRef, useEffect } from 'react';

interface EnhancedMagicTextBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  delay?: number;
  maxLength?: number;
  required?: boolean;
  label?: string;
}

interface InkBlot {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeSpeed: number;
}

export default function EnhancedMagicTextBox({
  value,
  onChange,
  placeholder,
  delay = 0,
  maxLength = 500,
  required = false,
  label
}: EnhancedMagicTextBoxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inkBlots, setInkBlots] = useState<InkBlot[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [isValid, setIsValid] = useState(true);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inkCanvas = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Show component after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Update character count and validation
  useEffect(() => {
    setCharCount(value.length);
    if (required) {
      setIsValid(value.trim().length > 0);
    } else {
      setIsValid(value.length <= maxLength);
    }
  }, [value, required, maxLength]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }
  }, [value]);

  const createInkBlot = (x: number, y: number) => {
    const newBlot: InkBlot = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      size: Math.random() * 6 + 2,
      opacity: 0.4 + Math.random() * 0.3,
      fadeSpeed: 0.008 + Math.random() * 0.006
    };

    setInkBlots(prev => [...prev.slice(-12), newBlot]); // Keep more blots for richer effect
  };

  const animateInkBlots = () => {
    const canvas = inkCanvas.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw ink blots
        setInkBlots(prevBlots => {
          return prevBlots.filter(blot => {
            blot.opacity -= blot.fadeSpeed;
            
            if (blot.opacity > 0) {
              // Enhanced ink blot drawing with multiple layers
              ctx.save();
              
              // Outer diffusion ring
              ctx.globalAlpha = blot.opacity * 0.3;
              const outerGradient = ctx.createRadialGradient(
                blot.x, blot.y, 0,
                blot.x, blot.y, blot.size * 2.5
              );
              outerGradient.addColorStop(0, '#0047AB');
              outerGradient.addColorStop(0.4, 'rgba(0, 71, 171, 0.3)');
              outerGradient.addColorStop(1, 'transparent');
              
              ctx.fillStyle = outerGradient;
              ctx.beginPath();
              ctx.arc(blot.x, blot.y, blot.size * 2.5, 0, Math.PI * 2);
              ctx.fill();
              
              // Main ink blot with organic shape
              ctx.globalAlpha = blot.opacity * 0.6;
              const mainGradient = ctx.createRadialGradient(
                blot.x, blot.y, 0,
                blot.x, blot.y, blot.size
              );
              mainGradient.addColorStop(0, '#0047AB');
              mainGradient.addColorStop(0.6, 'rgba(0, 71, 171, 0.8)');
              mainGradient.addColorStop(1, 'rgba(0, 71, 171, 0.2)');
              
              ctx.fillStyle = mainGradient;
              ctx.beginPath();
              // Create organic blob shape
              const points = 8;
              const angleStep = (Math.PI * 2) / points;
              ctx.moveTo(
                blot.x + Math.cos(0) * (blot.size * (0.8 + Math.sin(Date.now() * 0.001) * 0.2)),
                blot.y + Math.sin(0) * (blot.size * (0.8 + Math.cos(Date.now() * 0.001) * 0.2))
              );
              
              for (let i = 1; i <= points; i++) {
                const angle = i * angleStep;
                const radius = blot.size * (0.8 + Math.sin(angle * 3 + Date.now() * 0.002) * 0.3);
                ctx.lineTo(
                  blot.x + Math.cos(angle) * radius,
                  blot.y + Math.sin(angle) * radius
                );
              }
              ctx.closePath();
              ctx.fill();
              
              // Core dot
              ctx.globalAlpha = blot.opacity * 0.9;
              ctx.fillStyle = '#0047AB';
              ctx.beginPath();
              ctx.arc(blot.x, blot.y, blot.size * 0.3, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.restore();
              
              return true;
            }
            return false;
          });
        });    animationFrameRef.current = requestAnimationFrame(animateInkBlots);
  };

  useEffect(() => {
    if (isFocused) {
      animateInkBlots();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 && value.length < maxLength) {
      // Create multiple ink blots for more dramatic effect
      const rect = textareaRef.current?.getBoundingClientRect();
      if (rect) {
        const numBlots = Math.random() > 0.7 ? 2 : 1; // Sometimes create double blots
        for (let i = 0; i < numBlots; i++) {
          setTimeout(() => {
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            createInkBlot(x, y);
          }, i * 50);
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Auto-focus enhancement: slight shake animation
    if (containerRef.current) {
      containerRef.current.style.animation = 'magicFocus 0.3s ease-out';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.animation = '';
        }
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`enhanced-magic-textbox ${isFocused ? 'focused' : ''} ${!isValid ? 'invalid' : ''}`}
      role="group"
      aria-labelledby={label ? 'textbox-label' : undefined}
    >
      {label && (
        <label id="textbox-label" className="textbox-label">
          {label}
          {required && <span className="required-indicator" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="textbox-container">
        {/* Corner Brackets */}
        <div className="corner-bracket top-left" />
        <div className="corner-bracket top-right" />
        <div className="corner-bracket bottom-left" />
        <div className="corner-bracket bottom-right" />
        
        {/* Ink Canvas */}
        <canvas 
          ref={inkCanvas}
          className="ink-canvas"
          width="400"
          height="200"
        />
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="magic-textarea"
          rows={4}
          maxLength={maxLength}
          required={required}
          aria-invalid={!isValid}
          aria-describedby="char-counter"
        />
        
        {/* Character Counter */}
        <div id="char-counter" className="char-counter">
          <span className={charCount > maxLength * 0.8 ? 'warning' : ''}>
            {charCount}/{maxLength}
          </span>
          {required && value.trim().length === 0 && (
            <span className="validation-hint">This field is required</span>
          )}
        </div>
        
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div 
            className="progress-bar"
            style={{ width: `${(charCount / maxLength) * 100}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .enhanced-magic-textbox {
          position: relative;
          margin: 20px 0;
          opacity: 0;
          transform: translateY(20px);
          animation: materialAppear 0.8s ease-out forwards;
        }

        @keyframes materialAppear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes magicFocus {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .textbox-label {
          display: block;
          font-size: 1.1rem;
          color: #2C2C2C;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .required-indicator {
          color: #E07A5F;
          margin-left: 4px;
        }

        .textbox-container {
          position: relative;
          background: rgba(248, 245, 242, 0.3);
          backdrop-filter: blur(5px);
          border-radius: 8px;
          padding: 25px;
          transition: all 0.4s ease;
          border: none;
        }

        .enhanced-magic-textbox.focused .textbox-container {
          background: rgba(248, 245, 242, 0.6);
          box-shadow: 0 8px 32px rgba(0, 71, 171, 0.08);
          transform: translateY(-1px);
        }

        .enhanced-magic-textbox.invalid .textbox-container {
          box-shadow: 0 4px 16px rgba(224, 122, 95, 0.1);
        }

        .corner-bracket {
          position: absolute;
          width: 25px;
          height: 25px;
          border: 3px solid #E07A5F;
          opacity: 0.6;
          transition: all 0.4s ease;
          filter: drop-shadow(0 0 3px rgba(224, 122, 95, 0.3));
        }

        .enhanced-magic-textbox.focused .corner-bracket {
          border-color: #0047AB;
          opacity: 0.8;
          animation: manuscriptBracketGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(0, 71, 171, 0.4));
          transform: scale(1.1);
        }

        .top-left {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
          border-radius: 4px 0 0 0;
        }

        .top-right {
          top: 8px;
          right: 8px;
          border-left: none;
          border-bottom: none;
          border-radius: 0 4px 0 0;
        }

        .bottom-left {
          bottom: 8px;
          left: 8px;
          border-right: none;
          border-top: none;
          border-radius: 0 0 0 4px;
        }

        .bottom-right {
          bottom: 8px;
          right: 8px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 4px 0;
        }

        @keyframes manuscriptBracketGlow {
          0%, 100% { 
            opacity: 0.8;
            filter: drop-shadow(0 0 8px rgba(0, 71, 171, 0.4));
            transform: scale(1.1);
          }
          50% { 
            opacity: 1;
            filter: drop-shadow(0 0 15px rgba(0, 71, 171, 0.6));
            transform: scale(1.15);
          }
        }

        .ink-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: 12px;
        }

        .magic-textarea {
          width: 100%;
          min-height: 120px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          line-height: 1.6;
          color: #2C2C2C;
          resize: none;
          font-family: inherit;
          position: relative;
          z-index: 2;
        }

        .magic-textarea::placeholder {
          color: rgba(44, 44, 44, 0.5);
          font-style: italic;
        }

        .char-counter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 0.85rem;
          color: rgba(44, 44, 44, 0.7);
        }

        .char-counter .warning {
          color: #E07A5F;
          font-weight: 500;
        }

        .validation-hint {
          color: #E07A5F;
          font-size: 0.8rem;
        }

        .progress-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(0, 71, 171, 0.1);
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #0047AB, #E07A5F);
          transition: width 0.3s ease;
          position: relative;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .textbox-container {
            padding: 15px;
          }
          
          .magic-textarea {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .textbox-container {
            border: 2px solid;
          }
          
          .corner-bracket {
            border-width: 3px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .enhanced-magic-textbox,
          .corner-bracket,
          .textbox-container,
          .progress-bar::after {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}