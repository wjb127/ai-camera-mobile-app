'use client'

import { useState, useEffect } from 'react'

interface PWAInstallGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function PWAInstallGuide({ isOpen, onClose }: PWAInstallGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('android')

  useEffect(() => {
    const detectDevice = () => {
      if (typeof navigator === 'undefined') return
      const userAgent = navigator.userAgent.toLowerCase()
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setDeviceType('ios')
      } else if (/android/.test(userAgent)) {
        setDeviceType('android')
      } else {
        setDeviceType('desktop')
      }
    }

    detectDevice()
  }, [])

  const androidSteps = [
    {
      title: '1단계: 메뉴 열기',
      description: 'Chrome 브라우저에서 우상단의 ⋮ 메뉴를 누르세요',
      icon: '📱',
      tip: 'Chrome 브라우저에서만 가능합니다'
    },
    {
      title: '2단계: 홈 화면에 추가',
      description: '"홈 화면에 추가" 또는 "앱 설치" 옵션을 찾아 누르세요',
      icon: '🏠',
      tip: '메뉴에서 스크롤해서 찾아보세요'
    },
    {
      title: '3단계: 설치 확인',
      description: '"설치" 또는 "추가" 버튼을 눌러 완료하세요',
      icon: '✅',
      tip: '이제 홈 화면에서 앱처럼 사용할 수 있어요!'
    }
  ]

  const iosSteps = [
    {
      title: '1단계: 공유 버튼',
      description: 'Safari 하단의 공유 버튼 □↗을 누르세요',
      icon: '📤',
      tip: 'Safari 브라우저에서만 가능합니다'
    },
    {
      title: '2단계: 홈 화면에 추가',
      description: '메뉴에서 "홈 화면에 추가" 옵션을 찾아 누르세요',
      icon: '🏠',
      tip: '아래로 스크롤해서 찾아보세요'
    },
    {
      title: '3단계: 이름 확인',
      description: '앱 이름을 확인하고 "추가" 버튼을 누르세요',
      icon: '✅',
      tip: '홈 화면에 AI Camera 아이콘이 생겨요!'
    }
  ]

  const desktopSteps = [
    {
      title: '1단계: 설치 아이콘',
      description: '주소창 우측의 설치 아이콘 ⬇ 또는 + 를 클릭하세요',
      icon: '💻',
      tip: 'Chrome, Edge 브라우저에서 지원됩니다'
    },
    {
      title: '2단계: 설치 확인',
      description: '"설치" 버튼을 클릭해서 앱을 설치하세요',
      icon: '📥',
      tip: '바탕화면과 시작 메뉴에 추가됩니다'
    },
    {
      title: '3단계: 앱 실행',
      description: '설치 후 바로 앱을 실행하거나 나중에 실행할 수 있어요',
      icon: '🚀',
      tip: '이제 독립적인 창에서 실행됩니다!'
    }
  ]

  const getCurrentSteps = () => {
    switch (deviceType) {
      case 'ios': return iosSteps
      case 'desktop': return desktopSteps
      default: return androidSteps
    }
  }

  const steps = getCurrentSteps()
  const currentStepData = steps[currentStep]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getDeviceTitle = () => {
    switch (deviceType) {
      case 'ios': return 'iPhone/iPad 설치 방법'
      case 'desktop': return 'PC/Mac 설치 방법'
      default: return 'Android 설치 방법'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-4xl mb-2">📱</div>
            <h2 className="text-xl font-bold mb-1">{getDeviceTitle()}</h2>
            <p className="text-blue-100 text-sm">홈 화면에서 앱처럼 사용하세요!</p>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% 완료
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentStepData.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* 팁 박스 */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <div className="text-yellow-400 mr-2">💡</div>
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">팁</p>
                <p className="text-sm text-yellow-700">{currentStepData.tip}</p>
              </div>
            </div>
          </div>

          {/* 브라우저별 추가 안내 */}
          {deviceType === 'android' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">📱 Chrome 앱에서</h4>
              <p className="text-sm text-blue-800">
                Chrome 앱에서 이 페이지를 열어야 설치할 수 있어요. 
                다른 브라우저에서는 설치 옵션이 나타나지 않을 수 있습니다.
              </p>
            </div>
          )}

          {deviceType === 'ios' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">🌐 Safari에서</h4>
              <p className="text-sm text-blue-800">
                Safari 브라우저에서만 홈 화면 추가가 가능해요. 
                Chrome이나 다른 브라우저에서는 지원되지 않습니다.
              </p>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
              >
                다음
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all font-medium"
              >
                완료! 🎉
              </button>
            )}
          </div>

          {/* 건너뛰기 버튼 */}
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            나중에 설치하기
          </button>
        </div>
      </div>
    </div>
  )
}