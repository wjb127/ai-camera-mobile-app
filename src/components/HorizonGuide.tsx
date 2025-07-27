'use client'

import { useEffect, useState } from 'react'

interface HorizonGuideProps {
  enabled: boolean
}

interface OrientationData {
  tilt: number
  isLevel: boolean
}

export default function HorizonGuide({ enabled }: HorizonGuideProps) {
  const [orientation, setOrientation] = useState<OrientationData>({ tilt: 0, isLevel: true })
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const requestPermission = async () => {
      // iOS 13+ 권한 요청
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          setPermissionGranted(permission === 'granted')
        } catch (error) {
          console.error('Device orientation permission denied:', error)
        }
      } else {
        // Android 또는 권한이 필요없는 브라우저
        setPermissionGranted(true)
      }
    }

    requestPermission()
  }, [enabled])

  useEffect(() => {
    if (!enabled || !permissionGranted) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // gamma는 좌우 기울기 (-180 ~ 180)
      const gamma = event.gamma || 0
      
      // 기울기 계산 (세로 모드 기준)
      let tilt = gamma
      
      // 기기 회전 상태에 따른 보정
      if (screen.orientation) {
        const angle = screen.orientation.angle
        if (angle === 90) tilt = -(event.beta || 0)
        else if (angle === -90 || angle === 270) tilt = (event.beta || 0)
        else if (angle === 180) tilt = -gamma
      }

      // 수평 여부 판단 (±2도 이내)
      const isLevel = Math.abs(tilt) <= 2

      setOrientation({ tilt, isLevel })
    }

    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [enabled, permissionGranted])

  if (!enabled) return null

  if (!permissionGranted) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-lg text-xs text-center">
        <p className="mb-2">수평 가이드를 사용하려면</p>
        <p>기기 움직임 권한이 필요합니다</p>
      </div>
    )
  }

  return (
    <>
      {/* 수평선 가이드 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* 중앙 수평선 */}
        <div 
          className={`absolute w-full h-px transition-all duration-200 ${
            orientation.isLevel ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          style={{
            transform: `rotate(${-orientation.tilt}deg)`,
            boxShadow: '0 0 8px rgba(0,0,0,0.5)'
          }}
        />
        
        {/* 기준 수평선 */}
        <div className="absolute w-32 h-px bg-white bg-opacity-50" />
        
        {/* 중앙 인디케이터 */}
        <div className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-200 ${
          orientation.isLevel 
            ? 'border-green-500 bg-green-500 bg-opacity-30' 
            : 'border-yellow-500 bg-yellow-500 bg-opacity-30'
        }`} />
      </div>

      {/* 기울기 정보 표시 */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span>{orientation.isLevel ? '📐' : '⚠️'}</span>
          <span>{orientation.isLevel ? '수평' : `${Math.abs(orientation.tilt).toFixed(1)}°`}</span>
        </div>
        
        {/* 기울기 바 */}
        <div className="w-16 h-1 bg-gray-600 rounded-full mt-1 relative">
          <div 
            className={`absolute w-1 h-1 rounded-full transition-all duration-200 ${
              orientation.isLevel ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{
              left: `${Math.max(0, Math.min(100, (orientation.tilt + 45) / 90 * 100))}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
      </div>
    </>
  )
}