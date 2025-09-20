'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

interface ConstellationLoaderProps {
  answers: string[];
  aiDescription: string;
  currentStep?: string;
  progress?: number;
}

interface TextSnippet {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  angle: number;
  isAI: boolean;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
  progress: number;
}

export default function ConstellationLoader({ answers, aiDescription, currentStep = 'Weaving your story...', progress = 0 }: ConstellationLoaderProps) {
  const [phase, setPhase] = useState<'gathering' | 'orbiting' | 'connecting' | 'converging' | 'complete'>('gathering');
  const [textSnippets, setTextSnippets] = useState<TextSnippet[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [centralOrb, setCentralOrb] = useState({ scale: 0, opacity: 0, intensity: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const centerPoint = { x: 50, y: 50 };

  // Extract meaningful snippets from answers and AI description
  useEffect(() => {
    const extractSnippets = () => {
      const snippets: string[] = [];
      
      // Extract from AI description
      const aiWords = aiDescription.split(' ').filter(word => word.length > 4);
      snippets.push(...aiWords.slice(0, 3));
      
      // Extract from answers
      answers.forEach((answer, index) => {
        if (answer.trim()) {
          const words = answer.split(' ').filter(word => word.length > 3);
          const keyPhrases = [];
          
          // Extract 2-3 key phrases per answer
          for (let i = 0; i < Math.min(3, words.length); i += 2) {
            if (words[i + 1]) {
              keyPhrases.push(`${words[i]} ${words[i + 1]}`);
            } else {
              keyPhrases.push(words[i]);
            }
          }
          
          snippets.push(...keyPhrases);
        }
      });

      // Create text snippet objects
      const initialSnippets: TextSnippet[] = snippets.map((text, index) => ({
        id: index,
        text: text.trim(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: 0,
        scale: 0.8 + Math.random() * 0.4,
        angle: Math.random() * Math.PI * 2,
        isAI: index < 3 // First 3 are from AI description
      }));

      setTextSnippets(initialSnippets);
    };

    extractSnippets();
  }, [answers, aiDescription]);

  // Phase progression
  useEffect(() => {
    const phaseTimers = [
      setTimeout(() => setPhase('orbiting'), 2000),
      setTimeout(() => setPhase('connecting'), 4000),
      setTimeout(() => setPhase('converging'), 6000),
      setTimeout(() => setPhase('complete'), 8000)
    ];

    return () => phaseTimers.forEach(clearTimeout);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setTextSnippets(prevSnippets => {
        return prevSnippets.map(snippet => {
          let newSnippet = { ...snippet };

          // Fade in during gathering phase
          if (phase === 'gathering') {
            newSnippet.opacity = Math.min(1, newSnippet.opacity + 0.02);
          }

          // Orbital movement during orbiting phase
          if (phase === 'orbiting') {
            const distance = 30 + Math.sin(Date.now() * 0.001 + snippet.id) * 10;
            newSnippet.angle += 0.01;
            newSnippet.x = centerPoint.x + Math.cos(newSnippet.angle) * distance;
            newSnippet.y = centerPoint.y + Math.sin(newSnippet.angle) * distance;
          }

          // Move towards center during converging phase
          if (phase === 'converging') {
            const dx = centerPoint.x - newSnippet.x;
            const dy = centerPoint.y - newSnippet.y;
            newSnippet.x += dx * 0.05;
            newSnippet.y += dy * 0.05;
            newSnippet.opacity = Math.max(0, newSnippet.opacity - 0.03);
            newSnippet.scale = Math.max(0.1, newSnippet.scale - 0.02);
          }

          return newSnippet;
        });
      });

      // Update connections
      if (phase === 'connecting' || phase === 'converging') {
        setConnections(prevConnections => {
          const newConnections = [...prevConnections];
          
          // Add new connections
          if (newConnections.length < textSnippets.length - 1) {
            const fromIndex = Math.floor(Math.random() * textSnippets.length);
            let toIndex = Math.floor(Math.random() * textSnippets.length);
            while (toIndex === fromIndex) {
              toIndex = Math.floor(Math.random() * textSnippets.length);
            }
            
            newConnections.push({
              from: fromIndex,
              to: toIndex,
              opacity: 0,
              progress: 0
            });
          }

          // Update existing connections
          return newConnections.map(conn => ({
            ...conn,
            opacity: Math.min(0.8, conn.opacity + 0.02),
            progress: Math.min(1, conn.progress + 0.03)
          }));
        });
      }

      // Update central orb
      if (phase === 'converging' || phase === 'complete') {
        setCentralOrb(prev => ({
          scale: Math.min(1, prev.scale + 0.03),
          opacity: Math.min(1, prev.opacity + 0.02),
          intensity: Math.min(1, prev.intensity + 0.01)
        }));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, textSnippets.length]);

  // Draw connections on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      connections.forEach(conn => {
        if (conn.from >= textSnippets.length || conn.to >= textSnippets.length) return;

        const fromSnippet = textSnippets[conn.from];
        const toSnippet = textSnippets[conn.to];

        const fromX = (fromSnippet.x / 100) * canvas.width;
        const fromY = (fromSnippet.y / 100) * canvas.height;
        const toX = (toSnippet.x / 100) * canvas.width;
        const toY = (toSnippet.y / 100) * canvas.height;

        // Calculate progress point
        const progressX = fromX + (toX - fromX) * conn.progress;
        const progressY = fromY + (toY - fromY) * conn.progress;

        const gradient = ctx.createLinearGradient(fromX, fromY, progressX, progressY);
        gradient.addColorStop(0, `rgba(0, 71, 171, ${conn.opacity})`);
        gradient.addColorStop(1, `rgba(0, 71, 171, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0047AB';

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(progressX, progressY);
        ctx.stroke();
        
        // Add sparkle effect at progress point
        if (conn.progress > 0.1) {
          ctx.fillStyle = `rgba(0, 71, 171, ${conn.opacity})`;
          ctx.beginPath();
          ctx.arc(progressX, progressY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [connections, textSnippets]);

  return (
    <div className="constellation-loader">
      {/* Background */}
      <div className="paper-background" />
      
      {/* Canvas for connections */}
      <canvas ref={canvasRef} className="connections-canvas" />
      
      {/* Text Snippets */}
      <div className="snippets-container">
        {textSnippets.map(snippet => (
          <div
            key={snippet.id}
            className={`text-snippet ${snippet.isAI ? 'ai-snippet' : 'user-snippet'}`}
            style={{
              left: `${snippet.x}%`,
              top: `${snippet.y}%`,
              opacity: snippet.opacity,
              transform: `translate(-50%, -50%) scale(${snippet.scale})`,
            }}
          >
            {snippet.text}
          </div>
        ))}
      </div>

      {/* Central Orb */}
      <div 
        className="central-orb"
        style={{
          opacity: centralOrb.opacity,
          transform: `translate(-50%, -50%) scale(${centralOrb.scale})`,
        }}
      >
        <div 
          className="orb-core"
          style={{
            boxShadow: `0 0 ${50 + centralOrb.intensity * 100}px rgba(0, 71, 171, ${0.6 + centralOrb.intensity * 0.4})`
          }}
        />
        <div className="orb-rings">
          <div className="orb-ring orb-ring-1" />
          <div className="orb-ring orb-ring-2" />
          <div className="orb-ring orb-ring-3" />
        </div>
      </div>

      {/* Phase indicator */}
      <div className="phase-indicator">
        <h2 className={playfair.className}>
          {phase === 'gathering' && 'Gathering your stories...'}
          {phase === 'orbiting' && 'Weaving narratives...'}
          {phase === 'connecting' && 'Connecting ideas...'}
          {phase === 'converging' && 'Creating magic...'}
          {phase === 'complete' && 'Story complete!'}
        </h2>
      </div>

      <style jsx>{`
        .constellation-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #F8F5F2;
          z-index: 9999;
          overflow: hidden;
        }

        .paper-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(224, 122, 95, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 71, 171, 0.02) 0%, transparent 50%);
          background-size: 300px 300px, 200px 200px;
          animation: paperBreathe 8s ease-in-out infinite;
        }

        .connections-canvas {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 2;
        }

        .snippets-container {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 3;
        }

        .text-snippet {
          position: absolute;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          animation: snippetFloat 3s ease-in-out infinite;
        }

        .ai-snippet {
          background: rgba(0, 71, 171, 0.15);
          color: #0047AB;
          border: 1px solid rgba(0, 71, 171, 0.3);
        }

        .user-snippet {
          background: rgba(224, 122, 95, 0.15);
          color: #E07A5F;
          border: 1px solid rgba(224, 122, 95, 0.3);
        }

        @keyframes snippetFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }

        .central-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          z-index: 4;
        }

        .orb-core {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, #4A90E2, #0047AB);
          border-radius: 50%;
          animation: orbPulse 2s ease-in-out infinite;
        }

        .orb-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .orb-ring {
          position: absolute;
          border: 2px solid rgba(0, 71, 171, 0.3);
          border-radius: 50%;
          animation: ringExpand 3s ease-in-out infinite;
        }

        .orb-ring-1 {
          width: 120px;
          height: 120px;
          top: -60px;
          left: -60px;
          animation-delay: 0s;
        }

        .orb-ring-2 {
          width: 160px;
          height: 160px;
          top: -80px;
          left: -80px;
          animation-delay: 1s;
        }

        .orb-ring-3 {
          width: 200px;
          height: 200px;
          top: -100px;
          left: -100px;
          animation-delay: 2s;
        }

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes ringExpand {
          0% { 
            transform: scale(0); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 0; 
          }
        }

        .phase-indicator {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          text-align: center;
        }

        .phase-indicator h2 {
          font-size: 1.5rem;
          color: #2C2C2C;
          margin: 0;
          animation: phaseGlow 2s ease-in-out infinite alternate;
        }

        @keyframes phaseGlow {
          0% { opacity: 0.7; }
          100% { opacity: 1; text-shadow: 0 0 20px rgba(0, 71, 171, 0.3); }
        }

        @keyframes paperBreathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.001) rotate(0.05deg); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .text-snippet {
            font-size: 12px;
            padding: 6px 10px;
          }
          
          .central-orb {
            width: 80px;
            height: 80px;
          }
          
          .phase-indicator h2 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}