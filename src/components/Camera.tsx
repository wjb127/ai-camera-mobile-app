'use client'

import { useRef, useEffect, useState } from 'react'
import CameraFilter, { FilterType, FILTERS } from './CameraFilter'
import CompositionGuide from './CompositionGuide'
import BrightnessAnalyzer from './BrightnessAnalyzer'
import HorizonGuide from './HorizonGuide'

interface CameraProps {
  onCapture?: (imageData: string) => void
  selectedMode?: string
}

export default function Camera({ onCapture, selectedMode = 'auto' }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isFlipping, setIsFlipping] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(FILTERS[0])
  
  // 실시간 분석 기능 상태
  const [guideType, setGuideType] = useState<'grid' | 'center' | 'diagonal' | 'off'>('grid')
  const [analysisEnabled, setAnalysisEnabled] = useState(true)

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      // 기존 스트림 정리
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }

      setIsStreaming(false)
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        setFacingMode(mode)
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err)
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.')
    }
  }

  useEffect(() => {
    startCamera(facingMode)

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const flipCamera = async () => {
    if (isFlipping) return
    
    setIsFlipping(true)
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    await startCamera(newMode)
    setIsFlipping(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // 필터 적용을 위해 임시 canvas 생성
    const tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')
    if (!tempContext) return

    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height

    // 전면 카메라인 경우 좌우 반전
    if (facingMode === 'user') {
      tempContext.scale(-1, 1)
      tempContext.drawImage(video, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height)
    } else {
      tempContext.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)
    }

    // 필터 적용
    if (selectedFilter.cssFilter !== 'none') {
      context.filter = selectedFilter.cssFilter
    }
    context.drawImage(tempCanvas, 0, 0)
    context.filter = 'none' // 필터 리셋

    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    onCapture?.(imageData)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
        <p className="text-red-500 text-center px-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ filter: selectedFilter.cssFilter }}
        className={`w-full rounded-lg shadow-lg transition-transform duration-300 ${
          facingMode === 'user' ? 'scale-x-[-1]' : ''
        }`}
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* 실시간 분석 기능들 */}
      {isStreaming && analysisEnabled && (
        <>
          {/* 구도 가이드 */}
          <CompositionGuide
            enabled={guideType !== 'off'}
            guideType={guideType}
            onGuideTypeChange={setGuideType}
          />
          
          {/* 밝기 분석 */}
          <BrightnessAnalyzer
            videoRef={videoRef}
            enabled={true}
          />
          
          {/* 수평선 가이드 (풍경 모드에서만) */}
          {selectedMode === 'landscape' && (
            <HorizonGuide enabled={true} />
          )}
        </>
      )}
      
      {/* 카메라 전환 버튼 */}
      {isStreaming && (
        <button
          onClick={flipCamera}
          disabled={isFlipping}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full shadow-lg hover:bg-opacity-70 transition-colors disabled:opacity-50"
          aria-label="카메라 전환"
        >
          {isFlipping ? (
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          )}
        </button>
      )}
      
      {/* 촬영 버튼 */}
      {isStreaming && (
        <button
          onClick={capturePhoto}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="사진 촬영"
        >
          <div className="w-12 h-12 bg-red-500 rounded-full"></div>
        </button>
      )}
      
      {/* 현재 카메라 모드 표시 */}
      {isStreaming && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {facingMode === 'user' ? '전면' : '후면'}
        </div>
      )}

      {/* 분석 기능 토글 버튼 */}
      {isStreaming && (
        <button
          onClick={() => setAnalysisEnabled(!analysisEnabled)}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs hover:bg-opacity-70 transition-colors"
        >
          {analysisEnabled ? '🔍 분석 켜짐' : '🔍 분석 꺼짐'}
        </button>
      )}

      {/* 필터 선택 */}
      {isStreaming && (
        <div className="absolute bottom-20 left-4 right-4">
          <CameraFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            className="relative"
          />
        </div>
      )}
    </div>
  )
}