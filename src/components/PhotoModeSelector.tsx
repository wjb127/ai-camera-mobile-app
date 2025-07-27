'use client'

import { useState } from 'react'

export type PhotoMode = 'portrait' | 'landscape' | 'food' | 'street' | 'macro' | 'auto'

export interface PhotoModeInfo {
  id: PhotoMode
  name: string
  icon: string
  description: string
  focus: string[]
  realTimeFeatures: string[]
  postProcessFeatures: string[]
}

export const PHOTO_MODES: PhotoModeInfo[] = [
  {
    id: 'auto',
    name: '자동',
    icon: '🤖',
    description: 'AI가 자동으로 상황을 판단하여 최적의 설정을 제공합니다',
    focus: ['전체적인 구도', '밝기 조절', '기본 분석'],
    realTimeFeatures: ['밝기 분석', '구도 가이드', '손떨림 감지'],
    postProcessFeatures: ['전체적 품질 평가', '개선점 분석', '다음 촬영 팁']
  },
  {
    id: 'portrait',
    name: '인물',
    icon: '👤',
    description: '인물 사진에 최적화된 설정으로 자연스러운 표정과 구도를 제안합니다',
    focus: ['구도', '조명', '표정', '배경'],
    realTimeFeatures: ['얼굴 감지', '구도 가이드', '조명 분석'],
    postProcessFeatures: ['얼굴 위치 분석', '표정 자연스러움', '배경 흐림 효과']
  },
  {
    id: 'landscape',
    name: '풍경',
    icon: '🌄',
    description: '넓은 풍경을 담을 때 수평선과 구도, 색감을 중점적으로 분석합니다',
    focus: ['구도', '색감', '선명도', '원근감'],
    realTimeFeatures: ['수평선 가이드', '구도 분석', '밝기 분석'],
    postProcessFeatures: ['수평선 정렬', '전경/중경/후경 분석', '색감 평가']
  },
  {
    id: 'food',
    name: '음식',
    icon: '🍕',
    description: '음식 사진의 플레이팅과 색감, 조명을 중심으로 분석합니다',
    focus: ['조명', '각도', '스타일링', '색감'],
    realTimeFeatures: ['조명 각도 분석', '구도 가이드', '색감 분석'],
    postProcessFeatures: ['플레이팅 평가', '조명 방향 분석', '색의 대비 측정']
  },
  {
    id: 'street',
    name: '스트리트',
    icon: '🚶',
    description: '순간을 포착하는 스트리트 사진의 스토리텔링과 구도를 분석합니다',
    focus: ['순간 포착', '스토리텔링', '구도', '빛'],
    realTimeFeatures: ['움직임 감지', '구도 분석', '빛 방향 분석'],
    postProcessFeatures: ['결정적 순간 평가', '감정 표현 분석', '환경과 조화']
  },
  {
    id: 'macro',
    name: '매크로',
    icon: '🔍',
    description: '접사 촬영에서 초점과 피사계 심도, 미세한 디테일을 중점 분석합니다',
    focus: ['초점', '피사계 심도', '디테일', '배경'],
    realTimeFeatures: ['초점 정확도', '손떨림 감지', '피사계 심도 분석'],
    postProcessFeatures: ['선명도 측정', '보케 품질 평가', '미세 디테일 분석']
  }
]

interface PhotoModeSelectorProps {
  selectedMode: PhotoMode
  onModeChange: (mode: PhotoMode) => void
  onFeatureClick: (feature: string, type: 'realtime' | 'postprocess') => void
  className?: string
}

export default function PhotoModeSelector({ 
  selectedMode, 
  onModeChange, 
  onFeatureClick,
  className = '' 
}: PhotoModeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const selectedModeInfo = PHOTO_MODES.find(mode => mode.id === selectedMode) || PHOTO_MODES[0]

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* 모드 선택 그리드 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">촬영 모드</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
          >
            {isExpanded ? '접기' : '자세히'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {PHOTO_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedMode === mode.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{mode.icon}</div>
              <div className="text-xs font-medium">{mode.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 모드 상세 정보 */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-xl">{selectedModeInfo.icon}</span>
              {selectedModeInfo.name} 모드
            </h4>
            <p className="text-sm text-gray-600 mb-3">{selectedModeInfo.description}</p>
          </div>

          {/* 실시간 분석 기능 */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">⚡ 실시간 분석</h5>
            <div className="space-y-1">
              {selectedModeInfo.realTimeFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => onFeatureClick(feature, 'realtime')}
                  className="block w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 transition-colors"
                >
                  • {feature}
                </button>
              ))}
            </div>
          </div>

          {/* 사후 처리 분석 기능 */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">🔍 사후 분석 (AI)</h5>
            <div className="space-y-1">
              {selectedModeInfo.postProcessFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => onFeatureClick(feature, 'postprocess')}
                  className="block w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  • {feature}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}