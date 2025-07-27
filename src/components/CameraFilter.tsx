'use client'

import { useState } from 'react'

export interface FilterType {
  id: string
  name: string
  cssFilter: string
  icon: string
}

const FILTERS: FilterType[] = [
  {
    id: 'none',
    name: '원본',
    cssFilter: 'none',
    icon: '🌈'
  },
  {
    id: 'vintage',
    name: '빈티지',
    cssFilter: 'sepia(0.8) contrast(1.2) brightness(1.1) saturate(0.8)',
    icon: '📸'
  },
  {
    id: 'blackwhite',
    name: '흑백',
    cssFilter: 'grayscale(1) contrast(1.1) brightness(1.1)',
    icon: '⚫'
  },
  {
    id: 'warm',
    name: '따뜻함',
    cssFilter: 'brightness(1.1) saturate(1.3) hue-rotate(10deg) contrast(1.1)',
    icon: '🌅'
  },
  {
    id: 'cool',
    name: '차가움',
    cssFilter: 'brightness(0.9) saturate(1.2) hue-rotate(-10deg) contrast(1.2)',
    icon: '❄️'
  },
  {
    id: 'drama',
    name: '드라마틱',
    cssFilter: 'contrast(1.5) brightness(0.9) saturate(1.4) sepia(0.1)',
    icon: '🎭'
  }
]

interface CameraFilterProps {
  selectedFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  className?: string
}

export default function CameraFilter({ selectedFilter, onFilterChange, className = '' }: CameraFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`${className}`}>
      {/* 필터 토글 버튼 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-opacity-70 transition-colors flex items-center gap-2"
      >
        <span>{selectedFilter.icon}</span>
        <span>{selectedFilter.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 필터 목록 */}
      {isExpanded && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-black bg-opacity-80 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  onFilterChange(filter)
                  setIsExpanded(false)
                }}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedFilter.id === filter.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <div className="text-lg mb-1">{filter.icon}</div>
                <div className="text-xs font-medium">{filter.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { FILTERS }