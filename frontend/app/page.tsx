'use client';

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar'
import PhaseCard from './components/PhaseCard'
import CustomScrollbar from './components/CustomScrollbar'
import ScrollbarBackground from './components/ScrollbarBackground'
import ArtisticCursor from './components/ArtisticCursor'
import AnimatedPattern from './components/AnimatedPattern'

// Floating AI Spark Component
const FloatingAISparkle = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="absolute w-3 h-3 bg-cobalt rounded-full shadow-lg shadow-cobalt/50"
      animate={{
        x: [0, 100, -50, 80, 0],
        y: [0, -80, 60, -40, 0],
        scale: [1, 1.2, 0.8, 1.1, 1],
        opacity: [0.6, 0.9, 0.4, 0.8, 0.6],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        filter: 'blur(0.5px)',
        boxShadow: '0 0 20px rgba(0, 71, 171, 0.6), 0 0 40px rgba(0, 71, 171, 0.3)',
      }}
    >
      {/* Spark trail effect */}
      <motion.div
        className="absolute inset-0 bg-cobalt/30 rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
};

// Word-by-word animated headline
const AnimatedHeadline = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const words = ["Your", "Hands", "Create", "the", "Art.", "Let", "AI", "Tell", "the", "Story."];
  
  // Define which words should be highlighted
  const highlightWords = ["Hands", "Art.", "AI", "Story."];
  
  return (
    <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-black mb-8 leading-[1.2] tracking-tight">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`inline-block mr-6 ${
            highlightWords.includes(word) 
              ? "text-transparent bg-gradient-to-r from-gray-100 to-white bg-clip-text" 
              : "text-charcoal"
          }`}
          initial={{ opacity: 0, y: 50, rotateX: 90 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.3,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {word}
          {index === 4 && <br />} {/* Line break after "Art." */}
        </motion.span>
      ))}
    </h1>
  );
};

interface Phase {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { scrollY } = useScroll();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Parallax transforms for hero section
  const heroTextY = useTransform(scrollY, [0, 800], [0, -200]);
  const heroOpacity = useTransform(scrollY, [600, 1000], [1, 0]); // Later fade out
  
  if (!mounted) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-playfair text-charcoal">Loading...</div>
        </div>
      </main>
    );
  }
  
  const phases = [
    {
      title: "The Blueprint",
      subtitle: "Foundation & Design", 
      description: "Create the complete visual and structural foundation with empathetic simplicity for local artisans.",
      icon: "🎨",
      color: "border-blue-200",
      features: [
        "Wireframe three core screens",
        "Initialize Next.js frontend",
        "Build static shell with component library",
        "Establish mini design system"
      ]
    },
    {
      title: "The Core Loop",
      subtitle: "Bringing Life to Journey",
      description: "Breathe life into the core user journey with functional image upload and AI-powered storytelling.",
      icon: "⚡",
      color: "border-green-200",
      features: [
        "Functional image upload system",
        "AI story generation integration",
        "Results display with loading states",
        "One-click copy to clipboard"
      ]
    },
    {
      title: "The Wow Factor",
      subtitle: "Unique Features & Polish",
      description: "Integrate secret weapons like QR story tags, pricing oracle, and global voice translation.",
      icon: "✨",
      color: "border-purple-200",
      features: [
        "QR Story Tag generation",
        "AI-powered pricing suggestions", 
        "Multi-language translation",
        "Mobile-responsive polish"
      ]
    }
  ]

  return (
    <main className="min-h-screen overflow-hidden" suppressHydrationWarning>
      
      {/* HERO SECTION: THE SPARK OF CREATION */}
      <section className="relative h-screen overflow-hidden">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0">
          {/* Beautiful radial gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: '#ffffff',
              opacity: 0.9,
              backgroundImage: 'radial-gradient(circle at center center, #a5a097, #ffffff), repeating-radial-gradient(circle at center center, #a5a097, #a5a097, 40px, transparent 80px, transparent 40px)',
              backgroundBlendMode: 'multiply'
            }}
          />
          
          {/* Paper texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 animate-paper-texture"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='13' cy='3' r='1'/%3E%3Ccircle cx='23' cy='11' r='1'/%3E%3Ccircle cx='31' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating AI Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4">
            <FloatingAISparkle />
          </div>
          <div className="absolute top-1/3 right-1/3">
            <FloatingAISparkle />
          </div>
          <div className="absolute bottom-1/3 left-1/2">
            <FloatingAISparkle />
          </div>
        </div>

        {/* Hero Content with Parallax */}
        <motion.div 
          className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <div className="text-center max-w-6xl mx-auto">
            <div className="px-8 pt-8 pb-12 border-2 border-charcoal/20 rounded-3xl bg-white/30 backdrop-blur-sm shadow-2xl shadow-charcoal/20 mb-12 overflow-visible">
              <AnimatedHeadline />
            </div>
            
            {/* Subtitle with ink flow animation */}
            <motion.p 
              className="text-xl md:text-3xl text-charcoal/80 max-w-4xl mx-auto mb-12 leading-relaxed font-inter font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 2.5,
                ease: [0.25, 0.4, 0.25, 1]
              }}
            >
              Where ancient craftsmanship meets{" "}
              <motion.span 
                className="relative inline-block text-cobalt font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 3.0 }}
              >
                AI innovation
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-cobalt block"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 3.2 }}
                />
              </motion.span>
              {", creating digital stories that echo through generations"}
            </motion.p>

            {/* Elegant CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 1, 
                delay: 3.5,
                ease: [0.25, 0.4, 0.25, 1]
              }}
            >
              <motion.button
                className="bg-terracotta text-paper px-10 py-4 rounded-full font-inter font-medium text-lg shadow-2xl shadow-terracotta/30 transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/upload')}
              >
                <span className="relative z-10">Experience the Magic</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cobalt to-terracotta"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                className="text-charcoal font-inter font-medium text-lg flex items-center gap-2 group"
                whileHover={{ x: 5 }}
              >
                Watch Our Story
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-charcoal/50 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* THE UNHEARD STORY SECTION */}
      <ProblemSection />

      {/* INTERACTIVE SOLUTION DEMO */}
      <SolutionDemo />

      {/* LIVING WORKBENCH FEATURES */}
      <FeaturesSection />

      {/* INTERACTIVE GALLERY FINALE */}
      <MissionSection />

      {/* Custom Scrollbars with Background */}
      <ScrollbarBackground position="right" />
      <ScrollbarBackground position="left" />
      <CustomScrollbar color="rgba(0, 0, 0, 0.8)" thickness={2} position="right" />
      <CustomScrollbar color="rgba(0, 0, 0, 0.8)" thickness={2} position="left" />

      {/* Artistic Cursor */}
      <ArtisticCursor />

    </main>
  )
}

// Problem Section Component - "The Unheard Story" 
const ProblemSection = () => {
  const [mounted, setMounted] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { scrollY } = useScroll();
  const sectionOpacity = useTransform(scrollY, [1800, 3000], [1, 0]); // Much later and gradual fade out
  const inkSmudgeScale = useTransform(scrollY, [1300, 1500], [1, 1.2]);
  const inkSmudgeOpacity = useTransform(scrollY, [1300, 1500], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-paper py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-8">
              The Unheard Story
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative min-h-screen bg-paper py-32 overflow-hidden">
      {/* Custom geometric pattern background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#ffffff',
          opacity: 0.4,
          background: 'linear-gradient(135deg, #a5a09755 25%, transparent 25%) -40px 0/ 80px 80px, linear-gradient(225deg, #a5a097 25%, transparent 25%) -40px 0/ 80px 80px, linear-gradient(315deg, #a5a09755 25%, transparent 25%) 0px 0/ 80px 80px, linear-gradient(45deg, #a5a097 25%, #ffffff 25%) 0px 0/ 80px 80px'
        }}
      />

      {/* Ink smudge transition effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{ scale: inkSmudgeScale, opacity: inkSmudgeOpacity }}
      >
        <div 
          className="absolute inset-0 bg-gradient-radial from-charcoal/20 via-transparent to-transparent"
          style={{
            background: `radial-gradient(circle at center, rgba(44, 44, 44, 0.3) 0%, rgba(44, 44, 44, 0.1) 30%, transparent 70%)`
          }}
        />
      </motion.div>
      
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ opacity: sectionOpacity }}
      >
        <div className="text-center space-y-20">
          {/* First Statement - Slide from Left */}
          <motion.div
            initial={{ opacity: 0, x: -120, rotateY: 15 }}
            animate={inView ? { 
              opacity: 1, 
              x: 0, 
              rotateY: 0,
            } : {}}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              ease: [0.25, 0.4, 0.25, 1]
            }}
            className="relative p-8 border-2 border-charcoal/20 rounded-3xl bg-white/30 backdrop-blur-sm shadow-2xl shadow-charcoal/20"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-charcoal mb-6 leading-tight">
              Millions of artisans
            </h2>
            <motion.p 
              className="text-2xl md:text-3xl text-charcoal/70 font-inter font-light"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              possess <span className="text-terracotta font-medium">timeless skills</span>
            </motion.p>
            
            {/* Decorative ink dot */}
            <motion.div
              className="absolute -right-8 top-8 w-4 h-4 bg-terracotta rounded-full opacity-60"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="p-8 border-2 border-charcoal/20 rounded-3xl bg-white/30 backdrop-blur-sm shadow-2xl shadow-charcoal/20"
          >
            <h2 className="text-5xl md:text-7xl font-playfair font-bold text-charcoal mb-6">
              But their stories
            </h2>
            <p className="text-2xl text-charcoal/70 font-inter">get lost in the digital noise</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="pt-16 p-8 border-2 border-charcoal/20 rounded-3xl bg-white/30 backdrop-blur-sm shadow-2xl shadow-charcoal/20"
          >
            <h2 className="text-6xl md:text-8xl font-playfair font-black text-terracotta mb-8">
              Their art deserves
            </h2>
            <h2 className="text-6xl md:text-8xl font-playfair font-black text-cobalt">
              a louder voice
            </h2>
          </motion.div>

          {/* Dusty corner image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 2 }}
            className="pt-16 p-8 border-2 border-charcoal/20 rounded-3xl bg-white/30 backdrop-blur-sm shadow-2xl shadow-charcoal/20"
          >
            <div className="mx-auto w-96 h-64 bg-gradient-to-br from-terracotta/10 to-charcoal/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-6xl">?????</div>
            </div>
            <p className="mt-4 text-charcoal/50 font-inter italic">Beautiful crafts, waiting to be discovered...</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// Solution Demo Component - "The Interactive Magic Reveal"
const SolutionDemo = () => {
  const [mounted, setMounted] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { scrollY } = useScroll();
  
  // Calculate scroll progress for this section
  const sectionProgress = useTransform(scrollY, [1400, 2200], [0, 1]);
  const phoneRotateY = useTransform(sectionProgress, [0, 0.33, 0.66, 1], [15, -5, 10, 0]);
  const phoneScale = useTransform(sectionProgress, [0, 1], [0.8, 1]);
  
  // Step-based animations
  const step1Opacity = useTransform(sectionProgress, [0, 0.25], [0, 1]);
  const step2Opacity = useTransform(sectionProgress, [0.25, 0.5], [0, 1]);  
  const step3Opacity = useTransform(sectionProgress, [0.5, 0.75], [0, 1]);
  
  // Phone screen content based on scroll progress
  const currentStep = useTransform(sectionProgress, [0, 0.33, 0.66, 1], [1, 2, 3, 3]);
  
  // Step background colors
  const step1BgColor = useTransform(sectionProgress, [0, 0.33], ['rgba(224, 122, 95, 0.1)', 'rgba(224, 122, 95, 0.05)']);
  const step2BgColor = useTransform(sectionProgress, [0.33, 0.66], ['rgba(0, 71, 171, 0.1)', 'rgba(0, 71, 171, 0.05)']);
  const step3BgColor = useTransform(sectionProgress, [0.66, 1], ['rgba(224, 122, 95, 0.1)', 'rgba(224, 122, 95, 0.05)']);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-gradient-to-b from-paper via-cobalt/5 to-paper py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-6">
              Watch Magic Happen
            </h2>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section ref={ref} className="relative min-h-[120vh] bg-gradient-to-br from-paper via-cobalt/5 to-terracotta/5 overflow-hidden">
      {/* Custom dot pattern background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#ffffff',
          opacity: 0.4,
          backgroundImage: 'radial-gradient(#a5a097 2px, #ffffff 2px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Text content */}
            <div className="space-y-8">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-6 leading-tight">
                  Watch the
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-terracotta to-cobalt bg-clip-text">
                    Magic Unfold
                  </span>
                </h2>
                <p className="text-xl text-charcoal/70 font-inter font-light">
                  See how KalaConnect transforms a simple photo into a compelling story in three magical steps.
                </p>
              </motion.div>

              {/* Step 1 */}
              <motion.div
                className="flex items-start gap-6 p-6 rounded-2xl transition-all duration-500"
                style={{ 
                  opacity: step1Opacity,
                  backgroundColor: step1BgColor
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-terracotta rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-charcoal mb-2">
                    Capture Your Craft
                  </h3>
                  <p className="text-lg text-charcoal/70 font-inter">
                    Simply take a photo of your beautiful creation with one tap. Our interface is designed for artisans of all technical backgrounds.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="flex items-start gap-6 p-6 rounded-2xl transition-all duration-500"
                style={{ 
                  opacity: step2Opacity,
                  backgroundColor: step2BgColor
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-cobalt rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-charcoal mb-2">
                    Share Your Inspiration  
                  </h3>
                  <p className="text-lg text-charcoal/70 font-inter">
                    Our AI asks thoughtful questions about your craft, your inspiration, and your story. Just speak naturally - we handle the rest.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="flex items-start gap-6 p-6 rounded-2xl transition-all duration-500"
                style={{ 
                  opacity: step3Opacity,
                  backgroundColor: step3BgColor
                }}
              >
                <div className="flex-shrink-0 w-12 h-12  bg-cobalt rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-charcoal mb-2">
                    Unleash Your Story
                  </h3>
                  <p className="text-lg text-charcoal/70 font-inter">
                    Watch as your story comes to life with perfect captions, hashtags, and pricing suggestions. Ready to share with the world!
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right side - 3D Floating Phone */}
            <div className="flex justify-center items-center relative">
              <motion.div
                className="relative w-[300px] h-[600px] mx-auto"
                style={{ 
                  rotateY: phoneRotateY,
                  scale: phoneScale,
                  perspective: "1000px"
                }}
                animate={inView ? {
                  y: [0, -10, 0],
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/90 to-charcoal rounded-[2.5rem] shadow-2xl p-2">
                  {/* Screen */}
                  <div className="w-full h-full bg-paper rounded-[2rem] overflow-hidden relative shadow-inner">
                    
                    {/* Screen Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                    
                    {/* Dynamic Content Based on Scroll */}
                    <PhoneContent step={currentStep} />
                  </div>
                </div>

                {/* Phone Highlights */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-charcoal/30 rounded-full" />
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 border-2 border-charcoal/20 rounded-full" />

                {/* Floating Elements Around Phone */}
                <motion.div
                  className="absolute -top-8 -left-8 w-6 h-6 bg-terracotta/30 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: 1
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-12 -right-12 w-8 h-8 bg-cobalt/20 rounded-full"
                  animate={{
                    y: [0, 15, 0], 
                    x: [0, -15, 0],
                    scale: [1, 0.8, 1],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: 2
                  }}
                />
                
                <motion.div
                  className="absolute top-1/2 -right-16 w-4 h-4 bg-terracotta/40 rounded-full"
                  animate={{
                    y: [0, -25, 0],
                    x: [0, 20, 0], 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Phone Content Component
const PhoneContent = ({ step }: { step: any }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 p-6 flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-6 text-xs text-charcoal/60">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-charcoal/60 rounded-full" />
          <div className="w-1 h-1 bg-charcoal/60 rounded-full" />
          <div className="w-1 h-1 bg-charcoal/60 rounded-full" />
        </div>
      </div>

      {/* App Header */}
      <div className="text-center mb-8">
        <div className="text-2xl font-playfair font-bold text-charcoal mb-2">KalaConnect</div>
        <div className="text-sm text-charcoal/60 font-inter">✨ Your Story, Amplified</div>
      </div>

      {/* Dynamic Content */}
      <motion.div
        key={Math.floor(step.get())}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {step.get() <= 1.5 ? <Step1Content /> : 
         step.get() <= 2.5 ? <Step2Content /> : 
         <Step3Content />}
      </motion.div>
    </div>
  );
};

// Step Content Components
const Step1Content = () => (
  <div className="text-center">
    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-terracotta/10 to-cobalt/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-terracotta/30">
      <span className="text-4xl">📸</span>
    </div>
    <div className="text-lg font-inter text-charcoal mb-2">Capture Your Creation</div>
    <div className="text-sm text-charcoal/60 mb-6">Tap to take a photo of your craft</div>
    <motion.div 
      className="w-full h-12 bg-terracotta rounded-lg flex items-center justify-center text-white font-medium"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Take Photo
    </motion.div>
  </div>
);

const Step2Content = () => (
  <div>
    <div className="mb-4">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-terracotta/20 to-cobalt/20 rounded-xl flex items-center justify-center">
        <span className="text-2xl">🏺</span>
      </div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="bg-cobalt/10 rounded-lg p-3">
        <div className="text-sm font-medium text-cobalt mb-1">AI Assistant:</div>
        <div className="text-sm text-charcoal/80">"Tell me about this beautiful piece. What inspired you to create it?"</div>
      </div>
      <div className="bg-terracotta/10 rounded-lg p-3 ml-6">
        <div className="text-sm text-charcoal/80">"This pottery represents my grandmother's traditional techniques..."</div>
      </div>
    </div>
    <motion.div 
      className="w-full h-10 bg-cobalt rounded-lg flex items-center justify-center text-white text-sm"
      animate={{ opacity: [1, 0.7, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🎤 Recording your story...
    </motion.div>
  </div>
);

const Step3Content = () => (
  <div className="space-y-4">
    <div className="text-center mb-4">
      <div className="text-lg font-playfair font-bold text-charcoal mb-2">✨ Your Story is Ready!</div>
    </div>
    
    <div className="bg-white rounded-lg p-4 shadow-sm border border-terracotta/10">
      <div className="w-full h-24 bg-gradient-to-br from-terracotta/5 to-cobalt/5 rounded-lg mb-3 flex items-center justify-center">
        <span className="text-3xl">🏺</span>
      </div>
      <div className="text-sm font-medium text-charcoal mb-2">
        "Handcrafted with love, this piece carries generations of wisdom..."
      </div>
      <div className="text-xs text-cobalt">#handmade #pottery #heritage #artisan</div>
    </div>
    
    <div className="flex gap-2">
      <motion.div 
        className="flex-1 h-10 bg-gradient-to-r from-terracotta to-cobalt rounded-lg flex items-center justify-center text-white text-sm font-medium"
        whileHover={{ scale: 1.02 }}
      >
        Share Story
      </motion.div>
      <motion.div 
        className="w-10 h-10 bg-charcoal/10 rounded-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
      >
        📋
      </motion.div>
    </div>
  </div>
);

// Features Section Component - "The Living Workbench"
const FeaturesSection = () => {
  const [mounted, setMounted] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-paper via-terracotta/5 to-cobalt/10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-6">
              The Living Workbench
            </h2>
          </div>
        </div>
      </section>
    );
  }

  const features = [
    {
      id: 1,
      title: "AI Story Generator",
      description: "Transform photos into compelling narratives with context-aware AI",
      icon: "https://img.icons8.com/pulsar-color/48/story-book.png",
      size: "large" // Takes 2x2 grid space
    },
    {
      id: 2,
      title: "Smart Upload",
      description: "One-click photo upload with automatic enhancement",
      icon: "https://img.icons8.com/carbon-copy/100/apple-camera.png",
      size: "medium"
    },
    {
      id: 3,
      title: "Global Translation",
      description: "Share your story in 50+ languages instantly",
      icon: "https://img.icons8.com/pastel-glyph/64/translation.png",
      size: "medium"
    },
    {
      id: 4,
      title: "Pricing Oracle",
      description: "AI-powered price suggestions based on craft value and market data",
      icon: "https://img.icons8.com/wired/64/tags.png",
      size: "large" 
    },
    {
      id: 5,
      title: "QR Story Tags",
      description: "Generate unique QR codes that link to your craft's story",
      icon: "https://img.icons8.com/pastel-glyph/64/qr-code--v2.png",
      size: "medium"
    },
    {
      id: 6,
      title: "Voice Notes",
      description: "Record your inspiration and let AI craft the perfect caption",
      icon: "https://img.icons8.com/ios/50/voice-memos--v1.png", 
      size: "medium"
    },
    {
      id: 7,
      title: "Heritage Stories",
      description: "Connect your craft to its cultural and historical roots",
      icon: "https://img.icons8.com/ios/50/unesco--v1.png",
      size: "tall"
    },
    {
      id: 8,
      title: "Social Optimizer",
      description: "Perfect hashtags and posting times for maximum reach",
      icon: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/external-optimize-customer-relationship-and-employee-benefits-flatart-icons-outline-flatarticons.png",
      size: "wide"
    }
  ];

  return (
    <section ref={ref} className="relative min-h-screen bg-gradient-to-br from-cobalt/5 via-paper to-terracotta/5 py-32 overflow-hidden">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] backdrop-blur-md"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v30h30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Geometric Pattern */}
      <AnimatedPattern opacity={0.7} speed={20} className="pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          {/* Beautiful Card Container for Title and Description */}
          <motion.div
            className="backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-12 mb-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
            }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl lg:text-7xl font-playfair font-black text-white mb-6 leading-tight drop-shadow-2xl"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              The Living Workbench
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-charcoal/80 font-inter font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              A symphony of AI-powered tools that breathe life into your artisan journey,
              each feature dancing in harmony to amplify your craft's voice
            </motion.p>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-cobalt to-terracotta rounded-full opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-terracotta to-cobalt rounded-full opacity-40"></div>
          </motion.div>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6 auto-rows-[160px]">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.id}
              feature={feature}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Individual Feature Card Component
const FeatureCard = ({ feature, index, inView }: { 
  feature: any; 
  index: number; 
  inView: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Grid sizing based on feature size
  const getGridClasses = (size: string) => {
    switch(size) {
      case 'large': return 'col-span-6 row-span-2';  // 2x2
      case 'wide': return 'col-span-8 row-span-2';   // wide rectangle (increased height)
      case 'tall': return 'col-span-4 row-span-2';   // tall rectangle  
      case 'medium':
      default: return 'col-span-4 row-span-2';       // standard rectangle (increased height)
    }
  };

  return (
    <motion.div
      className={`${getGridClasses(feature.size)} group relative`}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={inView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <motion.div
        className={`
          h-full w-full rounded-2xl lg:rounded-3xl relative overflow-hidden cursor-pointer
          p-8 border-2 border-charcoal/20 bg-white/30 backdrop-blur-md 
          shadow-2xl shadow-charcoal/20 hover:shadow-3xl
          transition-all duration-500 ease-out
        `}
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -4 : 0,
        }}
        whileHover={{
          boxShadow: '0 25px 60px rgba(44, 44, 44, 0.3)'
        }}
      >
        {/* Simple border highlight on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent"
          animate={isHovered ? {
            borderColor: 'rgba(0, 71, 171, 0.2)'
          } : {
            borderColor: 'transparent'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative flex flex-col h-full">
          
          {/* Header: Icon and Title Side by Side */}
          <div className={`flex items-center gap-4 ${feature.size === 'medium' ? 'mb-2' : 'mb-4'}`}>
            <motion.div
              className="w-12 h-12 lg:w-14 lg:h-14 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg flex items-center justify-center"
              animate={isHovered ? {
                scale: 1.1
              } : {}}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {feature.icon.startsWith('http') ? (
                <img 
                  src={feature.icon} 
                  alt={feature.title}
                  className="w-6 h-6 lg:w-8 lg:h-8"
                />
              ) : (
                <span className="text-xl lg:text-2xl">{feature.icon}</span>
              )}
            </motion.div>
            
            <motion.h3 
              className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight drop-shadow-lg flex-1"
              style={{ 
                color: '#4a2c2a',
                fontFamily: 'Montserrat, sans-serif'
              }}
              animate={isHovered ? {
                scale: 1.05,
                x: 5
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {feature.title}
            </motion.h3>
          </div>
          
          {/* Large Description Box */}
          <div className="flex-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg h-full p-4 flex flex-col">
              <motion.p 
                className="text-lg lg:text-xl text-charcoal/90 font-inter font-medium leading-relaxed text-left mb-1.5"
                animate={isHovered ? {
                  y: -2,
                  opacity: 1
                } : {}}
              >
                {feature.description}
              </motion.p>
              
              {/* Additional content based on feature type */}
              <div className="flex-1 flex flex-col justify-end">
                {feature.id === 1 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Context-aware storytelling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Multi-style narrative generation</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 2 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Organized by categories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Smart cropping</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 3 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Real-time translation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Cultural context preservation</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 4 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Market trend analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Regional pricing data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Craft complexity assessment</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 5 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Instant QR generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Trackable engagement</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 6 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Voice-to-text conversion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>AI caption enhancement</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 7 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Historical context research</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Cultural significance mapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Artisan lineage tracking</span>
                    </div>
                  </div>
                )}
                
                {feature.id === 8 && (
                  <div className="text-base text-charcoal/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Optimal posting schedule</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Trending hashtag suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cobalt rounded-full"></div>
                      <span>Audience engagement insights</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full"
            style={{ color: feature.id % 2 === 0 ? '#0047AB' : '#E07A5F' }}
            animate={isHovered ? {
              scale: [1, 1.5, 1.2],
              opacity: [0.5, 1, 0.8]
            } : {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Subtle gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl lg:rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at center, ${feature.id % 2 === 0 ? 'rgba(0, 71, 171, 0.05)' : 'rgba(224, 122, 95, 0.05)'}, transparent)`
          }}
        />
        
        {/* Particles on hover */}
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  backgroundColor: feature.id % 2 === 0 ? '#0047AB' : '#E07A5F',
                  left: `${20 + i * 25}%`,
                  top: `${15 + i * 10}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// Mission Section - "Preserving Culture. Empowering Creators. Connecting Worlds."
const MissionSection = () => {
  const [mounted, setMounted] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-terracotta/10 via-paper to-cobalt/10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-6">
              Our Mission
            </h2>
          </div>
        </div>
      </section>
    );
  }

  // Diverse Indian crafts data
  const indianCrafts = [
    {
      name: "Madhubani Art",
      region: "Bihar",
      emoji: "�",
      image: "/images/madhubaniart.jpg",
      color: "#dc2626",
      description: "Ancient folk art with intricate patterns"
    },
    {
      name: "Blue Pottery",
      region: "Jaipur",
      emoji: "🏺",
      image: "/images/bluepottery.jpg",
      color: "#0047AB",
      description: "Stunning cobalt ceramics"
    },
    {
      name: "Starry Night",
      region: "Europe",
      emoji: "🌌",
      image: "/images/Starrynights.jpg",
      color: "#f59e0b",
      description: "Swirling post-impressionist masterpiece"
    },
    {
      name: "Warli Art",
      region: "Maharashtra",
      emoji: "🖼️",
      image: "/images/warliart.jpg",
      color: "#92400e",
      description: "Tribal wall paintings"
    },
    {
      name: "Guernica",
      region: "Spain",
      emoji: "🖼️",
      image: "/images/guernica.jpg",
      color: "#059669",
      description: "Bold cubist statement"
    },
    {
      name: "Kantha Embroidery",
      region: "Bengal",
      emoji: "🧵",
      image: "/images/kanthaembroidery.jpg",
      color: "#E07A5F",
      description: "Running stitch storytelling"
    },
    {
      name: "The Great Wave",
      region: "Japan",
      emoji: "🌊",
      image: "/images/greatwave.jpg",
      color: "#E07A5F",
      description: "Iconic woodblock print"
    },
    {
      name: "Tanjore Painting",
      region: "Tamil Nadu",
      emoji: "✨",
      image: "/images/tanjore.jpg",
      color: "#f59e0b",
      description: "Gold leaf masterpieces"
    },
    {
      name: "Raku Pottery",
      region: "Japan",
      emoji: "🏺",
      image: "/images/rakupottery.jpg",
      color: "#0047AB",
      description: "Fire-forged ceramic beauty"
    },
    {
      name: "Kalamkari",
      region: "Andhra Pradesh",
      emoji: "�️",
      image: "/images/kalamkari.jpg",
      color: "#059669",
      description: "Hand-painted textile art"
    },
    {
      name: "Classical Sculpture",
      region: "Ancient World",
      emoji: "🗿",
      image: "/images/Sculpture.jpg",
      color: "#92400e",
      description: "Timeless stone artistry"
    },
    
    {
      name: "Dhokra Art",
      region: "West Bengal",
      emoji: "🔥",
      image: "/images/dhokra.jpg",
      color: "#7c2d12",
      description: "Lost-wax bronze casting"
    },
     {
      name: "Girl with Pearl Earring",
      region: "Netherlands",
      emoji: "💎",
      image: "/images/pearlearring.jpg",
      color: "#7c2d12",
      description: "Luminous portrait masterpiece"
    },
    
    
    
    {
      name: "Chikankari",
      region: "Lucknow",
      emoji: "🪡",
      image: "/images/chikankari.jpg",
      color: "#f5f5f5",
      description: "Delicate white embroidery"
    },
    {
      name: "Bidriware",
      region: "Karnataka",
      emoji: "⚫",
      image: "/images/bidri.jpg",
      color: "#374151",
      description: "Inlaid metalwork"
    },
    
    
    
    
   
  ];

  return (
    <section ref={ref} className="relative min-h-screen bg-gradient-to-br from-terracotta/10 via-paper to-cobalt/10 py-32 overflow-hidden">
      
      {/* Custom dot pattern background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#ffffff',
          opacity: 0.4,
          backgroundImage: 'radial-gradient(#a5a097 2px, #ffffff 2px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Diverse Indian Crafts Collage */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-16">
            {indianCrafts.map((craft, index) => (
              <motion.div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${craft.color}20, ${craft.color}10)`
                }}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {/* Craft Image or Emoji */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {craft.image ? (
                    <motion.div 
                      className="w-full h-full rounded-2xl overflow-hidden"
                      animate={{ 
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3 + index * 0.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <img 
                        src={craft.image} 
                        alt={craft.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.span 
                      className="text-4xl md:text-6xl"
                      animate={{ 
                        rotate: [0, -5, 5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3 + index * 0.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {craft.emoji}
                    </motion.span>
                  )}
                </div>

                {/* Craft Info on Hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                >
                  <div className="text-white text-center">
                    <h4 className="font-playfair font-bold text-sm md:text-base">{craft.name}</h4>
                    <p className="font-inter text-xs opacity-80">{craft.region}</p>
                  </div>
                </motion.div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: craft.color,
                        left: `${20 + i * 25}%`,
                        top: `${15 + i * 20}%`,
                        opacity: 0.6
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: index * 0.2 + i * 0.3
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Centered Mission Statement */}
        <motion.div
          className="text-center mb-20 overflow-visible"
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-playfair font-black text-charcoal mb-8 py-4"
            style={{ lineHeight: '1.4' }}
            initial={{ scale: 0.8 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.span
              className="inline-block text-transparent bg-gradient-to-r from-terracotta via-cobalt to-terracotta bg-clip-text"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Preserving Culture.
            </motion.span>
            <br />
            <motion.span
              className="inline-block text-transparent bg-gradient-to-r from-cobalt via-terracotta to-cobalt bg-clip-text"
              animate={{ 
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%']
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.3
              }}
            >
              Empowering Creators.
            </motion.span>
            <br />
            <motion.span
              className="inline-block text-transparent bg-gradient-to-r from-terracotta via-cobalt to-terracotta bg-clip-text"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.6
              }}
            >
              Connecting Worlds.
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
          >
            {/* Cultural pattern background */}
            <motion.div
              className="absolute inset-0 -m-8"
              initial={{ opacity: 0, rotate: -5 }}
              animate={inView ? { 
                opacity: [0, 0.6, 0.4],
                rotate: [-5, 2, 0],
                scale: [0.8, 1.1, 1]
              } : {}}
              transition={{ 
                duration: 2,
                delay: 2,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              style={{
                background: `conic-gradient(from 0deg at 50% 50%, 
                  rgba(224, 122, 95, 0.1) 0deg,
                  rgba(0, 71, 171, 0.1) 120deg,
                  rgba(224, 122, 95, 0.1) 240deg,
                  rgba(0, 71, 171, 0.1) 360deg)`
              }}
            />

            {/* Main CTA Button */}
            <motion.button
              onClick={() => router.push('/upload')}
              className="relative bg-blue-600 text-white px-16 py-6 rounded-full font-playfair font-bold text-2xl shadow-2xl transition-all duration-500 group overflow-hidden hover:bg-blue-700"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 80px rgba(37, 99, 235, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Begin Your Story
                <motion.span
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </span>

              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cobalt to-terracotta"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </motion.div>

          <motion.p 
            className="mt-8 text-lg text-charcoal/60 font-inter italic"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 2.5 }}
          >
            Join thousands of artisans preserving our rich cultural heritage through AI
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Individual Artwork Card Component
const ArtworkCard = ({ artwork, index }: { artwork: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStyleAnimation = (style: string) => {
    switch(style) {
      case 'swirling':
        return {
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        };
      case 'sculptural':
        return {
          rotateY: [0, 10, -10, 0],
          scale: [1, 1.03, 1],
          z: [0, 20, 0]
        };
      case 'flowing': 
        return {
          x: [0, 3, -3, 0],
          y: [0, -2, 2, 0]
        };
      case 'traditional':
        return {
          scale: [1, 1.02, 1.01, 1],
          rotate: [0, 1, -1, 0.5, 0],
          filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
        };
      case 'angular':
        return {
          rotate: [0, 2, -2, 1, 0]
        };
      case 'ceramic':
        return {
          scale: [1, 1.01, 0.99, 1],
          rotateX: [0, 2, -2, 0],
          filter: ['sepia(0)', 'sepia(0.1)', 'sepia(0)']
        };
      case 'soft':
        return {
          scale: [1, 1.02, 1],
          opacity: [1, 0.9, 1]
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="flex-shrink-0 w-80 group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      {/* Artwork Frame */}
      <motion.div
        className="relative bg-gradient-to-br from-paper to-white rounded-2xl p-6 shadow-xl border border-terracotta/10 mb-4 overflow-hidden"
        animate={isHovered ? {
          scale: 1.02,
          y: -5
        } : {}}
        whileHover={{
          boxShadow: "0 20px 60px rgba(224, 122, 95, 0.15)"
        }}
      >
        {/* Artwork Display */}
        <div className="w-full h-48 bg-gradient-to-br from-charcoal/5 to-cobalt/5 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
          
          {/* Animated style emanations */}
          {isHovered && (
            <div className="absolute inset-0">
              {artwork.colors.map((color: string, i: number) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: color,
                    width: '8px',
                    height: '8px',
                    left: `${20 + i * 20}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    opacity: 0.3
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 2, 4],
                    opacity: [0, 0.4, 0],
                    x: [(i - 1) * -20, (i - 1) * 20],
                    y: [-10, 10]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}

          {/* Main artwork image or emoji */}
          {artwork.image ? (
            <motion.img
              src={artwork.image}
              alt={artwork.name}
              className="w-full h-full object-cover rounded-lg relative z-10"
              animate={isHovered ? getStyleAnimation(artwork.style) : {}}
              transition={{
                duration: 3,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ) : (
            <motion.div
              className="text-8xl relative z-10"
              animate={isHovered ? getStyleAnimation(artwork.style) : {}}
              transition={{
                duration: 3,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {artwork.emoji}
            </motion.div>
          )}
        </div>

        {/* Artwork Info */}
        <div className="text-center">
          <h3 className="text-xl font-playfair font-bold text-charcoal mb-1">
            {artwork.name}
          </h3>
          <p className="text-charcoal/60 font-inter mb-2">
            {artwork.artist} • {artwork.year}
          </p>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-terracotta/20 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cobalt/20 rounded-bl-lg" />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="bg-charcoal text-white p-4 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={isHovered ? { 
          opacity: 1, 
          y: 0, 
          scale: 1 
        } : { 
          opacity: 0, 
          y: 10, 
          scale: 0.9 
        }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-inter leading-relaxed">
          {artwork.description}
        </p>
      </motion.div>
    </motion.div>
  );
};