'use client'

import { useRef, useEffect, useState } from 'react'

interface CameraProps {
  onCapture?: (imageData: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isFlipping, setIsFlipping] = useState(false)

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
    
    // 전면 카메라인 경우 좌우 반전
    if (facingMode === 'user') {
      context.scale(-1, 1)
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    } else {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

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
        className={`w-full rounded-lg shadow-lg transition-transform duration-300 ${
          facingMode === 'user' ? 'scale-x-[-1]' : ''
        }`}
      />
      <canvas ref={canvasRef} className="hidden" />
      
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
    </div>
  )
}