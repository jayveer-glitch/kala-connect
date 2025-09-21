'use client'

import { useState, useEffect } from 'react';
import { Lora, Inter } from 'next/font/google';

// --- ELEGANT TYPOGRAPHY SETUP ---
const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500'],
  variable: '--font-inter'
});

const lora = Lora({ 
  subsets: ['latin'], 
  weight: ['400'], 
  style: ['normal', 'italic'],
  variable: '--font-lora'
});

// --- TYPE DEFINITION ---
interface StoryData {
  id: string;
  title: string;
  image: string;
  story: string;
  aiDescription: string;
  artisanName?: string;
  createdAt?: string;
}

// --- STATIC DATA FOR THE PROTOTYPE ---
const storyData: StoryData = {
  id: "demo-story-123",
  title: "Whispers of the Ancient Oak",
  image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  aiDescription: "This appears to be a magnificent ancient oak tree, captured in golden morning light. The weathered bark tells stories of countless seasons, while the interplay of light and shadow creates a natural cathedral effect.",
  artisanName: "Sarah Chen",
  createdAt: "September 2025",
  story: `In the heart of an ancient forest, where sunlight filters through centuries-old canopies, stands a magnificent oak tree that has witnessed the passage of time itself. This majestic guardian has weathered countless seasons, its gnarled branches reaching toward the heavens like weathered hands in prayer.

The artist discovered this silent sentinel during a morning walk, when golden light danced through the mist and illuminated the tree's textured bark. Each groove and ridge tells a story of resilience, of storms survived and seasons embraced. The interplay of light and shadow creates a natural cathedral, where the sacred and the earthly meet in perfect harmony.

Local legends speak of this tree as a keeper of secrets, where travelers would pause to share their burdens and dreams. The artist was drawn to capture not just the physical presence of this ancient being, but the spiritual essence that seems to emanate from its very core. In the gentle morning light, the oak appears to glow from within, as if holding the wisdom of ages in its wooden heart.

This piece represents the eternal dialogue between humanity and nature, the quiet strength that comes from deep roots, and the beauty found in the marks that time leaves upon us all. Like the oak, we too can find grace in our weathered surfaces and strength in our ability to bend without breaking.`
};

// --- MAIN SINGLE COLUMN COMPONENT ---
export default function PublicStoryPage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!imageLoaded) {
        setImageLoaded(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [imageLoaded]);

  return (
    <>
      <main className={`${inter.variable} ${lora.variable} relative overflow-hidden bg-gradient-to-br from-cream via-white to-gray-50`}>
        <ScrollProgress />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Floating Image */}
          <div className="float-left mr-10 mb-8 w-full sm:w-96 lg:w-[500px]">
            <img
              src={storyData.image}
              alt={storyData.title}
              className={`w-full h-auto object-cover aspect-square rounded-2xl shadow-2xl transition-opacity duration-1000 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Content that wraps around the image */}
          <div className="space-y-8">
            
            {/* Title Section */}
            <div>
              <h1 className="text-charcoal text-4xl lg:text-5xl font-light leading-tight mb-4">
                {storyData.title}
              </h1>
              {storyData.artisanName && (
                <p className="text-charcoal/70 text-lg mb-6">
                  by {storyData.artisanName} • {storyData.createdAt}
                </p>
              )}
              <div className="w-20 h-px bg-terracotta"></div>
            </div>

            {/* AI Insight */}
            {/* <div>
              <div className="bg-white/40 rounded-lg p-6 border border-black/5 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V3.25A.75.75 0 0110 2.5zM7.5 6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0V6.25zM12.5 6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0V6.25zM4.5 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm10.25.75a.75.75 0 000-1.5h-3.5a.75.75 0 000 1.5h3.5zM6.53 13.47a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 01-1.06-1.06l2.5-2.5a.75.75 0 011.06 0zm6.94 0a.75.75 0 011.06 0l2.5 2.5a.75.75 0 11-1.06 1.06l-2.5-2.5a.75.75 0 010-1.06z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-terracotta font-medium text-sm uppercase tracking-wider mb-2">
                      AI Insight
                    </h3>
                    <p className="font-serif text-charcoal/80 text-lg leading-relaxed italic">
                      "{storyData.aiDescription}"
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* The Story - Text flows around the image */}
            <div className="prose prose-lg max-w-none text-justify">
              {storyData.story.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="font-serif text-charcoal text-xl leading-loose mb-8 first-letter:text-6xl first-letter:font-normal first-letter:text-terracotta first-letter:mr-3 first-letter:float-left first-letter:leading-none"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Clear float to ensure footer appears below everything */}
            <div className="clear-both"></div>

            {/* Footer */}
            <footer className="pt-12 mt-16 border-t border-charcoal/10">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src="/kalaconnect-logo.png" 
                  alt="KalaConnect Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-charcoal/80 font-medium">KalaConnect</span>
              </div>
              <p className="text-charcoal/60 text-sm">
                A story by {storyData.artisanName}, brought to life by KalaConnect.
              </p>
              <p className="text-charcoal/40 text-xs mt-2">
                Story ID: {storyData.id}
              </p>
            </footer>
          </div>
        </div>
        
        <ScrollToTop />
      </main>
    </>
  );
}

// --- HELPER COMPONENTS ---

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div 
        className="h-full bg-terracotta"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 400);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 w-12 h-12 bg-terracotta text-cream rounded-full shadow-lg transition-all duration-300 ease-in-out z-40 group hover:scale-110 active:scale-95 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6 mx-auto transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}