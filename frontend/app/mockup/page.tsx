'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { HiUpload, HiSparkles, HiPhotograph, HiLightningBolt, HiEye, HiDownload, HiRefresh, HiArrowLeft } from 'react-icons/hi';
import { useRouter, useSearchParams } from 'next/navigation';

const AdMockupGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();

  // Get the uploaded image from URL params or use a default gallery image
  const uploadedImage = searchParams.get('image') || '/api/placeholder/400/600';

  // Parallax effects
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);

  const generateMockups = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Here you would call your backend API with the image and prompt
    // const response = await fetch('/api/generate-mockup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ image: uploadedImage, prompt })
    // });
    
    // Simulate API call with delay
    setTimeout(() => {
      // Mock generated mockups
      const mockMockups = [
        'https://picsum.photos/400/600?random=1',
        'https://picsum.photos/400/600?random=2',
        'https://picsum.photos/400/600?random=3',
        'https://picsum.photos/400/600?random=4'
      ];
      setGeneratedMockups(mockMockups);
      setIsGenerating(false);
    }, 3000);
  };

  // Floating particles animation
  const FloatingParticles: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-cobalt to-terracotta rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
          style={{
            left: `${5 + (i * 4) % 90}%`,
            top: `${10 + (i * 7) % 80}%`
          }}
        />
      ))}
    </div>
  );

  // Morphing background shapes
  const MorphingShapes: React.FC = () => (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ y: backgroundY }}
    >
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cobalt/10 to-terracotta/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          borderRadius: ['50%', '30%', '50%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-emerald-300/10 to-purple-400/10 rounded-full blur-xl"
        animate={{
          scale: [1.2, 0.8, 1.2],
          rotate: [360, 180, 0],
          x: [0, 50, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-300/10 to-pink-400/10 rounded-full blur-xl"
        animate={{
          scale: [0.8, 1.4, 0.8],
          rotate: [0, -180, -360],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-radial from-[#F8F5F2] via-[#F0EBE6] to-[#F8F5F2] relative overflow-hidden">
      <FloatingParticles />
      <MorphingShapes />

      {/* Custom CSS for fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
        
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

        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 50%, #F8F5F2 0%, #F0EBE6 50%, #F8F5F2 100%);
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          style={{ y: headerY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cobalt to-terracotta rounded-full mb-6"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <HiSparkles className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            className="font-playfair text-6xl font-black text-charcoal mb-4"
            animate={{
              backgroundImage: [
                'linear-gradient(45deg, #2C2C2C, #0047AB)',
                'linear-gradient(45deg, #0047AB, #E07A5F)',
                'linear-gradient(45deg, #E07A5F, #2C2C2C)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Ad Mockup Generator
          </motion.h1>

          <motion.p
            className="font-inter text-charcoal/70 text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Transform your product photos into stunning ad mockups with the power of AI
          </motion.p>
        </motion.div>

        {/* Back Button & Image Display */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-charcoal/70 hover:text-charcoal transition-colors"
              whileHover={{ x: -5 }}
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-inter">Back to Gallery</span>
            </motion.button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-charcoal/10">
            <div className="text-center">
              <motion.div
                className="inline-block mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  <motion.img
                    src={uploadedImage}
                    alt="Selected product"
                    className="max-w-xs h-48 object-cover rounded-2xl shadow-xl"
                    animate={{
                      rotateY: [0, 5, -5, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <span className="text-white text-sm">✓</span>
                  </motion.div>
                </div>
              </motion.div>

              <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
                Ready for Mockup Generation!
              </h3>
              <p className="font-inter text-charcoal/60">
                Your image from the gallery will be transformed into stunning ad mockups
              </p>
            </div>
          </div>
        </motion.div>

        {/* Prompt Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        >
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-charcoal/10"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,71,171,0.1)' }}
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <HiLightningBolt className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-playfair text-2xl font-bold text-charcoal">
                    Describe Your Vision
                  </h3>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the ad mockup you want... e.g., 'Professional product shot on a marble background with soft lighting for a luxury skincare brand'"
                  className="w-full h-32 p-6 border border-charcoal/20 rounded-2xl focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 outline-none font-inter resize-none bg-white/50"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 25%, rgba(0,71,171,0.02) 0%, transparent 25%),
                      radial-gradient(circle at 75% 75%, rgba(224,122,95,0.02) 0%, transparent 25%)
                    `
                  }}
                />

                <motion.button
                  onClick={generateMockups}
                  disabled={!prompt.trim() || isGenerating}
                  className="mt-6 w-full bg-gradient-to-r from-cobalt to-terracotta text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isGenerating ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isGenerating ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <motion.div
                      animate={isGenerating ? { rotate: 360 } : {}}
                      transition={isGenerating ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    >
                      {isGenerating ? <HiRefresh className="w-6 h-6" /> : <HiSparkles className="w-6 h-6" />}
                    </motion.div>
                    <span>{isGenerating ? 'Generating Magic...' : 'Generate Ad Mockups'}</span>
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>

        {/* Loading Animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md mx-4"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-cobalt to-terracotta rounded-full mx-auto mb-6 flex items-center justify-center"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <HiSparkles className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  AI is Creating Magic
                </h3>
                <p className="font-inter text-charcoal/60">
                  Your stunning ad mockups are being generated...
                </p>

                <div className="mt-6 flex justify-center space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-cobalt rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Mockups */}
        <AnimatePresence>
          {generatedMockups.length > 0 && (
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">
                  Your Ad Mockups Are Ready! 🎉
                </h2>
                <p className="font-inter text-charcoal/60 text-lg">
                  Choose your favorite and download in high resolution
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {generatedMockups.map((mockup, index) => (
                  <motion.div
                    key={index}
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div
                      className="bg-white rounded-2xl p-4 shadow-xl border border-charcoal/10 overflow-hidden"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 25% 25%, rgba(0,71,171,0.05) 0%, transparent 25%),
                          radial-gradient(circle at 75% 75%, rgba(224,122,95,0.05) 0%, transparent 25%)
                        `
                      }}
                    >
                      <motion.img
                        src={mockup}
                        alt={`Ad mockup ${index + 1}`}
                        className="w-full h-64 object-cover rounded-xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex space-x-4">
                          <motion.button
                            className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <HiEye className="w-6 h-6 text-white" />
                          </motion.button>
                          <motion.button
                            className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <HiDownload className="w-6 h-6 text-white" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      className="mt-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <h4 className="font-playfair text-lg font-semibold text-charcoal">
                        Mockup {index + 1}
                      </h4>
                      <p className="font-inter text-charcoal/60 text-sm">
                        AI Generated • High Resolution
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  onClick={() => {
                    router.back();
                  }}
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Gallery
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdMockupGenerator;