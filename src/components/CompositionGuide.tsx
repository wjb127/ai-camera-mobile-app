'use client'

import { useState } from 'react'

interface CompositionGuideProps {
  enabled: boolean
  guideType: 'grid' | 'center' | 'diagonal' | 'off'
  onGuideTypeChange: (type: 'grid' | 'center' | 'diagonal' | 'off') => void
}

export default function CompositionGuide({ 
  enabled, 
  guideType, 
  onGuideTypeChange 
}: CompositionGuideProps) {
  const [showControls, setShowControls] = useState(false)

  if (!enabled) return null

  return (
    <>
      {/* 구도 가이드 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        {guideType === 'grid' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* 3분할법 격자 */}
            <line x1="33.33" y1="0" x2="33.33" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
            <line x1="66.66" y1="0" x2="66.66" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
            <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
            <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
            
            {/* 교차점 표시 */}
            <circle cx="33.33" cy="33.33" r="0.8" fill="rgba(255,255,255,0.8)" />
            <circle cx="66.66" cy="33.33" r="0.8" fill="rgba(255,255,255,0.8)" />
            <circle cx="33.33" cy="66.66" r="0.8" fill="rgba(255,255,255,0.8)" />
            <circle cx="66.66" cy="66.66" r="0.8" fill="rgba(255,255,255,0.8)" />
          </svg>
        )}
        
        {guideType === 'center' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* 중앙 십자가 */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
            
            {/* 중앙점 */}
            <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.8)" />
            
            {/* 중앙 영역 표시 */}
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
          </svg>
        )}
        
        {guideType === 'diagonal' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* 대각선 가이드 */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
            
            {/* 황금비율 선 */}
            <line x1="38.2" y1="0" x2="38.2" y2="100" stroke="rgba(255,215,0,0.4)" strokeWidth="0.15" />
            <line x1="61.8" y1="0" x2="61.8" y2="100" stroke="rgba(255,215,0,0.4)" strokeWidth="0.15" />
            <line x1="0" y1="38.2" x2="100" y2="38.2" stroke="rgba(255,215,0,0.4)" strokeWidth="0.15" />
            <line x1="0" y1="61.8" x2="100" y2="61.8" stroke="rgba(255,215,0,0.4)" strokeWidth="0.15" />
          </svg>
        )}
      </div>

      {/* 구도 가이드 컨트롤 */}
      <div className="absolute top-2 left-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full text-xs hover:bg-opacity-70 transition-colors"
        >
          📐
        </button>
        
        {showControls && (
          <div className="absolute top-full left-0 mt-1 bg-black bg-opacity-80 rounded-lg p-2 space-y-1 min-w-24">
            <button
              onClick={() => onGuideTypeChange('off')}
              className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                guideType === 'off' ? 'bg-white text-black' : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              끄기
            </button>
            <button
              onClick={() => onGuideTypeChange('grid')}
              className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                guideType === 'grid' ? 'bg-white text-black' : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              격자
            </button>
            <button
              onClick={() => onGuideTypeChange('center')}
              className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                guideType === 'center' ? 'bg-white text-black' : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              중앙
            </button>
            <button
              onClick={() => onGuideTypeChange('diagonal')}
              className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                guideType === 'diagonal' ? 'bg-white text-black' : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              황금비
            </button>
          </div>
        )}
      </div>
    </>
  )
}