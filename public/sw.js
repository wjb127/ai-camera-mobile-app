const CACHE_NAME = 'ai-camera-v1.0.0'
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/css/app/page.css'
]

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install Event')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error)
      })
  )
  
  // 새로운 서비스 워커를 즉시 활성화
  self.skipWaiting()
})

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate Event')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting Old Cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // 모든 클라이언트에서 새 서비스 워커를 즉시 제어
  self.clients.claim()
})

// 페치 이벤트 (네트워크 요청 가로채기)
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetch Event', event.request.url)
  
  // 카메라 관련 API는 캐시하지 않음
  if (event.request.url.includes('getUserMedia') || 
      event.request.url.includes('mediaDevices') ||
      event.request.url.includes('blob:')) {
    return
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 발견되면 캐시된 버전 반환
        if (response) {
          console.log('Service Worker: Serving from Cache', event.request.url)
          return response
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        console.log('Service Worker: Fetching from Network', event.request.url)
        return fetch(event.request)
          .then((response) => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // 응답을 복제해서 캐시에 저장
            const responseToCache = response.clone()
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                // 정적 리소스만 캐시
                if (event.request.method === 'GET' && 
                    (event.request.url.includes('_next/static') || 
                     event.request.url.includes('.css') || 
                     event.request.url.includes('.js'))) {
                  cache.put(event.request, responseToCache)
                }
              })
            
            return response
          })
          .catch(() => {
            // 네트워크 실패 시 오프라인 페이지 표시
            if (event.request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background Sync', event.tag)
  
  if (event.tag === 'photo-sync') {
    event.waitUntil(syncPhotos())
  }
})

// 푸시 알림
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Event')
  
  const options = {
    body: event.data ? event.data.text() : 'AI Camera에서 알림이 도착했습니다',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'ai-camera-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: '앱 열기',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('AI Camera', options)
  )
})

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification Click', event.action)
  
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// 사진 동기화 함수
async function syncPhotos() {
  try {
    console.log('Service Worker: Syncing photos...')
    // 여기에 오프라인에서 저장된 사진들을 서버에 업로드하는 로직 추가
    // 현재는 로컬 스토리지 정리만 수행
    
    const savedPhotos = localStorage.getItem('offline-photos')
    if (savedPhotos) {
      console.log('Service Worker: Found offline photos, processing...')
      // 실제 구현에서는 여기서 서버에 업로드
      localStorage.removeItem('offline-photos')
    }
  } catch (error) {
    console.error('Service Worker: Photo sync failed', error)
  }
}

// 메시지 처리 (앱에서 서비스워커로 통신)
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})