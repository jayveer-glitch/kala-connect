'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import EnhancedMagicTextBox from './components/EnhancedMagicTextBox';
import MagicalParticles from './components/MagicalParticles';
import AudioFeedback from './components/AudioFeedback';
import InkWell from './components/InkWell';
import ConstellationLoader from './components/ConstellationLoader';
import { apiConfig } from '../utils/apiConfig';
import './styles/animations.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic']
});

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500']
});

interface ConversationState {
  answers: string[];
  isLoading: boolean;
  showConstellationLoader: boolean;
  completionProgress: number;
  currentStep: string;
}

interface ValidationState {
  [key: number]: {
    isValid: boolean;
    message?: string;
  };
}

export default function ConversationPage() {
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);
  const [terracottaWashVisible, setTerracottaWashVisible] = useState(false);
  const [questionsVisible, setQuestionsVisible] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    answers: ['', '', ''],
    isLoading: false,
    showConstellationLoader: false,
    completionProgress: 0,
    currentStep: 'ready'
  });
  
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // State for backend data
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [aiDescription, setAiDescription] = useState<string>('');

  const titleRef = useRef<HTMLHeadingElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Load analysis data from sessionStorage
  useEffect(() => {
    const storedAnalysisData = sessionStorage.getItem('analysisData');
    if (storedAnalysisData) {
      try {
        const parsedData = JSON.parse(storedAnalysisData);
        setAnalysisData(parsedData);
        
        // Parse the AI response to extract questions and description
        const aiResponse = parsedData.ai_analysis;
        try {
          const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```/g, '').trim();
          const responseData = JSON.parse(cleanResponse);
          
          setAiDescription(responseData.description || 'A beautiful handcrafted piece');
          setQuestions(responseData.questions || [
            "What is the story behind this piece? What inspired its creation?",
            "What materials and techniques were used in making this artwork?", 
            "What emotions or memories does this piece evoke for you?"
          ]);
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          // Use fallback questions
          setQuestions([
            "What is the story behind this piece? What inspired its creation?",
            "What materials and techniques were used in making this artwork?",
            "What emotions or memories does this piece evoke for you?"
          ]);
          setAiDescription('A beautiful handcrafted piece');
        }
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    } else {
      // Redirect back to upload if no data
      window.location.href = '/upload';
    }
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Performance-optimized intersection observer for animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations only when elements are visible
            const element = entry.target as HTMLElement;
            element.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, []);

  // Optimized animation orchestration with requestIdleCallback
  useEffect(() => {
    if (isReducedMotion) {
      // Skip animations for reduced motion
      setTitleAnimationComplete(true);
      setTerracottaWashVisible(true);
      setQuestionsVisible(true);
      return;
    }

    const scheduleAnimation = (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(callback);
        } else {
          callback();
        }
      }, delay);
      return timeoutId;
    };

    const titleTimer = scheduleAnimation(() => setTitleAnimationComplete(true), 500);
    const terracottaTimer = scheduleAnimation(() => setTerracottaWashVisible(true), 1500);
    const questionsTimer = scheduleAnimation(() => setQuestionsVisible(true), 2500);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(terracottaTimer);
      clearTimeout(questionsTimer);
    };
  }, [isReducedMotion]);

  // Optimized form validation with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const answeredQuestions = conversationState.answers.filter(answer => answer.trim().length > 0);
      const progress = (answeredQuestions.length / questions.length) * 100;
      
      setConversationState(prev => ({
        ...prev,
        completionProgress: progress
      }));
      
      setIsFormValid(answeredQuestions.length === questions.length);
    }, 300); // Debounce validation

    return () => clearTimeout(debounceTimer);
  }, [conversationState.answers]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...conversationState.answers];
    newAnswers[index] = value;
    
    // Optimized validation
    const isValid = value.trim().length > 0;
    setValidationState(prev => ({
      ...prev,
      [index]: {
        isValid,
        message: isValid ? undefined : 'Please provide an answer to continue'
      }
    }));
    
    setConversationState(prev => ({
      ...prev,
      answers: newAnswers
    }));
  };

  const handleWeaveStory = async () => {
    if (!isFormValid || !analysisData) return;
    
    setConversationState(prev => ({
      ...prev,
      isLoading: true,
      showConstellationLoader: true,
      currentStep: 'Weaving your story...'
    }));

    try {
      // Prepare data for backend
      const storyData = {
        initial_description: aiDescription,
        artisan_answers: conversationState.answers.filter(answer => answer.trim().length > 0)
      };

      // Call the complete-story endpoint using apiConfig
      setConversationState(prev => ({ ...prev, currentStep: 'Calling AI storyteller...' }));
      
      const response = await fetch(apiConfig.endpoints.completeStory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const finalStoryData = await response.json();
      
      setConversationState(prev => ({ ...prev, currentStep: 'Story complete! Preparing your showcase...' }));
      
      // Store the final story data
      sessionStorage.setItem('finalStory', JSON.stringify(finalStoryData));
      
      // Navigate to gallery with a delay
      setTimeout(() => {
        window.location.href = '/gallery';
      }, 2000);
      
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
      setConversationState(prev => ({
        ...prev,
        isLoading: false,
        showConstellationLoader: false,
        currentStep: 'ready'
      }));
    }
  };

  if (conversationState.showConstellationLoader) {
    return (
      <ConstellationLoader 
        answers={conversationState.answers}
        aiDescription={aiDescription}
        currentStep={conversationState.currentStep}
        progress={conversationState.completionProgress}
      />
    );
  }

  return (
    <div className={`${inter.className} enchanted-manuscript`}>
      {/* Audio Feedback System */}
      <AudioFeedback enabled={questionsVisible} />
      
      {/* Magical Particles */}
      <MagicalParticles 
        intensity={questionsVisible ? 30 : 15} 
        color={terracottaWashVisible ? 'terracotta' : 'cobalt'} 
      />
      
      {/* Breathing Paper Canvas */}
      <div ref={paperRef} className="paper-canvas">
        {/* Atmospheric Lighting */}
        <div className="atmospheric-vignette" />
        
        {/* Paper Texture with Breathing Animation */}
        <div className="paper-texture breathing-paper" />
        
        {/* Progress Indicator */}
        {questionsVisible && (
          <div className="progress-container" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={conversationState.completionProgress}>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${conversationState.completionProgress}%` }}
              />
            </div>
            <span className="progress-text">
              {Math.round(conversationState.completionProgress)}% Complete
            </span>
          </div>
        )}
        
        {/* Main Content */}
        <div className="manuscript-content">
          {/* Ink-Drawn Title */}
          <header className="title-section">
            <h1 ref={titleRef} className={`${playfair.className} manuscript-title`}>
              <span className="ink-drawn-text">The Studio</span>
            </h1>
            <p className="subtitle-text">Share your story, weave your magic</p>
          </header>

          {/* AI's Impression - Terracotta Wash */}
          {terracottaWashVisible && (
            <section className="ai-impression" role="region" aria-label="AI's impression of your artwork">
              <div className="terracotta-wash">
                <div className="watercolor-bleed" />
                <p className={`${inter.className} ai-description shimmer-text`}>
                  {aiDescription}
                </p>
              </div>
            </section>
          )}

          {/* Conversational Core */}
          {questionsVisible && (
            <section className="conversation-core" role="main" aria-label="Story creation questionnaire">
              <div className="form-introduction">
                <p className="form-intro-text">
                  Let's craft something magical together. Your answers will help weave a story 
                  that captures the essence of your artwork.
                </p>
              </div>
              
              {questions.map((question, index) => (
                <div key={index} className="question-answer-pair">
                  <div className="question-section">
                    <h3 className={`${playfair.className} question-number ink-drawn-text`}>
                      Question {index + 1}
                    </h3>
                    <p className="question-text typewriter-effect">
                      {question}
                    </p>
                  </div>
                  
                  <EnhancedMagicTextBox
                    value={conversationState.answers[index]}
                    onChange={(value: string) => handleAnswerChange(index, value)}
                    placeholder="Share your thoughts..."
                    delay={index * 800}
                    maxLength={500}
                    required={true}
                    label={`Answer ${index + 1}`}
                  />
                </div>
              ))}
            </section>
          )}

          {/* Weave the Story Inkwell */}
          {questionsVisible && (
            <div className="inkwell-section">
              <InkWell
                onClick={handleWeaveStory}
                disabled={conversationState.isLoading || !isFormValid}
                className="story-inkwell"
              />
              {!isFormValid && (
                <p className="completion-hint" role="status" aria-live="polite">
                  Please answer all questions to weave your story
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .enchanted-manuscript {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: var(--font-inter);
        }

        .paper-canvas {
          min-height: 100vh;
          background-color: #F8F5F2;
          position: relative;
          overflow: hidden;
        }

        .atmospheric-vignette {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(ellipse 60% 50% at center, transparent 0%, transparent 40%, rgba(0,0,0,0.02) 70%, rgba(0,0,0,0.05) 100%),
            radial-gradient(ellipse 80% 60% at 50% 45%, rgba(248, 245, 242, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .paper-texture {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            /* Watercolor stains */
            radial-gradient(ellipse 200px 150px at 15% 25%, rgba(224, 122, 95, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 180px 120px at 85% 75%, rgba(0, 71, 171, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 100px 80px at 70% 20%, rgba(44, 44, 44, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 150px 100px at 25% 80%, rgba(224, 122, 95, 0.05) 0%, transparent 65%),
            /* Fibrous flecks */
            radial-gradient(circle 2px at 20% 30%, rgba(0, 71, 171, 0.3) 0%, transparent 50%),
            radial-gradient(circle 1px at 80% 70%, rgba(224, 122, 95, 0.4) 0%, transparent 50%),
            radial-gradient(circle 1.5px at 40% 80%, rgba(44, 44, 44, 0.2) 0%, transparent 50%),
            radial-gradient(circle 1px at 60% 40%, rgba(0, 71, 171, 0.25) 0%, transparent 50%),
            radial-gradient(circle 2px at 90% 30%, rgba(224, 122, 95, 0.3) 0%, transparent 50%),
            /* Base texture gradients */
            radial-gradient(circle at 20% 30%, rgba(224, 122, 95, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 71, 171, 0.015) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(44, 44, 44, 0.008) 0%, transparent 30%);
          background-size: 
            400px 300px, 350px 250px, 200px 160px, 300px 200px,
            4px 4px, 2px 2px, 3px 3px, 2px 2px, 4px 4px,
            300px 300px, 200px 200px, 150px 150px;
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        .breathing-paper {
          animation: paperBreathe 12s ease-in-out infinite;
        }

        @keyframes paperBreathe {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: brightness(1) contrast(1);
          }
          25% { 
            transform: scale(1.0008) rotate(0.02deg);
            filter: brightness(1.005) contrast(1.002);
          }
          50% { 
            transform: scale(1.0015) rotate(0.05deg);
            filter: brightness(1.01) contrast(1.005);
          }
          75% { 
            transform: scale(1.0008) rotate(0.02deg);
            filter: brightness(1.005) contrast(1.002);
          }
        }

        .progress-container {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(248, 245, 242, 0.9);
          backdrop-filter: blur(10px);
          padding: 15px 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 71, 171, 0.2);
          z-index: 10;
          opacity: 0;
          animation: fadeInProgress 1s ease-out 1s forwards;
        }

        @keyframes fadeInProgress {
          to { opacity: 1; }
        }

        .progress-track {
          width: 200px;
          height: 6px;
          background: rgba(0, 71, 171, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0047AB, #E07A5F);
          border-radius: 3px;
          transition: width 0.5s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: progressShimmer 2s ease-in-out infinite;
        }

        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          font-size: 0.85rem;
          color: #2C2C2C;
          font-weight: 500;
          text-align: center;
          display: block;
        }

        .manuscript-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 40px;
        }

        .title-section {
          text-align: center;
          margin-bottom: 60px;
        }

        .manuscript-title {
          font-size: 4rem;
          color: #2C2C2C;
          font-weight: 700;
          margin: 0 0 15px 0;
        }

        .subtitle-text {
          font-size: 1.2rem;
          color: rgba(44, 44, 44, 0.7);
          font-style: italic;
          margin: 0;
          opacity: 0;
          animation: fadeInSubtitle 1s ease-out 3s forwards;
        }

        @keyframes fadeInSubtitle {
          to { opacity: 1; }
        }

        .ink-drawn-text {
          position: relative;
          display: inline-block;
          color: #2C2C2C;
          animation: simpleInkDraw 3s ease-in-out forwards;
        }

        @keyframes simpleInkDraw {
          0% {
            color: #2C2C2C;
            opacity: 0.3;
            text-shadow: none;
          }
          30% {
            color: #0047AB;
            opacity: 1;
            text-shadow: 0 0 15px rgba(0, 71, 171, 0.6);
          }
          100% {
            color: #2C2C2C;
            opacity: 1;
            text-shadow: none;
          }
        }

        .ai-impression {
          margin: 60px 0;
          position: relative;
        }

        .terracotta-wash {
          position: relative;
          padding: 40px;
          margin: 20px 0;
        }

        .watercolor-bleed {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(ellipse 120% 80% at 20% 30%, #E07A5F 0%, rgba(224, 122, 95, 0.8) 40%, transparent 70%),
            radial-gradient(ellipse 100% 90% at 80% 70%, rgba(224, 122, 95, 0.6) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 60% 20%, rgba(224, 122, 95, 0.4) 0%, transparent 50%);
          border-radius: 
            60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: organicWatercolorSpread 3s ease-out forwards;
          opacity: 0;
          transform: scale(0.2);
          filter: blur(1px);
        }

        @keyframes organicWatercolorSpread {
          0% {
            transform: scale(0.2) rotate(-2deg);
            opacity: 0;
            filter: blur(2px);
            border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
          }
          20% {
            transform: scale(0.4) rotate(-1deg);
            opacity: 0.3;
            filter: blur(1.5px);
            border-radius: 60% 40% 50% 60% / 40% 60% 50% 40%;
          }
          50% {
            transform: scale(0.7) rotate(0.5deg);
            opacity: 0.25;
            filter: blur(1px);
            border-radius: 70% 30% 40% 80% / 50% 40% 60% 50%;
          }
          80% {
            transform: scale(0.95) rotate(0deg);
            opacity: 0.18;
            filter: blur(0.5px);
            border-radius: 65% 35% 35% 75% / 55% 35% 65% 45%;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.15;
            filter: blur(0px);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }

        .ai-description {
          position: relative;
          font-style: italic;
          font-size: 1.2rem;
          color: #2C2C2C !important;
          text-align: center;
          line-height: 1.6;
          animation: fadeInDescription 1s ease-in 1s forwards;
          opacity: 0.5;
          z-index: 10;
        }

        .ai-description.shimmer-text {
          color: #2C2C2C !important;
        }

        @keyframes fadeInDescription {
          from { 
            opacity: 0.5; 
          }
          to { 
            opacity: 1; 
          }
        }

        .shimmer-text {
          position: relative;
          color: #2C2C2C;
          background: linear-gradient(90deg, 
            #2C2C2C 0%, 
            #2C2C2C 40%, 
            #0047AB 50%, 
            #2C2C2C 60%, 
            #2C2C2C 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: simpleShimmer 3s ease-in-out infinite;
        }

        @keyframes simpleShimmer {
          0%, 100% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
        }

        .conversation-core {
          margin: 80px 0;
        }

        .form-introduction {
          text-align: center;
          margin-bottom: 60px;
          opacity: 0;
          animation: fadeInIntro 1s ease-out 0.5s forwards;
        }

        @keyframes fadeInIntro {
          to { opacity: 1; }
        }

        .form-intro-text {
          font-size: 1.1rem;
          color: rgba(44, 44, 44, 0.8);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .question-answer-pair {
          margin-bottom: 60px;
          opacity: 0;
          animation: questionReveal 1s ease-out forwards;
        }

        .question-answer-pair:nth-child(2) { animation-delay: 0.5s; }
        .question-answer-pair:nth-child(3) { animation-delay: 1s; }
        .question-answer-pair:nth-child(4) { animation-delay: 1.5s; }

        @keyframes questionReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .question-section {
          margin-bottom: 30px;
        }

        .question-number {
          font-size: 1.5rem;
          color: #2C2C2C;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .question-text {
          font-size: 1.1rem;
          color: #2C2C2C;
          line-height: 1.6;
          margin: 0;
        }

        .typewriter-effect {
          overflow: hidden;
          border-right: 2px solid #0047AB;
          white-space: nowrap;
          animation: typing 2s steps(100) forwards, blink 1s infinite;
          width: 0;
        }

        @keyframes typing {
          to { width: 100%; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        .inkwell-section {
          margin: 80px auto 0;
          text-align: center;
        }

        .story-inkwell {
          margin: 0 auto 20px;
          display: block;
        }

        .completion-hint {
          font-size: 0.9rem;
          color: #E07A5F;
          font-style: italic;
          margin: 0;
          opacity: 0.8;
        }

        /* Accessibility Enhancements */
        @media (prefers-reduced-motion: reduce) {
          .breathing-paper,
          .ink-drawn-text,
          .watercolor-bleed,
          .shimmer-text,
          .question-answer-pair,
          .progress-fill::after {
            animation: none;
          }
          
          .typewriter-effect {
            width: 100%;
            border-right: none;
          }
          
          .ink-drawn-text {
            color: #2C2C2C !important;
          }
          
          .shimmer-text {
            color: #2C2C2C !important;
            background: none !important;
            -webkit-text-fill-color: #2C2C2C !important;
          }
          
          .ai-description {
            opacity: 1 !important;
          }
        }

        @media (prefers-contrast: high) {
          .progress-track {
            border: 2px solid;
          }
          
          .progress-container {
            border: 2px solid;
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .manuscript-content {
            padding: 60px 20px;
          }
          
          .manuscript-title {
            font-size: 2.5rem;
          }
          
          .ai-description {
            font-size: 1rem;
          }
          
          .progress-container {
            position: relative;
            top: auto;
            right: auto;
            margin: 20px auto;
            max-width: 250px;
          }
          
          .progress-track {
            width: 150px;
          }
        }

        /* Focus indicators for keyboard navigation */
        .story-inkwell:focus {
          outline: 3px solid #0047AB;
          outline-offset: 4px;
        }

        /* Loading state styles */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(248, 245, 242, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .loading-text {
          font-size: 1.2rem;
          color: #2C2C2C;
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
