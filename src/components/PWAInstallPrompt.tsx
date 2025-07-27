'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // PWA가 이미 설치되었는지 확인
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
      
      if (window.navigator && 'standalone' in window.navigator && (window.navigator as any).standalone) {
        setIsInstalled(true)
      }
    }

    checkIfInstalled()

    // beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // 설치 배너 표시 (사용자가 이전에 닫지 않았다면)
      if (typeof window !== 'undefined') {
        const hasPromptBeenShown = localStorage.getItem('pwa-install-prompt-shown')
        if (!hasPromptBeenShown && !isInstalled) {
          setTimeout(() => setShowInstallBanner(true), 2000) // 2초 후 표시
        }
      }
    }

    // 앱이 설치되었을 때
    const handleAppInstalled = () => {
      console.log('PWA: App was installed')
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
      localStorage.setItem('pwa-install-prompt-shown', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`PWA: User response to install prompt: ${outcome}`)
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setDeferredPrompt(null)
      setShowInstallBanner(false)
      if (typeof window !== 'undefined') {
        localStorage.setItem('pwa-install-prompt-shown', 'true')
      }
    } catch (error) {
      console.error('PWA: Install prompt failed', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-prompt-shown', 'true')
    }
  }

  // iOS Safari 감지
  const isIOS = () => {
    if (typeof navigator === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  const isInStandaloneMode = () => {
    if (typeof window === 'undefined') return false
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           ('standalone' in window.navigator && (window.navigator as any).standalone)
  }

  // iOS에서 홈 화면 추가 안내
  const showIOSInstallInstructions = isIOS() && !isInStandaloneMode() && showInstallBanner

  if (isInstalled || (!deferredPrompt && !showIOSInstallInstructions)) {
    return null
  }

  return (
    <>
      {/* Android/Chrome 설치 프롬프트 */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center flex-1">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">AI Camera 설치</h3>
                <p className="text-gray-600 text-xs">홈 화면에 추가해서 더 빠르게 이용하세요</p>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-gray-500 text-sm hover:text-gray-700"
              >
                나중에
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                설치
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari 설치 안내 */}
      {showIOSInstallInstructions && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">홈 화면에 추가하기</h3>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>1.</span>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>하단의 공유 버튼을 누르세요</span>
              </div>
              <div className="flex items-center gap-2">
                <span>2.</span>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>"홈 화면에 추가"를 선택하세요</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}