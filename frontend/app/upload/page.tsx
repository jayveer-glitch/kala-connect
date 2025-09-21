'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// The Canvas - "Where Your Story Begins" 
export default function CanvasPage() {
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const router = useRouter();
  const inkVeinsAnimation = useAnimation();
  const circleAnimation = useAnimation();
  const backgroundAnimation = useAnimation();

  // Art categories for dropdown
  const artCategories = [
    { id: 'pottery', name: '🏺 Pottery & Ceramics', color: '#E07A5F' },
    { id: 'painting', name: '🎨 Paintings & Drawings', color: '#0047AB' },
    { id: 'sculpture', name: '🗿 Sculptures & Carvings', color: '#92400e' },
    { id: 'textile', name: '🧵 Textiles & Fabrics', color: '#dc2626' },
    { id: 'jewelry', name: '💎 Jewelry & Metalwork', color: '#f59e0b' },
    { id: 'woodwork', name: '🪵 Woodwork & Furniture', color: '#059669' },
    { id: 'traditional', name: '🏛️ Traditional Crafts', color: '#7c2d12' },
    { id: 'modern', name: '✨ Modern Art', color: '#6366f1' }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Start the ambient ink veins animation
    inkVeinsAnimation.start({
      opacity: [0.1, 0.3, 0.1],
      pathLength: [0, 1, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [inkVeinsAnimation]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    
    if (dragCounter === 0) {
      setIsDragging(true);
      
      // Trigger the "crazy" animations
      inkVeinsAnimation.start({
        opacity: [0.1, 0.8, 0.6],
        pathLength: [0, 1],
        stroke: "#0047AB", // Cobalt blue glow
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      circleAnimation.start({
        scale: [1, 1.05],
        rotate: [0, 2, -2, 0],
        filter: ["brightness(1)", "brightness(1.2)", "brightness(1.1)"],
        stroke: "#0047AB",
        strokeWidth: [2, 4, 3],
        transition: { duration: 0.6, ease: "easeOut" }
      });

      backgroundAnimation.start({
        background: [
          "radial-gradient(circle at 50% 50%, rgba(0, 71, 171, 0.05) 0%, transparent 50%)",
          "radial-gradient(circle at 50% 50%, rgba(0, 71, 171, 0.15) 0%, transparent 70%)"
        ],
        transition: { duration: 0.8 }
      });
    }
  }, [dragCounter, inkVeinsAnimation, circleAnimation, backgroundAnimation]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    
    if (dragCounter === 1) {
      setIsDragging(false);
      
      // Reset animations
      inkVeinsAnimation.start({
        opacity: [0.6, 0.1],
        stroke: "#2C2C2C",
        transition: { duration: 1, ease: "easeInOut" }
      });
      
      circleAnimation.start({
        scale: 1,
        rotate: 0,
        filter: "brightness(1)",
        stroke: "#2C2C2C",
        strokeWidth: 2,
        transition: { duration: 0.8, ease: "easeInOut" }
      });

      backgroundAnimation.start({
        background: "radial-gradient(circle at 50% 50%, rgba(0, 71, 171, 0.05) 0%, transparent 50%)",
        transition: { duration: 1 }
      });
    }
  }, [dragCounter, inkVeinsAnimation, circleAnimation, backgroundAnimation]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        
        // Show success popup
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        
        // Trigger the magical circle expansion and iris wipe
        circleAnimation.start({
          scale: [1.05, 1.5, 1],
          opacity: [1, 0.8, 1],
          transition: { duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }
        });
      };
      reader.readAsDataURL(imageFile);
    }

    // Reset background
    backgroundAnimation.start({
      background: "radial-gradient(circle at 50% 50%, rgba(0, 71, 171, 0.05) 0%, transparent 50%)",
      transition: { duration: 1 }
    });
  }, [circleAnimation, backgroundAnimation]);

  const handleAnalyze = async () => {
    if (!uploadedImage || !selectedCategory) {
      alert('Please select a category for your artwork');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Convert data URL to blob
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'artwork.jpg');
      formData.append('category', selectedCategory);
      
      // Call backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const analysisResponse = await fetch(`${apiUrl}/generate-story`, {
        method: 'POST',
        body: formData,
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const analysisData = await analysisResponse.json();
      
      // Store the analysis data and redirect to conversation page
      sessionStorage.setItem('analysisData', JSON.stringify(analysisData));
      sessionStorage.setItem('uploadedImage', uploadedImage);
      sessionStorage.setItem('selectedCategory', selectedCategory);
      
      router.push('/conversation_page');
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-2xl font-playfair text-charcoal">Preparing your canvas...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-paper relative overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Ambient Background Animation Layer */}
      <motion.div 
        className="absolute inset-0"
        animate={backgroundAnimation}
        initial={{ background: "radial-gradient(circle at 50% 50%, rgba(0, 71, 171, 0.05) 0%, transparent 50%)" }}
      />

      {/* Living Ink Veins Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800" style={{ zIndex: 1 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Top Left Ink Veins */}
        <motion.path
          d="M0,0 Q50,30 100,20 T200,40 Q300,60 400,50 T600,80"
          fill="none"
          stroke="#2C2C2C"
          strokeWidth="1"
          opacity="0.1"
          animate={inkVeinsAnimation}
          filter="url(#glow)"
        />
        
        {/* Top Right Ink Veins */}
        <motion.path
          d="M1200,0 Q1140,40 1080,24 T960,64 Q840,96 720,80 T480,128"
          fill="none"
          stroke="#2C2C2C"
          strokeWidth="1"
          opacity="0.1"
          animate={inkVeinsAnimation}
          style={{ animationDelay: '2s' }}
          filter="url(#glow)"
        />
        
        {/* Bottom Left Ink Veins */}
        <motion.path
          d="M0,800 Q60,760 120,776 T240,736 Q360,704 480,720 T720,672"
          fill="none"
          stroke="#2C2C2C"
          strokeWidth="1"
          opacity="0.1"
          animate={inkVeinsAnimation}
          style={{ animationDelay: '4s' }}
          filter="url(#glow)"
        />
        
        {/* Bottom Right Ink Veins */}
        <motion.path
          d="M1200,800 Q1080,720 960,760 T720,680 Q480,600 360,640 T120,560"
          fill="none"
          stroke="#2C2C2C"
          strokeWidth="1"
          opacity="0.1"
          animate={inkVeinsAnimation}
          style={{ animationDelay: '6s' }}
          filter="url(#glow)"
        />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Page Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-6 leading-tight">
            Where Your Story
            <br />
            <span className="text-transparent bg-gradient-to-r from-terracotta via-cobalt to-terracotta bg-clip-text">
              Begins
            </span>
          </h1>
          <p className="text-xl text-charcoal/70 font-inter font-light max-w-2xl mx-auto">
            Upload your masterpiece and let our AI weave the narrative that connects your art to the world
          </p>
        </motion.div>

        {/* Category Dropdown - Above the Upload Circle */}
        <AnimatePresence>
          {uploadedImage && !isAnalyzing && (
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Category Dropdown */}
              <div className="relative z-50">
                <motion.button
                  className="bg-white border-2 border-charcoal/20 rounded-2xl px-6 py-4 font-inter font-medium text-charcoal shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] text-left"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedCategory ? 
                    artCategories.find(cat => cat.id === selectedCategory)?.name : 
                    "🎨 Choose your art category..."
                  }
                  <motion.span
                    className="float-right text-charcoal/60"
                    animate={{ rotate: showCategoryDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ↓
                  </motion.span>
                </motion.button>

                {/* Dropdown Options */}
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-charcoal/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      {/* Close button */}
                      <div className="flex justify-between items-center px-4 py-2 border-b border-charcoal/5 bg-gray-50">
                        <span className="text-sm font-inter text-charcoal/70">Select Category</span>
                        <button
                          className="text-charcoal/60 hover:text-charcoal transition-colors cursor-pointer"
                          onClick={() => setShowCategoryDropdown(false)}
                        >
                          ✕
                        </button>
                      </div>
                      
                      {artCategories.map((category, index) => (
                        <button
                          key={category.id}
                          className="w-full px-6 py-4 text-left font-inter hover:bg-gray-50 transition-colors duration-200 border-b border-charcoal/5 last:border-b-0 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedCategory(category.id);
                            setShowCategoryDropdown(false);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <span style={{ color: category.color }}>
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Dropzone with 3-Column Equal Grid Layout */}
        <div className="w-full max-w-7xl px-4 mb-6">
          <div className="grid grid-cols-3 items-center gap-8 lg:gap-12">
            
            {/* Left Column - Art Guide Card */}
            <div className="flex justify-end">
              <motion.div
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg max-w-sm w-full"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="text-center">
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎨
                  </motion.div>
                  <h3 className="font-playfair font-bold text-xl text-charcoal mb-3">
                    Share Your Art
                  </h3>
                  <p className="font-inter text-charcoal/70 text-sm leading-relaxed">
                    Drop your masterpiece in the circle and watch as AI discovers the story behind your creation
                  </p>
                  
                  {/* Decorative ink dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-terracotta/40"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Center Column - Upload Circle */}
            <div className="flex justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
          <svg width="400" height="400" className="drop-shadow-2xl">
            <motion.circle
              cx="200"
              cy="200"
              r="180"
              fill="transparent"
              stroke="#2C2C2C"
              strokeWidth="2"
              strokeDasharray="3,2"
              animate={circleAnimation}
              style={{
                filter: isDragging ? 'drop-shadow(0 0 20px rgba(0, 71, 171, 0.6))' : 'drop-shadow(0 0 10px rgba(44, 44, 44, 0.2))'
              }}
            />
            
            {/* Ripple Effect on Drag */}
            <AnimatePresence>
              {isDragging && (
                <motion.circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="transparent"
                  stroke="#0047AB"
                  strokeWidth="1"
                  opacity="0.6"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ 
                    scale: [1, 1.2, 1.4],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {/* Image Preview */}
            <AnimatePresence>
              {uploadedImage && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                >
                  <defs>
                    <clipPath id="circleClip">
                      <circle cx="200" cy="200" r="170" />
                    </clipPath>
                  </defs>
                  <image
                    href={uploadedImage}
                    x="30"
                    y="30"
                    width="340"
                    height="340"
                    clipPath="url(#circleClip)"
                    style={{ objectFit: 'cover' }}
                  />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* Center Text - Only when no image is uploaded */}
          {!uploadedImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-2">
                  {isDragging ? "Let's see it." : "Place Your Masterpiece Here"}
                </h2>
                <p className="text-sm text-charcoal/60 font-inter">
                  Drag & drop your artwork or click to browse
                </p>
              </motion.div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setUploadedImage(e.target?.result as string);
                  
                  // Show success popup
                  setShowSuccessPopup(true);
                  setTimeout(() => {
                    setShowSuccessPopup(false);
                  }, 3000);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
              </motion.div>
            </div>

            {/* Right Column - Always Visible Card */}
            <div className="flex justify-start">
              <AnimatePresence mode="wait">
                {/* Initial State - Upload Prompt */}
                {!uploadedImage && (
                  <motion.div
                    key="upload-prompt"
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg max-w-sm w-full"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="text-4xl mb-4"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        📖
                      </motion.div>
                      <h3 className="font-playfair font-bold text-xl text-charcoal mb-3">
                        Get Ready
                      </h3>
                      <p className="font-inter text-charcoal/70 text-sm leading-relaxed mb-4">
                        Upload your image to get ready for your story. Let AI discover the magic within your creation.
                      </p>
                      
                      {/* Waiting dots animation */}
                      <div className="flex justify-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-cobalt/40"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 0.8, 0.4]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* After Upload State - Analyze Button */}
                {uploadedImage && !isAnalyzing && (
                  <motion.div
                    key="analyze-button"
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg max-w-sm w-full"
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="text-4xl mb-4"
                        animate={{ 
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ✨
                      </motion.div>
                      <h3 className="font-playfair font-bold text-xl text-charcoal mb-4">
                        Ready to Analyze
                      </h3>
                      
                      {/* Analyze Button */}
                      <motion.button
                        className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white px-6 py-3 rounded-full font-playfair font-bold text-lg shadow-2xl relative overflow-hidden group w-full"
                        onClick={handleAnalyze}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 25px 50px rgba(224, 122, 95, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">Analyze My Art ✨</span>
                        
                        {/* Ink Bleed Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cobalt/20 to-cobalt/30 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.8, 0.6]
                          }}
                          transition={{ duration: 0.8 }}
                        />
                        
                        {/* Subtle particles */}
                        <div className="absolute inset-0">
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white/40 rounded-full"
                              style={{
                                left: `${25 + i * 15}%`,
                                top: `${35 + (i % 2) * 30}%`
                              }}
                              animate={{
                                y: [0, -8, 0],
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{
                                duration: 2 + i * 0.3,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </motion.button>
                      
                      <p className="font-inter text-charcoal/60 text-xs mt-3 leading-relaxed">
                        Let AI discover your story
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Analyzing Animation - Enhanced */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-paper/95 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-2 gap-12 items-center">
                  
                  {/* Left Side - Image Analysis */}
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {uploadedImage && (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Analyzing"
                          className="w-full max-w-md mx-auto object-cover rounded-3xl shadow-2xl"
                        />
                        
                        {/* Scanning Lines */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-cobalt/30 to-transparent rounded-3xl"
                          animate={{ 
                            y: [-100, 400, -100]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* AI Analysis Dots */}
                        <svg className="absolute inset-0 w-full h-full">
                          {[...Array(12)].map((_, i) => (
                            <motion.circle
                              key={i}
                              cx={`${20 + (i % 3) * 30}%`}
                              cy={`${20 + Math.floor(i / 3) * 25}%`}
                              r="3"
                              fill="#0047AB"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ 
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </svg>
                        
                        {/* Detection Frames */}
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute border-2 border-terracotta rounded-lg"
                            style={{
                              left: `${15 + i * 25}%`,
                              top: `${20 + i * 20}%`,
                              width: '80px',
                              height: '60px'
                            }}
                            animate={{
                              opacity: [0, 0.8, 0],
                              scale: [0.8, 1.1, 0.8]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              delay: i * 0.8
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Right Side - Analysis Timeline & Interactive Elements */}
                  <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {/* Analysis Title */}
                    <div className="text-center mb-8">
                      <h2 className="text-4xl font-playfair font-bold text-charcoal mb-2">
                        AI Analysis in Progress
                      </h2>
                      <motion.p 
                        className="text-lg text-charcoal/70 font-inter"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Discovering the story within your masterpiece...
                      </motion.p>
                    </div>

                    {/* Interactive Progress Timeline */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                      <h3 className="text-xl font-playfair font-bold text-charcoal mb-6">Analysis Steps</h3>
                      
                      <div className="space-y-4">
                        {[
                          { step: "Color Palette Detection", icon: "🎨", delay: 0 },
                          { step: "Technique Recognition", icon: "✨", delay: 1 },
                          { step: "Cultural Context Analysis", icon: "🏛️", delay: 2 },
                          { step: "Artistic Style Classification", icon: "🖼️", delay: 3 },
                          { step: "Story Generation", icon: "📚", delay: 4 }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
                            initial={{ opacity: 0.3, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: item.delay * 0.6 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                          >
                            <motion.div
                              className="text-2xl"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                delay: item.delay * 0.3
                              }}
                            >
                              {item.icon}
                            </motion.div>
                            
                            <div className="flex-1">
                              <p className="font-inter font-medium text-charcoal">
                                {item.step}
                              </p>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <motion.div
                                  className="bg-gradient-to-r from-cobalt to-terracotta h-2 rounded-full"
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ 
                                    duration: 2,
                                    delay: item.delay * 0.6,
                                    ease: "easeInOut"
                                  }}
                                />
                              </div>
                            </div>
                            
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: item.delay * 0.6 + 2 }}
                              className="text-green-500 text-xl"
                            >
                              ✓
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Elements */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Confidence Meter */}
                      <motion.div
                        className="bg-gradient-to-br from-cobalt/10 to-terracotta/10 rounded-2xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <h4 className="font-playfair font-bold text-charcoal mb-2">Confidence</h4>
                        <div className="relative">
                          <svg className="w-full h-12" viewBox="0 0 100 20">
                            <motion.path
                              d="M0,15 Q25,5 50,10 T100,8"
                              fill="none"
                              stroke="#0047AB"
                              strokeWidth="3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: [0, 1, 0.8] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </svg>
                          <motion.p
                            className="text-center font-inter text-sm text-charcoal/70 mt-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            87% Confident
                          </motion.p>
                        </div>
                      </motion.div>

                      {/* Fun Facts */}
                      <motion.div
                        className="bg-gradient-to-br from-terracotta/10 to-cobalt/10 rounded-2xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Interactive click - could cycle through facts
                        }}
                      >
                        <h4 className="font-playfair font-bold text-charcoal mb-2">Did You Know?</h4>
                        <motion.p
                          className="font-inter text-sm text-charcoal/70"
                          key={Math.random()} // Force re-render for animation
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          AI can identify over 200 different art techniques!
                        </motion.p>
                      </motion.div>
                    </div>

                    {/* Floating Particles Animation */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-cobalt/40 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                          }}
                          animate={{
                            y: [0, -50, -100],
                            x: [0, Math.sin(i) * 20, Math.cos(i) * 20],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="fixed top-20 right-8 z-50"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm border-2 border-green-200 rounded-xl p-3 shadow-lg min-w-[180px]"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="text-lg"
                  animate={{ 
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  ✅
                </motion.div>
                <div>
                  <h3 className="font-playfair font-bold text-sm text-green-700 mb-0">
                    Image Uploaded!
                  </h3>
                  <p className="font-inter text-xs text-green-600">
                    Ready for analysis
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}