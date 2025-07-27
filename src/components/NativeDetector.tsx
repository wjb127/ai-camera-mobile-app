'use client'

import { useEffect, useState } from 'react'

interface NativeDetectorProps {
  children: React.ReactNode
  onNativeDetected?: (platform: string) => void
}

export default function NativeDetector({ children, onNativeDetected }: NativeDetectorProps) {
  const [isNativeApp, setIsNativeApp] = useState(false)
  const [platform, setPlatform] = useState<string>('')

  useEffect(() => {
    // React Native WebView 환경 감지
    const checkNativeEnvironment = () => {
      // React Native WebView 환경에서는 window.ReactNativeWebView가 존재
      if (typeof window !== 'undefined') {
        const isRNWebView = !!(window as any).ReactNativeWebView
        const userAgent = navigator.userAgent
        
        // iOS 앱 내 WebView 감지
        const isIOSApp = /iPhone|iPad|iPod/.test(userAgent) && 
                        (isRNWebView || userAgent.includes('Mobile/') && !userAgent.includes('Safari/'))
        
        // Android 앱 내 WebView 감지  
        const isAndroidApp = /Android/.test(userAgent) && 
                           (isRNWebView || !userAgent.includes('Chrome') || userAgent.includes('wv'))

        if (isIOSApp) {
          setIsNativeApp(true)
          setPlatform('ios')
          onNativeDetected?.('ios')
        } else if (isAndroidApp) {
          setIsNativeApp(true)
          setPlatform('android')
          onNativeDetected?.('android')
        }

        // 네이티브 앱에서 보내는 메시지 리스너
        const handleMessage = (event: MessageEvent) => {
          try {
            const data = event.data
            if (data && data.type === 'NATIVE_APP_READY') {
              setIsNativeApp(true)
              setPlatform(data.platform || 'unknown')
              onNativeDetected?.(data.platform || 'unknown')
              console.log('Native app detected:', data.platform)
            }
          } catch (error) {
            console.error('Error handling native message:', error)
          }
        }

        window.addEventListener('message', handleMessage)
        
        return () => {
          window.removeEventListener('message', handleMessage)
        }
      }
    }

    checkNativeEnvironment()
  }, [onNativeDetected])

  // 네이티브 앱에 메시지 전송하는 헬퍼 함수를 전역으로 등록
  useEffect(() => {
    if (typeof window !== 'undefined' && isNativeApp) {
      (window as any).sendToNative = (message: any) => {
        try {
          if ((window as any).ReactNativeWebView) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify(message))
          } else {
            // iOS WKWebView 또는 다른 네이티브 WebView
            if ((window as any).webkit?.messageHandlers?.nativeHandler) {
              (window as any).webkit.messageHandlers.nativeHandler.postMessage(message)
            }
          }
        } catch (error) {
          console.error('Failed to send message to native:', error)
        }
      }
    }
  }, [isNativeApp])

  return (
    <>
      {children}
      {/* 네이티브 앱 환경 표시 (개발용) */}
      {isNativeApp && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded-br z-50">
          Native: {platform}
        </div>
      )}
    </>
  )
}