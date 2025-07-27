'use client'

import { useState } from 'react'
import Camera from '@/components/Camera'
import VideoTutorials from '@/components/VideoTutorials'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PWAInstallGuide from '@/components/PWAInstallGuide'

export default function Home() {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [showTutorials, setShowTutorials] = useState(true)
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  const handlePhotoCapture = (imageData: string) => {
    setCapturedPhoto(imageData)
    
    // 사진 다운로드
    const link = document.createElement('a')
    link.download = `photo-${Date.now()}.jpg`
    link.href = imageData
    link.click()
  }

  const retakePhoto = () => {
    setCapturedPhoto(null)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">AI 카메라</h1>
            <button
              onClick={() => setShowInstallGuide(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              📱 앱 설치
            </button>
          </div>
          <p className="text-gray-600 text-sm">사진 촬영 팁과 함께 완벽한 사진을 찍어보세요</p>
        </div>

        {/* 촬영된 사진 표시 또는 카메라 */}
        <div className="mb-6">
          {capturedPhoto ? (
            <div className="relative">
              <img 
                src={capturedPhoto} 
                alt="촬영된 사진"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  다시 찍기
                </button>
                <button
                  onClick={() => handlePhotoCapture(capturedPhoto)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </div>
          ) : (
            <Camera onCapture={handlePhotoCapture} />
          )}
        </div>

        {/* 튜토리얼 토글 버튼 */}
        <div className="mb-4">
          <button
            onClick={() => setShowTutorials(!showTutorials)}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="font-medium text-gray-900">촬영 팁 영상</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showTutorials ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 비디오 튜토리얼 */}
        {showTutorials && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <VideoTutorials />
          </div>
        )}

        {/* 하단 정보 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Jordi Koalitic의 촬영 팁을 참고하여 더 나은 사진을 찍어보세요
          </p>
        </div>
      </div>

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />

      {/* PWA 설치 가이드 팝업 */}
      <PWAInstallGuide 
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
      />
    </main>
  )
}