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

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 후면 카메라 우선
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsStreaming(true)
        }
      } catch (err) {
        console.error('카메라 접근 오류:', err)
        setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.')
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

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
        className="w-full rounded-lg shadow-lg"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {isStreaming && (
        <button
          onClick={capturePhoto}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-12 h-12 bg-red-500 rounded-full"></div>
        </button>
      )}
    </div>
  )
}