'use client'

import { useEffect } from 'react'

interface FeatureDetails {
  name: string
  type: 'realtime' | 'postprocess'
  status: 'implemented' | 'coming_soon'
  description: string
  howItWorks: string[]
  implementation?: string
  benefits: string[]
  timeline?: string
}

const FEATURE_DETAILS: Record<string, FeatureDetails> = {
  // 실시간 분석 기능들 (룰베이스로 구현 가능)
  '밝기 분석': {
    name: '밝기 분석',
    type: 'realtime',
    status: 'implemented',
    description: '실시간으로 영상의 밝기를 분석하여 적정 노출을 안내합니다.',
    howItWorks: [
      '카메라 영상의 픽셀 밝기값을 실시간 계산',
      '히스토그램 분석으로 노출 상태 판단',
      '너무 밝거나 어두운 영역 감지',
      '적정 노출 범위 가이드 제공'
    ],
    implementation: 'Canvas API와 이미지 데이터 분석으로 구현',
    benefits: [
      '적절한 노출의 사진 촬영 가능',
      '명암비 향상된 결과물',
      '실시간 피드백으로 재촬영 최소화'
    ]
  },
  '구도 가이드': {
    name: '구도 가이드',
    type: 'realtime',
    status: 'implemented',
    description: '3분할법 등 기본적인 구도 가이드라인을 화면에 표시합니다.',
    howItWorks: [
      '화면을 3×3 격자로 분할',
      '주요 피사체 위치 가이드라인 표시',
      '수평선/수직선 정렬 도움',
      '황금비율 구도 가이드 제공'
    ],
    implementation: 'CSS 오버레이와 격자 시스템으로 구현',
    benefits: [
      '균형 잡힌 구도의 사진',
      '전문적인 느낌의 결과물',
      '구도 감각 향상'
    ]
  },
  '손떨림 감지': {
    name: '손떨림 감지',
    type: 'realtime',
    status: 'coming_soon',
    description: '기기의 움직임을 감지하여 손떨림 경고를 제공합니다.',
    howItWorks: [
      'DeviceMotionEvent API로 기기 움직임 감지',
      '가속도계 데이터 분석',
      '안정된 상태 vs 흔들림 판단',
      '촬영 적기 타이밍 알림'
    ],
    benefits: [
      '선명한 사진 촬영 가능',
      '블러 현상 최소화',
      '최적의 촬영 타이밍 제공'
    ],
    timeline: '2-3주 내 구현 예정'
  },
  '얼굴 감지': {
    name: '얼굴 감지',
    type: 'realtime',
    status: 'coming_soon',
    description: '실시간으로 얼굴을 감지하여 포커스와 구도를 도와줍니다.',
    howItWorks: [
      'MediaPipe Face Detection 라이브러리 활용',
      '실시간 얼굴 위치 및 크기 감지',
      '얼굴 중심 구도 가이드라인 제공',
      '다중 얼굴 감지 시 배치 제안'
    ],
    benefits: [
      '자동 얼굴 중심 구도',
      '인물 사진 품질 향상',
      '그룹 사진 배치 최적화'
    ],
    timeline: '1개월 내 구현 예정'
  },
  '수평선 가이드': {
    name: '수평선 가이드',
    type: 'realtime',
    status: 'implemented',
    description: '풍경 사진에서 수평선을 정확히 맞출 수 있도록 가이드라인을 제공합니다.',
    howItWorks: [
      '기기의 자이로스코프 센서 활용',
      '수평 각도 실시간 측정',
      '수평선 정렬 가이드라인 표시',
      '기울어짐 정도 시각적 표시'
    ],
    implementation: 'DeviceOrientationEvent와 CSS 변환으로 구현',
    benefits: [
      '완벽하게 수평인 풍경 사진',
      '전문적인 느낌의 결과물',
      '후보정 필요성 감소'
    ]
  },
  '조명 각도 분석': {
    name: '조명 각도 분석',
    type: 'realtime',
    status: 'coming_soon',
    description: '현재 조명의 방향과 강도를 분석하여 최적의 촬영 각도를 제안합니다.',
    howItWorks: [
      '영상의 명암 패턴 분석',
      '그림자 방향과 길이 계산',
      '조명 각도 및 강도 추정',
      '최적 촬영 위치 제안'
    ],
    benefits: [
      '자연스러운 조명의 사진',
      '그림자 활용한 입체감',
      '조명 전문 지식 습득'
    ],
    timeline: '1-2개월 내 구현 예정'
  },

  // 사후 처리 분석 기능들 (AI 기반)
  '전체적 품질 평가': {
    name: '전체적 품질 평가',
    type: 'postprocess',
    status: 'coming_soon',
    description: 'AI가 사진의 전반적인 품질을 평가하고 점수를 제공합니다.',
    howItWorks: [
      'EfficientNet 기반 이미지 특징 추출',
      '구도, 색감, 선명도 등 종합 분석',
      '전문가 평가 데이터셋으로 훈련된 모델',
      '0-100점 품질 점수 산출'
    ],
    benefits: [
      '객관적인 사진 품질 평가',
      '실력 향상 가능 정도 측정',
      '포트폴리오 선별 기준 제공'
    ],
    timeline: '2-3개월 내 구현 예정'
  },
  '얼굴 위치 분석': {
    name: '얼굴 위치 분석',
    type: 'postprocess',
    status: 'coming_soon',
    description: '촬영된 인물 사진에서 얼굴 위치와 표정을 상세 분석합니다.',
    howItWorks: [
      'Google Vision AI 또는 Azure Face API 활용',
      '얼굴 랜드마크 68개 포인트 검출',
      '감정 상태 및 표정 자연스러움 분석',
      '이상적인 얼굴 위치와 비교 평가'
    ],
    benefits: [
      '인물 사진 구도 개선점 파악',
      '표정과 각도 최적화 가이드',
      '감정 표현 효과 분석'
    ],
    timeline: '1개월 내 구현 예정'
  },
  '수평선 정렬': {
    name: '수평선 정렬',
    type: 'postprocess',
    status: 'coming_soon',
    description: '풍경 사진에서 수평선이 얼마나 정확한지 분석하고 보정 가이드를 제공합니다.',
    howItWorks: [
      'OpenCV 라이브러리로 선분 검출',
      'Hough Transform으로 수평선 식별',
      '기울어진 각도 정확히 측정',
      '자동 회전 보정값 계산'
    ],
    benefits: [
      '완벽한 수평선 정렬',
      '전문적인 풍경 사진',
      '후보정 작업 시간 단축'
    ],
    timeline: '2주 내 구현 예정'
  },
  '플레이팅 평가': {
    name: '플레이팅 평가',
    type: 'postprocess',
    status: 'coming_soon',
    description: '음식 사진에서 플레이팅의 균형과 색감을 분석합니다.',
    howItWorks: [
      '음식 객체 감지 및 경계 인식',
      '색상 분포와 조화 분석',
      '플레이팅 균형감 평가',
      '음식 전문가 데이터와 비교'
    ],
    benefits: [
      'SNS용 음식 사진 품질 향상',
      '색감과 배치 개선 팁',
      '음식 촬영 전문 지식 습득'
    ],
    timeline: '1-2개월 내 구현 예정'
  },
  '결정적 순간 평가': {
    name: '결정적 순간 평가',
    type: 'postprocess',
    status: 'coming_soon',
    description: '스트리트 사진에서 포착한 순간의 임팩트와 스토리를 분석합니다.',
    howItWorks: [
      '동작 감지 및 표정 분석',
      '환경과 인물의 상호작용 평가',
      '시각적 임팩트 측정',
      '스토리텔링 요소 분석'
    ],
    benefits: [
      '더 의미있는 순간 포착',
      '스트리트 사진 감각 향상',
      '스토리텔링 능력 개발'
    ],
    timeline: '3-4개월 내 구현 예정'
  },
  '선명도 측정': {
    name: '선명도 측정',
    type: 'postprocess',
    status: 'coming_soon',
    description: '매크로 사진의 초점 정확도와 전반적인 선명도를 측정합니다.',
    howItWorks: [
      'Laplacian 분산으로 선명도 계산',
      '주요 피사체 영역 초점 분석',
      '피사계 심도 효과 평가',
      '배경 보케 품질 측정'
    ],
    benefits: [
      '정확한 초점의 매크로 사진',
      '피사계 심도 활용 개선',
      '기술적 완성도 향상'
    ],
    timeline: '2-3주 내 구현 예정'
  }
}

interface FeatureExplanationModalProps {
  isOpen: boolean
  featureName: string
  onClose: () => void
}

export default function FeatureExplanationModal({ 
  isOpen, 
  featureName, 
  onClose 
}: FeatureExplanationModalProps) {
  const feature = FEATURE_DETAILS[featureName]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !feature) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              feature.status === 'implemented' ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            <h3 className="font-bold text-lg">{feature.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              feature.type === 'realtime' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {feature.type === 'realtime' ? '실시간' : 'AI 분석'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4 space-y-4">
          {/* 상태 표시 */}
          <div className={`p-3 rounded-lg ${
            feature.status === 'implemented' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {feature.status === 'implemented' ? (
                <>
                  <span className="text-green-600">✅</span>
                  <span className="font-medium text-green-800">구현 완료</span>
                </>
              ) : (
                <>
                  <span className="text-orange-600">🚧</span>
                  <span className="font-medium text-orange-800">개발 중</span>
                </>
              )}
            </div>
            {feature.timeline && (
              <p className="text-sm text-orange-700">{feature.timeline}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🎯 기능 설명</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
          </div>

          {/* 작동 방식 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">⚙️ 작동 방식</h4>
            <ul className="space-y-1">
              {feature.howItWorks.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 font-medium">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 구현 방법 (구현된 기능만) */}
          {feature.implementation && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔧 구현 방법</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-mono">
                {feature.implementation}
              </p>
            </div>
          )}

          {/* 혜택 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">✨ 기대 효과</h4>
            <ul className="space-y-1">
              {feature.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 하단 버튼 */}
          <div className="pt-4 border-t">
            {feature.status === 'implemented' ? (
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-green-800 font-medium text-sm mb-2">이 기능은 이미 사용 가능합니다!</p>
                <p className="text-green-700 text-xs">촬영을 시작하면 자동으로 적용됩니다.</p>
              </div>
            ) : (
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-blue-800 font-medium text-sm mb-2">곧 만나볼 수 있어요!</p>
                <p className="text-blue-700 text-xs">개발이 완료되면 자동으로 업데이트됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}