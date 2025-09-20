'use client'
import { useState } from 'react'

interface PhaseCardProps {
  title: string
  subtitle: string
  description: string
  icon: string
  features: string[]
  color: string
}

export default function PhaseCard({ title, subtitle, description, icon, features, color }: PhaseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shadow */}
      <div 
        className={`absolute inset-0 bg-black rounded-3xl transition-all duration-500 ${
          isHovered ? 'translate-x-2 translate-y-2 opacity-20' : 'translate-x-0 translate-y-0 opacity-0'
        }`}
      />
      
      {/* Main Card */}
      <div 
        className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-500 ${
          isHovered ? '-translate-x-2 -translate-y-2 shadow-2xl' : 'translate-x-0 translate-y-0 shadow-lg'
        } ${color} hover:border-terracotta`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">{title}</h3>
            <p className="text-lg text-gray-600 font-medium">{subtitle}</p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
        
        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        

      </div>
    </div>
  )
}