'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Masonry from 'react-masonry-css';
import { 
  HiQrcode, 
  HiCurrencyDollar, 
  HiTranslate, 
  HiPhotograph,
  HiX 
} from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';
import CustomScrollbar from '../components/CustomScrollbar';
import ScrollbarBackground from '../components/ScrollbarBackground';
import ArtisticCursor from '../components/ArtisticCursor';
import { apiConfig } from '../utils/apiConfig';

// Mock data for demonstration
const galleryContent = {
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
  instagram: {
    caption: "Witness the ancient art of hand-block printing, where every motif tells a story passed down through generations. The intricate patterns dance across handwoven cotton, each print a testament to the artisan's skilled hands and creative spirit. 🎨✨ #HandBlockPrinting #TraditionalCrafts #ArtisanMade #IndianTextiles #CulturalHeritage",
    hashtags: ["#HandBlockPrinting", "#TraditionalCrafts", "#ArtisanMade", "#IndianTextiles", "#CulturalHeritage"],
    likes: 2847
  },
  productDescription: {
    title: "Handcrafted Block-Printed Cotton Textile",
    description: "This exquisite piece showcases the timeless art of hand-block printing, a traditional Indian craft that has been perfected over centuries. Each motif is carefully carved into wooden blocks and hand-pressed with natural dyes onto pure cotton fabric. The intricate geometric patterns and vibrant colors tell the story of skilled artisans who have preserved this ancient technique through generations.",
    features: ["Pure Cotton", "Natural Dyes", "Hand-Block", "Artisan Made", "Traditional"]
  },
  videoScript: {
    title: "The Art of Hand-Block Printing",
    style: "Calm and Inspirational",
    bgMusic: "Gentle Instrumental Folk",
    scenes: [
      {
        time: "0-5s",
        scene: "FADE IN:",
        visuals: {
          shot: "Extreme Close-Up (ECU)",
          action: "Slow pan across weathered hands aligning wooden block",
          broll: "Quick cut to carved wooden printing blocks"
        },
        audio: {
          voiceover: "Discover the ancient art that speaks through patterns...",
          sfx: "Gentle wind ambiance"
        }
      },
      {
        time: "5-12s",
        scene: "CUT TO:",
        visuals: {
          shot: "Medium Close-Up",
          action: "Block pressing down with precise pressure",
          broll: "Indigo dye spreading across cream cotton"
        },
        audio: {
          voiceover: "Each impression carries centuries of tradition...",
          sfx: "Soft pressing sound"
        }
      },
      {
        time: "12-18s",
        scene: "WIDE SHOT:",
        visuals: {
          shot: "Establishing Shot",
          action: "Rows of printed fabric dancing in golden sunlight",
          broll: "Artisan workshop bustling with activity"
        },
        audio: {
          voiceover: "Where stories unfold in every thread...",
          sfx: "Gentle fabric rustling"
        }
      },
      {
        time: "18-25s",
        scene: "NARRATOR (V.O.):",
        visuals: {
          shot: "Montage",
          action: "Time-lapse of complete printing process",
          broll: "Close-ups of intricate pattern details"
        },
        audio: {
          voiceover: "Every pattern tells a story. Every block carries the wisdom of generations.",
          sfx: "Inspirational music crescendo"
        }
      }
    ]
  },
  marketplace: {
    recommendations: [
      { name: "Etsy", logo: "🛍️", confidence: 95, reason: "Perfect for handmade, traditional crafts with strong artisan story", url: "https://www.etsy.com/sell" },
      { name: "Novica", logo: "🌍", confidence: 88, reason: "Specializes in authentic cultural artwork from around the world", url: "https://www.novica.com/cust/sell/" },
      { name: "Amazon Handmade", logo: "📦", confidence: 75, reason: "Large audience for unique, handcrafted items", url: "https://services.amazon.com/handmade/handmade.html" }
    ]
  }
};

interface FloatingToolsProps {
  onToolClick: (tool: string) => void;
}

const FloatingTools: React.FC<FloatingToolsProps> = ({ onToolClick }) => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const router = useRouter();
  
  const tools = [
    { id: 'qr', icon: HiQrcode, label: 'QR Code', color: '#0047AB' },
    { id: 'translate', icon: HiTranslate, label: 'Translator', color: '#2C2C2C' },
    { id: 'mockup', icon: HiPhotograph, label: 'Ad Mockup', color: '#0047AB' }
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'mockup') {
      // Pass the gallery image to the mockup page
      const imageUrl = encodeURIComponent('https://picsum.photos/400/600?random=gallery');
      router.push(`/mockup?image=${imageUrl}`);
    } else {
      onToolClick(toolId);
    }
  };

  return (
    <motion.div
      className="fixed right-16 top-1/2 transform -translate-y-1/2 z-40"
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: 1, 
        x: 0
      }}
      transition={{ 
        duration: 0.8, 
        delay: 1
      }}
    >
      <div 
        className="rounded-full p-4 shadow-2xl border border-gray-200/20 relative"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <div className="space-y-4 relative">
          {tools.map((tool, index) => (
            <motion.div key={tool.id} className="relative">
              <motion.button
                className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:shadow-xl transition-all duration-75 border-2 border-transparent relative"
                style={{ 
                  backgroundColor: `rgba(248, 248, 248, 0.8)`,
                  borderColor: `${tool.color}20`
                }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 15,
                  backgroundColor: `${tool.color}15`,
                  borderColor: tool.color,
                  boxShadow: `0 10px 25px ${tool.color}30`,
                  transition: { duration: 0.05 }
                }}
                whileTap={{ scale: 0.95, transition: { duration: 0.05 } }}
                onClick={() => handleToolClick(tool.id)}
                onHoverStart={() => setHoveredTool(tool.id)}
                onHoverEnd={() => setHoveredTool(null)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{ 
                  delay: 1.2 + index * 0.1
                }}
              >
                <tool.icon style={{ color: tool.color }} className="w-6 h-6" />
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredTool === tool.id && (
                  <motion.div
                    className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    initial={{ opacity: 0, x: 10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-800 shadow-lg relative"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {tool.label}
                      {/* Arrow */}
                      <div 
                        className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-4 border-t-2 border-b-2 border-transparent"
                        style={{ borderLeftColor: 'rgba(255, 255, 255, 0.95)' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const InstagramCard: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Post');

  const handleCopy = () => {
    if (typeof window === 'undefined') return;
    const finalStory = sessionStorage.getItem('finalStory');
    let caption = galleryContent.instagram.caption;
    
    if (finalStory) {
      try {
        const parsedStory = JSON.parse(finalStory);
        caption = parsedStory.final_content?.instagram_post || caption;
      } catch (error) {
        console.error('Error parsing story data:', error);
      }
    }
    
    navigator.clipboard.writeText(caption);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Post'), 2000);
  };

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer group w-full max-w-lg min-h-[500px]"
      data-dark-card="true"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(44, 44, 44, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}
      onHoverStart={() => setIsRevealed(true)}
      initial={{ opacity: 0.6, filter: 'blur(8px)' }}
      animate={isRevealed ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        y: -3
      }}
    >
      {/* Silk cloth reveal effect */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/90 via-gray-50/70 to-white/90 backdrop-blur-sm z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 space-y-6 flex flex-col justify-between h-full">
        {/* Instagram header */}
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-cobalt to-terracotta rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <div>
            <p className="font-playfair font-semibold text-white text-lg">kala_connect</p>
            <p className="font-inter text-xs text-gray-300">Traditional Crafts • 2h</p>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative rounded-full overflow-hidden mx-auto w-48 h-48"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img
            src={typeof window !== 'undefined' ? (sessionStorage.getItem('uploadedImage') || galleryContent.image) : galleryContent.image}
            alt="Craft artwork"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-75" />
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="font-inter text-gray-300 text-sm leading-relaxed">
            <span className="font-semibold">kala_connect</span> {
              (() => {
                if (typeof window === 'undefined') return galleryContent.instagram.caption;
                const finalStory = sessionStorage.getItem('finalStory');
                if (finalStory) {
                  try {
                    const parsedStory = JSON.parse(finalStory);
                    return parsedStory.final_content?.instagram_post || galleryContent.instagram.caption;
                  } catch (error) {
                    console.error('Error parsing story data:', error);
                  }
                }
                return galleryContent.instagram.caption;
              })()
            }
          </p>
        </motion.div>

        {/* Copy button - small icon only */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1, transition: { duration: 0.05 } }}
          whileTap={{ scale: 0.9, transition: { duration: 0.05 } }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ delay: 0.6 }}
          className={`absolute bottom-4 right-4 p-2 rounded-full shadow-lg transition-all duration-75 z-10 ${
            copyStatus === 'Copied!' ? 'bg-green-500 text-white' : 
            'bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-700'
          }`}
        >
          {copyStatus === 'Copied!' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProductDescriptionCard: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Description');

  const handleCopy = () => {
    if (typeof window === 'undefined') return;
    const finalStory = sessionStorage.getItem('finalStory');
    let description = galleryContent.productDescription.description;
    
    if (finalStory) {
      try {
        const parsedStory = JSON.parse(finalStory);
        description = parsedStory.final_content?.product_description || description;
      } catch (error) {
        console.error('Error parsing story data:', error);
      }
    }
    
    navigator.clipboard.writeText(description);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Description'), 2000);
  };

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer w-full max-w-lg"
      data-dark-card="true"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(44, 44, 44, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}
      onHoverStart={() => setIsRevealed(true)}
      initial={{ opacity: 0.6, filter: 'blur(8px)' }}
      animate={isRevealed ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        y: -3
      }}
    >
      {/* Reveal effect */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/90 via-gray-50/70 to-white/90 backdrop-blur-sm z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 border-0 border-terracotta rounded-lg opacity-0"
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      />

      <div className="p-4 space-y-3">
        <motion.h2
          className="font-playfair text-xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          {(() => {
            if (typeof window === 'undefined') return galleryContent.productDescription.title;
            const finalStory = sessionStorage.getItem('finalStory');
            if (finalStory) {
              try {
                const parsedStory = JSON.parse(finalStory);
                const artForm = parsedStory.final_content?.art_classification?.art_form_name;
                return artForm || galleryContent.productDescription.title;
              } catch (error) {
                console.error('Error parsing story data:', error);
              }
            }
            return galleryContent.productDescription.title;
          })()}
        </motion.h2>

        <motion.p
          className="font-inter text-gray-300 leading-relaxed text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          {
            (() => {
              if (typeof window === 'undefined') return galleryContent.productDescription.description;
              const finalStory = sessionStorage.getItem('finalStory');
              if (finalStory) {
                try {
                  const parsedStory = JSON.parse(finalStory);
                  return parsedStory.final_content?.product_description || galleryContent.productDescription.description;
                } catch (error) {
                  console.error('Error parsing story data:', error);
                }
              }
              return galleryContent.productDescription.description;
            })()
          }
        </motion.p>

        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          {(() => {
            if (typeof window === 'undefined') return galleryContent.productDescription.features;
            
            const finalStory = sessionStorage.getItem('finalStory');
            if (finalStory) {
              try {
                const parsedStory = JSON.parse(finalStory);
                const features = parsedStory.final_content?.product_features;
                if (features && Array.isArray(features) && features.length > 0) {
                  return features;
                }
              } catch (error) {
                console.error('Error parsing story data:', error);
              }
            }
            return galleryContent.productDescription.features;
          })().map((feature: string, index: number) => (
            <motion.div
              key={feature}
              className="flex items-center space-x-2 p-2 bg-gray-700/30 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={isRevealed ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <span className="text-blue-400 text-sm">✓</span>
              <span className="font-inter text-gray-300 text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Copy button - small icon only */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1, transition: { duration: 0.05 } }}
          whileTap={{ scale: 0.9, transition: { duration: 0.05 } }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ delay: 0.6 }}
          className={`absolute bottom-4 right-4 p-2 rounded-full shadow-lg transition-all duration-75 z-10 ${
            copyStatus === 'Copied!' ? 'bg-green-500 text-white' : 
            'bg-gray-800/80 backdrop-blur-sm text-white hover:bg-gray-700'
          }`}
        >
          {copyStatus === 'Copied!' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const VideoScriptCard: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Full Script');
  const [currentScene, setCurrentScene] = useState(0);

  const handleCopy = () => {
    if (typeof window === 'undefined') return;
    const finalStory = sessionStorage.getItem('finalStory');
    let scriptText = galleryContent.videoScript.scenes.map(scene => `${scene.scene}: ${scene.visuals.action}\nAudio: ${scene.audio.voiceover}`).join('\n\n');
    
    if (finalStory) {
      try {
        const parsedStory = JSON.parse(finalStory);
        const videoScript = parsedStory.final_content?.video_script;
        if (videoScript) {
          if (typeof videoScript === 'string') {
            scriptText = videoScript;
          } else if (videoScript.timeline && Array.isArray(videoScript.timeline)) {
            // Handle backend timeline structure
            scriptText = videoScript.timeline.map((scene: any) => 
              `${scene.time}: ${scene.visuals.action}\nAudio: ${scene.audio.voiceover}`
            ).join('\n\n');
          } else if (videoScript.scenes) {
            // Fallback to old scenes structure
            scriptText = videoScript.scenes.map((scene: any) => `${scene.scene}: ${scene.visuals.action}\nAudio: ${scene.audio.voiceover}`).join('\n\n');
          }
        }
      } catch (error) {
        console.error('Error parsing story data:', error);
      }
    }
    
    navigator.clipboard.writeText(scriptText);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Full Script'), 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance scenes for demo effect
  useEffect(() => {
    const getSceneCount = () => {
      if (typeof window === 'undefined') return galleryContent.videoScript.scenes.length;
      
      const finalStory = sessionStorage.getItem('finalStory');
      if (finalStory) {
        try {
          const parsedStory = JSON.parse(finalStory);
          const videoScript = parsedStory.final_content?.video_script;
          if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
            return videoScript.timeline.length;
          }
        } catch (error) {
          console.error('Error parsing story data:', error);
        }
      }
      return galleryContent.videoScript.scenes.length;
    };

    const interval = setInterval(() => {
      setCurrentScene(prev => (prev + 1) % getSceneCount());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer w-full col-span-full"
      data-dark-card="true"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(44, 44, 44, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        height: '700px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        boxShadow: "0 0 40px rgba(0, 71, 171, 0.3), 0 8px 32px rgba(0,0,0,0.4)",
        scale: 1.01,
        transition: { duration: 0.05 }
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cobalt to-terracotta rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎬</span>
          </div>
          <div>
            <h3 className="font-playfair text-2xl font-bold text-white leading-tight mb-2">
              {(() => {
                if (typeof window === 'undefined') return galleryContent.videoScript.title;
                const finalStory = sessionStorage.getItem('finalStory');
                if (finalStory) {
                  try {
                    const parsedStory = JSON.parse(finalStory);
                    const videoScript = parsedStory.final_content?.video_script;
                    return (videoScript?.title || galleryContent.videoScript.title);
                  } catch (error) {
                    console.error('Error parsing story data:', error);
                  }
                }
                return galleryContent.videoScript.title;
              })()}
            </h3>
            <div className="flex space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
                <span className="mr-2">✨</span>
                {(() => {
                  if (typeof window === 'undefined') return galleryContent.videoScript.style;
                  const finalStory = sessionStorage.getItem('finalStory');
                  if (finalStory) {
                    try {
                      const parsedStory = JSON.parse(finalStory);
                      const videoScript = parsedStory.final_content?.video_script;
                      return (videoScript?.style || galleryContent.videoScript.style);
                    } catch (error) {
                      console.error('Error parsing story data:', error);
                    }
                  }
                  return galleryContent.videoScript.style;
                })()}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                <span className="mr-2">🎵</span>
                {(() => {
                  if (typeof window === 'undefined') return galleryContent.videoScript.bgMusic;
                  const finalStory = sessionStorage.getItem('finalStory');
                  if (finalStory) {
                    try {
                      const parsedStory = JSON.parse(finalStory);
                      const videoScript = parsedStory.final_content?.video_script;
                      return (videoScript?.bg_music_suggestion || galleryContent.videoScript.bgMusic);
                    } catch (error) {
                      console.error('Error parsing story data:', error);
                    }
                  }
                  return galleryContent.videoScript.bgMusic;
                })()}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.05 } }}
          className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-75 ${
            copyStatus === 'Copied!' 
              ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
              : 'bg-cobalt/20 text-blue-300 border border-cobalt/40 hover:bg-cobalt/30'
          }`}
        >
          {copyStatus}
        </motion.button>
      </div>

      {/* Horizontal Content Area */}
      <div className="flex" style={{ height: 'calc(700px - 120px)' }}>
        {/* Film Strip Timeline - Left Side */}
        <div className="w-1/4 p-6 border-r border-white/10 overflow-y-auto">
          <div className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-medium">Timeline</div>
          <div className="space-y-3">
            {(() => {
              if (typeof window === 'undefined') return galleryContent.videoScript.scenes;
              
              const finalStory = sessionStorage.getItem('finalStory');
              if (finalStory) {
                try {
                  const parsedStory = JSON.parse(finalStory);
                  const videoScript = parsedStory.final_content?.video_script;
                  if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                    return videoScript.timeline;
                  }
                } catch (error) {
                  console.error('Error parsing story data:', error);
                }
              }
              return galleryContent.videoScript.scenes;
            })().map((scene: any, index: number) => (
              <motion.div
                key={index}
                className={`relative p-4 rounded-xl cursor-pointer transition-all duration-75 ${
                  currentScene === index 
                    ? 'bg-cobalt/30 border border-cobalt shadow-lg' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                onClick={() => setCurrentScene(index)}
                whileHover={{ scale: 1.02, transition: { duration: 0.05 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.05 } }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{scene.scene || `Scene ${index + 1}`}</span>
                  <span className="text-xs text-gray-400 font-mono bg-gray-800/50 px-2 py-1 rounded">{scene.time}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cobalt to-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: currentScene === index ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {currentScene === index && (
                  <motion.div
                    className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-cobalt rounded-l-full"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Scene Content - Right Side */}
        <div className="flex-1 p-6 flex flex-col overflow-hidden">
          <motion.div
            key={currentScene}
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Scene Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <span className="inline-block px-4 py-2 rounded-xl text-lg font-bold bg-cobalt/20 text-blue-300 border border-cobalt/30">
                {(() => {
                  if (typeof window === 'undefined') return galleryContent.videoScript.scenes[currentScene].scene;
                  
                  const finalStory = sessionStorage.getItem('finalStory');
                  if (finalStory) {
                    try {
                      const parsedStory = JSON.parse(finalStory);
                      const videoScript = parsedStory.final_content?.video_script;
                      if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                        return videoScript.timeline[currentScene]?.time || `Scene ${currentScene + 1}`;
                      }
                    } catch (error) {
                      console.error('Error parsing story data:', error);
                    }
                  }
                  return galleryContent.videoScript.scenes[currentScene].scene;
                })()}
              </span>
              <span className="text-sm text-gray-400 font-mono bg-gray-800/50 px-3 py-2 rounded-lg">
                Scene {currentScene + 1} of {(() => {
                  if (typeof window === 'undefined') return galleryContent.videoScript.scenes.length;
                  
                  const finalStory = sessionStorage.getItem('finalStory');
                  if (finalStory) {
                    try {
                      const parsedStory = JSON.parse(finalStory);
                      const videoScript = parsedStory.final_content?.video_script;
                      if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                        return videoScript.timeline.length;
                      }
                    } catch (error) {
                      console.error('Error parsing story data:', error);
                    }
                  }
                  return galleryContent.videoScript.scenes.length;
                })()}
              </span>
            </div>

            {/* Horizontal Two-Column Layout */}
            <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
              {/* Visuals Column */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col">
                <div className="flex items-center text-yellow-300 font-medium mb-3 flex-shrink-0">
                  <span className="mr-3 text-lg">🎬</span>
                  <span className="text-base uppercase tracking-wider">VISUALS</span>
                </div>
                <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                  <div>
                    <span className="text-gray-400 text-xs font-medium">Shot Type:</span>
                    <div className="text-white font-semibold mt-1">
                      {(() => {
                        if (typeof window === 'undefined') return galleryContent.videoScript.scenes[currentScene].visuals.shot;
                        
                        const finalStory = sessionStorage.getItem('finalStory');
                        if (finalStory) {
                          try {
                            const parsedStory = JSON.parse(finalStory);
                            const videoScript = parsedStory.final_content?.video_script;
                            if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                              return videoScript.timeline[currentScene]?.visuals?.camera_shot || 'Camera Shot';
                            }
                          } catch (error) {
                            console.error('Error parsing story data:', error);
                          }
                        }
                        return galleryContent.videoScript.scenes[currentScene].visuals.shot;
                      })()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-medium">Action:</span>
                    <div className="text-white leading-relaxed mt-1">
                      {(() => {
                        if (typeof window === 'undefined') return galleryContent.videoScript.scenes[currentScene].visuals.action;
                        
                        const finalStory = sessionStorage.getItem('finalStory');
                        if (finalStory) {
                          try {
                            const parsedStory = JSON.parse(finalStory);
                            const videoScript = parsedStory.final_content?.video_script;
                            if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                              return videoScript.timeline[currentScene]?.visuals?.action || 'Scene action';
                            }
                          } catch (error) {
                            console.error('Error parsing story data:', error);
                          }
                        }
                        return galleryContent.videoScript.scenes[currentScene].visuals.action;
                      })()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-medium">B-Roll:</span>
                    <div className="text-white mt-1">
                      {(() => {
                        if (typeof window === 'undefined') return galleryContent.videoScript.scenes[currentScene].visuals.broll;
                        
                        const finalStory = sessionStorage.getItem('finalStory');
                        if (finalStory) {
                          try {
                            const parsedStory = JSON.parse(finalStory);
                            const videoScript = parsedStory.final_content?.video_script;
                            if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                              return videoScript.timeline[currentScene]?.visuals?.b_roll_suggestion || 'B-roll content';
                            }
                          } catch (error) {
                            console.error('Error parsing story data:', error);
                          }
                        }
                        return galleryContent.videoScript.scenes[currentScene].visuals.broll;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Column */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col">
                <div className="flex items-center text-purple-300 font-medium mb-3 flex-shrink-0">
                  <span className="mr-3 text-lg">🎤</span>
                  <span className="text-base uppercase tracking-wider">AUDIO</span>
                </div>
                <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                  <div>
                    <span className="text-gray-400 text-xs font-medium">Voiceover:</span>
                    <div className="text-white leading-relaxed italic mt-1">
                      "{(() => {
                        if (typeof window === 'undefined') return galleryContent.videoScript.scenes[currentScene].audio.voiceover;
                        
                        const finalStory = sessionStorage.getItem('finalStory');
                        if (finalStory) {
                          try {
                            const parsedStory = JSON.parse(finalStory);
                            const videoScript = parsedStory.final_content?.video_script;
                            if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                              return videoScript.timeline[currentScene]?.audio?.voiceover || 'Voiceover content';
                            }
                          } catch (error) {
                            console.error('Error parsing story data:', error);
                          }
                        }
                        return galleryContent.videoScript.scenes[currentScene].audio.voiceover;
                      })()}"
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-medium">Sound Effects:</span>
                    <div className="text-white mt-1">
                      {(() => {
                        if (typeof window === 'undefined') return galleryContent.videoScript.scenes[currentScene].audio.sfx;
                        
                        const finalStory = sessionStorage.getItem('finalStory');
                        if (finalStory) {
                          try {
                            const parsedStory = JSON.parse(finalStory);
                            const videoScript = parsedStory.final_content?.video_script;
                            if (videoScript && videoScript.timeline && Array.isArray(videoScript.timeline)) {
                              return videoScript.timeline[currentScene]?.audio?.sfx || 'Sound effects';
                            }
                          } catch (error) {
                            console.error('Error parsing story data:', error);
                          }
                        }
                        return galleryContent.videoScript.scenes[currentScene].audio.sfx;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator at Bottom */}
            <div className="mt-4 pt-3 border-t border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span className="font-medium">Director's Cut Progress</span>
                <span className="font-mono">{Math.round(((currentScene + 1) / galleryContent.videoScript.scenes.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-cobalt to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentScene + 1) / galleryContent.videoScript.scenes.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const MarketplaceCard: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredMarketplace, setHoveredMarketplace] = useState<string | null>(null);

  // Helper function to get marketplace URLs for legacy string format
  const getMarketplaceUrl = (name: string): string => {
    const urlMap: { [key: string]: string } = {
      'Etsy': 'https://www.etsy.com/sell',
      'Novica': 'https://www.novica.com/cust/sell/',
      'Amazon Handmade': 'https://services.amazon.com/handmade/handmade.html',
      'ArtFire': 'https://www.artfire.com/sell',
      'Aftcra': 'https://www.aftcra.com/sell',
      'Folksy': 'https://folksy.com/sell',
      'Bonanza': 'https://www.bonanza.com/sell'
    };
    return urlMap[name] || '#';
  };

  const handleMarketplaceClick = (url: string, name: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      data-dark-card="true"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(44, 44, 44, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}
      onHoverStart={() => setIsRevealed(true)}
      initial={{ opacity: 0.6, filter: 'blur(8px)' }}
      animate={isRevealed ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        y: -3
      }}
    >
      {/* Reveal effect */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-gray-700/70 to-gray-800/90 backdrop-blur-sm z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 space-y-6 min-h-[500px]">
        <motion.h3
          className="font-playfair text-2xl font-bold text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          Recommended Marketplaces
        </motion.h3>

        <div className="space-y-6 pb-20">
          {(() => {
            if (typeof window === 'undefined') return galleryContent.marketplace.recommendations;
            const finalStory = sessionStorage.getItem('finalStory');
            if (finalStory) {
              try {
                const parsedStory = JSON.parse(finalStory);
                const suggestions = parsedStory.final_content?.marketplace_suggestions;
                if (suggestions && Array.isArray(suggestions)) {
                  // Check if new object format with URLs
                  if (suggestions.length > 0 && typeof suggestions[0] === 'object' && suggestions[0].name) {
                    return suggestions.map((suggestion: any, index: number) => ({
                      name: suggestion.name,
                      logo: ['🛍️', '🌍', '📦', '🎨'][index] || '🛒',
                      confidence: 90 - (index * 5),
                      reason: suggestion.reason || `Great platform for selling ${suggestion.name.toLowerCase()} handmade crafts`,
                      url: suggestion.url || '#'
                    }));
                  }
                  // Legacy string array format
                  else if (typeof suggestions[0] === 'string') {
                    return suggestions.map((name: string, index: number) => ({
                      name,
                      logo: ['🛍️', '🌍', '📦', '🎨'][index] || '🛒',
                      confidence: 90 - (index * 5),
                      reason: `Great platform for ${name.toLowerCase()} selling handmade crafts`,
                      url: getMarketplaceUrl(name)
                    }));
                  }
                }
              } catch (error) {
                console.error('Error parsing story data:', error);
              }
            }
            return galleryContent.marketplace.recommendations;
          })().map((marketplace: any, index: number) => (
            <motion.div
              key={marketplace.name}
              className="relative"
            >
              <motion.div
                className="flex items-center justify-between p-4 rounded-lg border border-gray-600 hover:shadow-md transition-all duration-300 cursor-pointer hover:border-cobalt/50"
                initial={{ opacity: 0, x: -20 }}
                animate={isRevealed ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.2 }}
                onHoverStart={() => setHoveredMarketplace(marketplace.name)}
                onHoverEnd={() => setHoveredMarketplace(null)}
                onClick={() => handleMarketplaceClick(marketplace.url, marketplace.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="text-2xl"
                    animate={hoveredMarketplace === marketplace.name ? { 
                      filter: 'grayscale(0%)',
                      scale: 1.1 
                    } : { 
                      filter: 'grayscale(100%)',
                      scale: 1 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {marketplace.logo}
                  </motion.div>
                  <div>
                    <h4 className="font-playfair font-bold text-white">{marketplace.name}</h4>
                    <div className="bg-cobalt/20 px-2 py-1 rounded-full inline-block">
                      <span className="font-inter text-xs font-semibold text-blue-300">
                        {marketplace.confidence}% Match
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </motion.div>
              
              <AnimatePresence>
                {hoveredMarketplace === marketplace.name && (
                  <motion.div
                    className="absolute left-4 right-4 top-16 p-4 bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-lg border border-gray-600 z-30"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="font-inter text-gray-300 text-sm leading-relaxed mb-2">{marketplace.reason}</p>
                    <div className="flex items-center text-blue-400 text-xs">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Click to visit marketplace
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Pricing Oracle Card Component
const PricingOracleCard: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Get real pricing data or fallback to mock
  const getPricingData = () => {
    if (typeof window === 'undefined') return {
      suggested_price_range: "$150 - $300",
      pricing_factors: ["Complexity of design", "Time investment", "Material quality"],
      market_positioning: "Premium handcrafted art"
    };
    
    const finalStory = sessionStorage.getItem('finalStory');
    if (finalStory) {
      try {
        const parsedStory = JSON.parse(finalStory);
        return parsedStory.final_content?.pricing_guidance || {
          suggested_price_range: "$150 - $300",
          pricing_factors: ["Complexity of design", "Time investment", "Material quality"],
          market_positioning: "Premium handcrafted art"
        };
      } catch (error) {
        console.error('Error parsing story data:', error);
      }
    }
    return {
      suggested_price_range: "$150 - $300", 
      pricing_factors: ["Complexity of design", "Time investment", "Material quality"],
      market_positioning: "Premium handcrafted art"
    };
  };

  const pricingData = getPricingData();

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 relative overflow-hidden max-w-lg mx-auto"
      data-dark-card="true"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(44, 44, 44, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        y: -3
      }}
    >
      {/* Reveal effect */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-gray-700/70 to-gray-800/90 backdrop-blur-sm z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-0">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-terracotta to-red-500 rounded-full mb-4"
            initial={{ scale: 0 }}
            animate={isRevealed ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-2xl text-white font-bold">$</span>
          </motion.div>
          <h3 className="font-playfair text-3xl font-bold text-white mb-2">Pricing Oracle</h3>
        </div>

        {/* Recommended Price Range */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="text-black-300 text-sm mb-2">Recommended Price Range</p>
          <h4 className="text-4xl font-bold text-cobalt">{pricingData.suggested_price_range}</h4>
          <p className="text-charcoal/70 text-sm mt-2">{pricingData.market_positioning}</p>
        </motion.div>

        {/* Pricing Factors */}
        <motion.div
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-charcoal/70 text-sm mb-2 font-semibold">Pricing Factors:</p>
          <ul className="text-charcoal text-sm space-y-1">
            {pricingData.pricing_factors.map((factor: string, index: number) => (
              <li key={index} className="flex items-center">
                <span className="text-terracotta mr-2">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Market Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <p className="text-charcoal/70 text-sm mb-2">Etsy Average</p>
            <h5 className="text-3xl font-bold text-terracotta">$180</h5>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <p className="text-charcoal/70 text-sm mb-2">Premium Market</p>
            <h5 className="text-3xl font-bold text-charcoal">$280</h5>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Modal Components for Tools
interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: string;
  // QR Code props
  qrCodeUrl: string;
  isGeneratingQR: boolean;
  generateQRCode: () => void;
  // Translation props
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  translatedText: string;
  isTranslating: boolean;
  textToTranslate: string;
  setTextToTranslate: (text: string) => void;
  translateContent: () => void;
}

const ToolModal: React.FC<ToolModalProps> = ({ 
  isOpen, 
  onClose, 
  tool,
  qrCodeUrl,
  isGeneratingQR,
  generateQRCode,
  selectedLanguage,
  setSelectedLanguage,
  translatedText,
  isTranslating,
  textToTranslate,
  setTextToTranslate,
  translateContent
}) => {
  const renderModalContent = () => {
    switch (tool) {
      case 'qr':
        return (
          <div className="text-center p-6">
            <HiQrcode className="w-16 h-16 text-cobalt mx-auto mb-6" />
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">QR Code Generator</h3>
            
            {qrCodeUrl ? (
              <div className="w-48 h-48 mx-auto mb-6 border-2 border-cobalt/20 rounded-xl overflow-hidden bg-white">
                <img 
                  src={qrCodeUrl} 
                  alt="Generated QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto mb-6 border-2 border-cobalt/20 rounded-xl flex items-center justify-center bg-gray-50">
                {isGeneratingQR ? (
                  <motion.div
                    className="w-8 h-8 border-4 border-cobalt border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <motion.div
                    className="grid grid-cols-8 gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {[...Array(64)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-charcoal rounded-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: Math.random() > 0.5 ? 1 : 0 }}
                        transition={{ delay: i * 0.01 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            )}
            
            <p className="font-inter text-charcoal/70 text-lg mb-6">
              {qrCodeUrl ? 'Scan to view your artwork story!' : 'Generate a QR code to share your artwork'}
            </p>
            
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={generateQRCode}
                disabled={isGeneratingQR}
                className="bg-cobalt text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGeneratingQR ? 'Generating...' : qrCodeUrl ? 'Regenerate QR' : 'Generate QR Code'}
              </motion.button>
              
              {qrCodeUrl && (
                <motion.button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrCodeUrl;
                    link.download = 'artwork-qr-code.png';
                    link.click();
                  }}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download QR
                </motion.button>
              )}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div 
            className="text-center p-6"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, rgba(44, 44, 44, 0.98) 0%, rgba(26, 26, 26, 0.95) 100%),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
              `,
              borderRadius: '12px'
            }}
          >
            <HiCurrencyDollar className="w-16 h-16 text-terracotta mx-auto mb-6" />
            <h3 className="font-playfair text-3xl font-bold text-white mb-6">Pricing Oracle</h3>
            <div className="space-y-6">
              <motion.div
                className="p-6 bg-cobalt/5 rounded-xl border border-cobalt/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-inter text-sm text-charcoal/70 mb-3">Recommended Price Range</p>
                <motion.p
                  className="font-playfair text-4xl font-bold text-cobalt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  $150 - $300
                </motion.p>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-terracotta/5 rounded-lg border border-terracotta/20">
                  <p className="font-inter text-xs text-charcoal/70 mb-2">Etsy Average</p>
                  <motion.p
                    className="font-playfair text-2xl font-bold text-terracotta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                  >
                    $180
                  </motion.p>
                </div>
                <div className="p-4 bg-charcoal/5 rounded-lg border border-charcoal/20">
                  <p className="font-inter text-xs text-charcoal/70 mb-2">Premium Market</p>
                  <motion.p
                    className="font-playfair text-2xl font-bold text-charcoal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                  >
                    $280
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'translate':
        return (
          <div className="p-6">
            <HiTranslate className="w-16 h-16 text-charcoal mx-auto mb-6" />
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-6 text-center">Universal Translator</h3>
            
            {/* Language and Content Selection */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal/70 mb-2">Select Language:</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cobalt"
                >
                  <option value="">Choose a language...</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                  <option value="Chinese">Chinese (中文)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Portuguese">Portuguese (Português)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal/70 mb-2">Content to Translate:</label>
                <select
                  value={textToTranslate}
                  onChange={(e) => setTextToTranslate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cobalt"
                >
                  <option value="description">Product Description</option>
                  <option value="instagram">Instagram Post</option>
                </select>
              </div>
            </div>

            {/* Translation Button */}
            <div className="text-center mb-6">
              <motion.button
                onClick={translateContent}
                disabled={isTranslating || !selectedLanguage}
                className="bg-charcoal text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isTranslating ? 'Translating...' : 'Translate Content'}
              </motion.button>
              
              {/* Debug info */}
              <div className="mt-4 text-xs text-gray-500">
                Debug: {translatedText ? `Translation exists (${translatedText.length} chars)` : 'No translation'} | 
                Language: {selectedLanguage || 'None'} | 
                Translating: {isTranslating ? 'Yes' : 'No'}
              </div>
            </div>

            {/* Translation Result */}
            {translatedText && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                <p className="font-inter text-sm text-charcoal/70 mb-3 font-semibold">
                  {selectedLanguage} Translation:
                </p>
                <motion.p
                  className="font-inter text-charcoal text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {translatedText}
                </motion.p>
                
                <div className="mt-4 flex justify-end">
                  <motion.button
                    onClick={() => {
                      navigator.clipboard.writeText(translatedText);
                      alert('Translation copied to clipboard!');
                    }}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Copy Translation
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        );

      case 'mockup':
        return (
          <div className="text-center p-6">
            <HiPhotograph className="w-16 h-16 text-cobalt mx-auto mb-6" />
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-6">Ad Mockup Generator</h3>
            <motion.div
              className="relative w-full h-48 bg-gradient-to-br from-cobalt/10 to-terracotta/10 rounded-xl overflow-hidden border border-cobalt/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              {/* Ink dissolve effect */}
              <motion.div
                className="absolute inset-0 bg-cobalt"
                initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                animate={{ clipPath: 'circle(100% at 50% 50%)' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
              <motion.img
                src={galleryContent.image}
                alt="Ad Mockup"
                className="w-full h-full object-cover rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
            </motion.div>
            <p className="font-inter text-charcoal/70 mt-4 text-lg">Professional ad mockup ready!</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 rotate-12"
              enterTo="opacity-1 scale-100 rotate-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-1 scale-100 rotate-0"
              leaveTo="opacity-0 scale-95 rotate-12"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                >
                  <HiX className="w-5 h-5 text-charcoal" />
                </button>
                {renderModalContent()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function GalleryPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [scriptCopyStatus, setScriptCopyStatus] = useState('Copy Script');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for real story data
  const [storyData, setStoryData] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // State for QR code functionality
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // State for translation functionality
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState('description');

  // ALL useEffect hooks must be called before any conditional returns
  // Load story data from sessionStorage
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const finalStory = sessionStorage.getItem('finalStory');
      const imageData = sessionStorage.getItem('uploadedImage');
      
      if (finalStory) {
        try {
          const parsedStory = JSON.parse(finalStory);
          setStoryData(parsedStory);
        } catch (error) {
          console.error('Error parsing story data:', error);
        }
      }
      
      if (imageData) {
        setUploadedImage(imageData);
      }
    }
  }, []);

  // Set window size on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Define all functions before conditional return
  const handleScriptCopy = () => {
    let scriptText = '';
    if (storyData?.final_content?.video_script) {
      scriptText = storyData.final_content.video_script;
    } else {
      scriptText = galleryContent.videoScript.scenes.map(scene => `${scene.scene}: ${scene.visuals.action}\nAudio: ${scene.audio.voiceover}`).join('\n\n');
    }
    navigator.clipboard.writeText(scriptText);
    setScriptCopyStatus('Copied!');
    setTimeout(() => setScriptCopyStatus('Copy Script'), 2000);
  };

  // QR Code generation function
  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      // Create a URL for the current gallery page (in production, this would be the actual URL)
      const currentUrl = window.location.href;
      
      const response = await fetch(apiConfig.endpoints.generateQR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: currentUrl,
          size: 10,
          border: 4
        })
      });

      if (response.ok) {
        const result = await response.json();
        setQrCodeUrl(`${apiConfig.baseURL}${result.url}`);
      } else {
        console.error('Failed to generate QR code');
        alert('Failed to generate QR code. Please try again.');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please check if the backend is running.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  // Translation function
  const translateContent = async () => {
    if (!selectedLanguage) {
      alert('Please select a language first.');
      return;
    }

    setIsTranslating(true);
    try {
      let textContent = '';
      
      // Get the text to translate based on selection
      if (textToTranslate === 'description' && storyData?.final_content?.product_description) {
        textContent = storyData.final_content.product_description;
      } else if (textToTranslate === 'instagram' && storyData?.final_content?.instagram_post) {
        textContent = storyData.final_content.instagram_post;
      } else {
        // Fallback to gallery content
        textContent = textToTranslate === 'description' 
          ? galleryContent.productDescription.description 
          : galleryContent.instagram.caption;
      }

      console.log('Translation request:', {
        text_to_translate: textContent,
        target_language: selectedLanguage,
        context: textToTranslate === 'description' ? 'Product description' : 'Instagram post'
      });

      const response = await fetch(apiConfig.endpoints.translate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_to_translate: textContent,
          target_language: selectedLanguage,
          context: textToTranslate === 'description' ? 'Product description' : 'Instagram post'
        })
      });

      console.log('Translation response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Translation result:', result);
        if (result.translated_text) {
          setTranslatedText(result.translated_text);
          console.log('Translation state updated:', result.translated_text);
        } else if (result.error) {
          console.error('Backend returned error:', result.error);
          alert(`Translation failed: ${result.error}`);
        } else {
          console.error('Unexpected response format:', result);
          alert('Unexpected response format from translation service.');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to translate text. Status:', response.status, 'Response:', errorText);
        alert(`Failed to translate text. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error translating text:', error);
      alert('Error translating text. Please check if the backend is running.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
    
    // Reset state when opening translation modal
    if (tool === 'translate') {
      setTranslatedText('');
      setSelectedLanguage('');
      setTextToTranslate('description');
      setIsTranslating(false);
    }
    
    // Reset state when opening QR modal
    if (tool === 'qr') {
      setQrCodeUrl('');
      setIsGeneratingQR(false);
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100"></div>;
  }

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <>
      {/* Scrollbar Background Layers */}
      <ScrollbarBackground position="right" />
      <ScrollbarBackground position="left" />
      
      {/* Custom Animated Scrollbar - Right Side */}
      <CustomScrollbar color="rgba(0, 0, 0, 0.8)" thickness={2} position="right" />
      
      {/* Custom Animated Scrollbar - Left Side */}
      <CustomScrollbar color="rgba(0, 0, 0, 0.8)" thickness={2} position="left" />
      
      {/* Artistic Cursor */}
      <ArtisticCursor />
      
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div 
        ref={containerRef}
        className="min-h-screen relative overflow-hidden"
        style={{ 
          background: 'radial-gradient(ellipse at center, #F8F5F2 0%, #F0EDE8 70%, #E8E4DF 100%)',
          color: '#2C2C2C' 
        }}
      >
        {/* Custom dual dot pattern background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: '#ffffff',
            opacity: 0.4,
            backgroundImage: 'radial-gradient(#a5a097 2px, transparent 2px), radial-gradient(#a5a097 2px, #ffffff 2px)',
            backgroundSize: '80px 80px',
            backgroundPosition: '0 0,40px 40px'
          }}
        />
        
        {/* Living ink vein background */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Static Background Elements */}
          
          <svg className="w-full h-full opacity-10">
            {[...Array(15)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${i * 100},0 Q${i * 100 + 50},${200 + i * 50} ${i * 100 + 100},400 T${i * 100 + 200},800`}
                fill="none"
                stroke="#2C2C2C"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ 
                  pathLength: 1,
                  opacity: 0.1,
                  x: mousePosition.x * -0.01,
                  y: mousePosition.y * -0.01
                }}
                transition={{
                  duration: 8 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>

        {/* AI threads weaving transition */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <svg className="w-full h-full">
            {[...Array(12)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${windowSize.width / 2},${windowSize.height / 2} Q${200 + i * 100},${100 + i * 50} ${i * 150},${50 + i * 60}`}
                fill="none"
                stroke="#2C2C2C"
                strokeWidth="3"
                opacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: [0, 1],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(44, 44, 44, 0.6))'
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Header */}
        <motion.div
          className="relative z-20 pt-20 pb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: 1, 
            y: 0
          }}
          transition={{ 
            duration: 0.8, 
            delay: 2
          }}
        >
          <motion.h1 
            className="font-playfair text-6xl font-bold text-charcoal mb-4"
          >
            Your Story, 
            <span className="bg-gradient-to-r from-cobalt to-terracotta bg-clip-text text-transparent">
              {' '}Amplified
            </span>
          </motion.h1>
          <p className="font-inter text-xl text-charcoal/70 max-w-2xl mx-auto">
            Every thread tells a tale. Every pattern holds a memory. 
            Discover the narratives woven into your masterpiece.
          </p>
        </motion.div>

        {/* Living Gallery Wall - Masonry Layout */}
        <motion.div
          className="relative z-20 max-w-7xl mx-auto px-8 pb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-6"
            columnClassName="pl-6 bg-clip-padding"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, -12, 0], 
                scale: 1,
                rotateY: [0, 2, 0, -2, 0]
              }}
              transition={{ 
                delay: 0.1, 
                duration: 0.6,
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
              className="mb-6"
            >
              <InstagramCard />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0], 
                scale: 1,
                rotateX: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                delay: 0.3, 
                duration: 0.6,
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
                rotateX: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
              className="mb-6"
            >
              <ProductDescriptionCard />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, -14, 0], 
                scale: 1,
                rotateZ: [0, 0.8, 0, -0.8, 0]
              }}
              transition={{ 
                delay: 0.5, 
                duration: 0.6,
                y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 },
                rotateZ: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.8 },
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
              className="mb-6"
            >
              <MarketplaceCard />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, -9, 0], 
                scale: 1,
                rotateY: [0, 1.5, 0, -1.5, 0]
              }}
              transition={{ 
                delay: 0.7, 
                duration: 0.6,
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 3 },
                rotateY: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3.5 },
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.02 }}
              className="mb-6"
            >
              <PricingOracleCard />
            </motion.div>
          </Masonry>

          {/* Director's Cut Video Script Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: 0
            }}
            transition={{ 
              duration: 0.8, 
              delay: 1.2
            }}
            className="mt-16 mb-16"
          >
            <VideoScriptCard />
          </motion.div>
        </motion.div>

        {/* Floating Tools Palette */}
        <FloatingTools onToolClick={handleToolClick} />

        {/* Tool Modal */}
        <ToolModal
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
          tool={selectedTool || ''}
          qrCodeUrl={qrCodeUrl}
          isGeneratingQR={isGeneratingQR}
          generateQRCode={generateQRCode}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          translatedText={translatedText}
          isTranslating={isTranslating}
          textToTranslate={textToTranslate}
          setTextToTranslate={setTextToTranslate}
          translateContent={translateContent}
        />

        {/* Custom CSS for fonts and scrollbars */}
        <style jsx global>{`
          body {
            font-family: 'Inter', sans-serif;
            background-color: #F8F5F2;
            color: #2C2C2C;
          }
          
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          
          .text-cobalt {
            color: #2C2C2C;
          }
          
          .text-terracotta {
            color: #2C2C2C;
          }
          
          .text-charcoal {
            color: #2C2C2C;
          }
          
          .bg-cobalt {
            background-color: #2C2C2C;
          }
          
          .bg-terracotta {
            background-color: #2C2C2C;
          }
          
          .bg-charcoal {
            background-color: #2C2C2C;
          }
          
          .bg-paper {
            background-color: #F8F5F2;
          }
          
          .border-cobalt {
            border-color: #2C2C2C;
          }
          
          .border-terracotta {
            border-color: #2C2C2C;
          }
          
          .border-charcoal {
            border-color: #2C2C2C;
          }
          
          /* Hide all scrollbars completely */
          * {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          
          *::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          
          /* Ensure html and body also hide scrollbars */
          html, body {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  );
}