'use client'

import { useState } from 'react'

interface VideoTutorial {
  id: string
  title: string
  theme: string
  videoId: string
  thumbnail: string
  description: string
}

const videoTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: '골든 아워 인물 사진',
    theme: '인물 사진',
    videoId: 'dQw4w9WgXcQ', // 예시 YouTube ID
    thumbnail: '/api/placeholder/300/200',
    description: '자연광을 활용한 부드러운 인물 사진 촬영법'
  },
  {
    id: '2',
    title: '도시 야경 촬영',
    theme: '풍경 사진',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/300/200',
    description: '도시의 야경을 아름답게 담는 방법'
  },
  {
    id: '3',
    title: '음식 사진 조명',
    theme: '음식 사진',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/300/200',
    description: '맛있어 보이는 음식 사진 촬영 팁'
  },
  {
    id: '4',
    title: '스트리트 포토그래피',
    theme: '스트리트',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/300/200',
    description: '거리에서 순간을 포착하는 기법'
  },
  {
    id: '5',
    title: '매크로 사진 기법',
    theme: '매크로',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/300/200',
    description: '작은 피사체를 크게 찍는 매크로 촬영법'
  }
]

const themes = ['전체', '인물 사진', '풍경 사진', '음식 사진', '스트리트', '매크로']

export default function VideoTutorials() {
  const [selectedTheme, setSelectedTheme] = useState('전체')
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)

  const filteredVideos = selectedTheme === '전체' 
    ? videoTutorials 
    : videoTutorials.filter(video => video.theme === selectedTheme)

  const openVideo = (video: VideoTutorial) => {
    setSelectedVideo(video)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <div className="w-full">
      {/* 테마 필터 */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedTheme === theme
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* 비디오 목록 */}
      <div className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => openVideo(video)}
            className="flex gap-3 p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="w-20 h-16 bg-gray-300 rounded flex-shrink-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l8-5-8-5z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                {video.theme}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 비디오 모달 */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
              <button
                onClick={closeVideo}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-gray-900 rounded mb-4 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                  <p className="text-sm">Jordi Koalitic 튜토리얼</p>
                  <p className="text-xs text-gray-300 mt-1">실제 구현 시 YouTube 임베드</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}