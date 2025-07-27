'use client'

import { useRef, useEffect, useState } from 'react'

interface BrightnessAnalyzerProps {
  videoRef: React.RefObject<HTMLVideoElement>
  enabled: boolean
}

interface BrightnessData {
  average: number
  status: 'dark' | 'normal' | 'bright' | 'overexposed'
  recommendation: string
}

export default function BrightnessAnalyzer({ videoRef, enabled }: BrightnessAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [brightnessData, setBrightnessData] = useState<BrightnessData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!enabled || !videoRef.current) return

    const analyzeInterval = setInterval(() => {
      analyzeBrightness()
    }, 500) // 0.5초마다 분석

    return () => clearInterval(analyzeInterval)
  }, [enabled, videoRef.current])

  const analyzeBrightness = () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return

    setIsAnalyzing(true)

    // 캔버스 크기 설정 (작은 크기로 성능 최적화)
    canvas.width = 160
    canvas.height = 120

    try {
      // 비디오 프레임을 캔버스에 그리기
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // 이미지 데이터 추출
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // 밝기 분석
      let totalBrightness = 0
      let darkPixels = 0
      let brightPixels = 0
      const pixelCount = data.length / 4

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // 그레이스케일 변환 (ITU-R BT.709 표준)
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b
        totalBrightness += brightness

        if (brightness < 50) darkPixels++
        if (brightness > 200) brightPixels++
      }

      const averageBrightness = totalBrightness / pixelCount
      const darkRatio = darkPixels / pixelCount
      const brightRatio = brightPixels / pixelCount

      // 상태 판단
      let status: BrightnessData['status']
      let recommendation: string

      if (averageBrightness < 80) {
        status = 'dark'
        recommendation = '조명이 부족합니다. 밝은 곳으로 이동하거나 조명을 켜보세요.'
      } else if (averageBrightness > 180) {
        status = 'bright'
        recommendation = '너무 밝습니다. 그늘로 이동하거나 조명을 줄여보세요.'
      } else if (brightRatio > 0.1) {
        status = 'overexposed'
        recommendation = '일부 영역이 과노출되었습니다. 각도를 조정해보세요.'
      } else {
        status = 'normal'
        recommendation = '적절한 밝기입니다!'
      }

      setBrightnessData({
        average: Math.round(averageBrightness),
        status,
        recommendation
      })

    } catch (error) {
      console.error('Brightness analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!enabled || !brightnessData) return null

  const getStatusColor = () => {
    switch (brightnessData.status) {
      case 'dark': return 'bg-blue-500'
      case 'normal': return 'bg-green-500'
      case 'bright': return 'bg-yellow-500'
      case 'overexposed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (brightnessData.status) {
      case 'dark': return '🌙'
      case 'normal': return '✅'
      case 'bright': return '☀️'
      case 'overexposed': return '⚠️'
      default: return '📊'
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      
      {/* 밝기 분석 결과 표시 */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-lg text-xs max-w-48">
        <div className="flex items-center gap-2 mb-1">
          <span>{getStatusIcon()}</span>
          <span className="font-medium">밝기: {brightnessData.average}/255</span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        </div>
        
        {/* 밝기 바 */}
        <div className="w-full bg-gray-600 rounded-full h-1 mb-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${getStatusColor()}`}
            style={{ width: `${(brightnessData.average / 255) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-xs leading-tight">{brightnessData.recommendation}</p>
      </div>
    </>
  )
}