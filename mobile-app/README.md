# AI Camera Mobile App (React Native WebView)

AI Camera 웹 앱을 React Native WebView로 감싼 네이티브 모바일 앱입니다.

## 기능

- ✅ **웹 앱 통합**: 기존 Next.js AI Camera 웹 앱을 WebView로 로드
- ✅ **iOS 카메라 지원**: WebView에서 카메라 접근 및 사진 촬영 가능
- ✅ **네이티브 사진 저장**: 촬영한 사진을 iOS 사진 앱에 직접 저장
- ✅ **AI Camera 앨범**: 전용 앨범 자동 생성 및 사진 분류
- ✅ **권한 관리**: 카메라, 마이크, 사진 라이브러리 권한 자동 요청
- ✅ **웹-네이티브 통신**: JavaScript ↔ React Native 메시지 전달

## 프로젝트 구조

```
ai-camera-mobile-app/
├── src/                     # Next.js 웹 앱
│   ├── app/
│   ├── components/
│   └── ...
├── mobile-app/              # React Native 앱
│   └── AICameraMobile/
│       ├── app/
│       ├── app.json
│       └── package.json
└── README.md
```

## 개발 환경 설정

### 1. 웹 앱 실행 (필수)
```bash
# 루트 디렉토리에서
npm install
npm run dev  # http://localhost:3005에서 실행
```

### 2. 모바일 앱 실행
```bash
# mobile-app/AICameraMobile 디렉토리에서
cd mobile-app/AICameraMobile
npm install

# iOS 실행 (Mac 필요)
npx expo run:ios

# Android 실행
npx expo run:android
```

## 주요 기능

### 🎯 WebView 통합
- 웹 앱을 네이티브 앱 내에서 실행
- 네이티브 느낌의 전체화면 경험
- 웹과 네이티브 간 실시간 메시지 통신

### 📸 카메라 기능
- iOS에서 완전한 카메라 접근 지원
- 전면/후면 카메라 전환
- 실시간 필터 적용 미리보기
- 고화질 사진 촬영

### 💾 네이티브 사진 저장
```typescript
// 웹에서 사진 촬영 완료 시 자동으로 처리
- Base64 이미지 데이터 수신
- iOS 사진 라이브러리에 직접 저장
- "AI Camera" 전용 앨범 자동 생성
- 성공/실패 알림 표시
```

### 🔐 권한 관리
**iOS Info.plist 설정:**
```xml
<key>NSCameraUsageDescription</key>
<string>AI Camera 앱에서 사진을 촬영하기 위해 카메라 접근 권한이 필요합니다.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>촬영한 사진을 사진 앱에 저장하기 위해 사진 라이브러리 쓰기 권한이 필요합니다.</string>
```

## 기술 스택

### 웹 앱
- **Next.js 15**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **WebRTC**: 카메라 API 접근

### 모바일 앱
- **Expo**: React Native 개발 플랫폼
- **react-native-webview**: 웹뷰 컴포넌트
- **expo-media-library**: 사진 저장
- **expo-file-system**: 파일 처리

## 웹-네이티브 통신

### 메시지 형식
```typescript
// 웹 → 네이티브: 사진 촬영 완료
{
  type: 'PHOTO_CAPTURED',
  imageData: 'data:image/jpeg;base64,...',
  timestamp: 1234567890
}

// 네이티브 → 웹: 앱 준비 완료  
{
  type: 'NATIVE_APP_READY',
  platform: 'ios',
  isNative: true
}
```

### 통신 구현
```typescript
// 웹 앱에서 네이티브로 전송
window.sendToNative({
  type: 'PHOTO_CAPTURED',
  imageData: capturedImage
});

// 네이티브에서 웹으로 전송
const js = `window.postMessage(${JSON.stringify(message)}, '*');`;
webViewRef.current?.injectJavaScript(js);
```

## 배포 가이드

### 웹 앱 배포
1. **Vercel/Netlify**: 정적 사이트 호스팅
2. **HTTPS 필수**: 카메라 API 접근 요구사항
3. **도메인 설정**: 모바일 앱에서 접근할 URL 설정

### 모바일 앱 배포
```bash
# EAS 빌드 설정
npm install -g @expo/cli
eas build:configure

# iOS 빌드
eas build --platform ios

# Android 빌드  
eas build --platform android
```

## 테스트 방법

### 로컬 테스트
1. **웹 앱**: `npm run dev` 실행
2. **모바일 앱**: Expo Go 또는 시뮬레이터에서 실행
3. **카메라 테스트**: 실제 기기 필요 (시뮬레이터 제한)

### 기능 테스트 체크리스트
- [ ] 웹 앱 로딩 확인
- [ ] 카메라 권한 요청 동작
- [ ] 전면/후면 카메라 전환
- [ ] 필터 적용 미리보기
- [ ] 사진 촬영 및 저장
- [ ] 사진 앱에서 "AI Camera" 앨범 확인

## 문제 해결

### 자주 발생하는 이슈

**1. 카메라 접근 안됨**
```bash
해결책:
- Info.plist 권한 설정 확인
- 실제 기기에서 테스트 (시뮬레이터 제한)
- WebView 카메라 설정 확인
```

**2. 사진 저장 실패**
```bash
해결책:
- 사진 라이브러리 권한 확인
- Base64 데이터 형식 검증
- expo-media-library 버전 확인
```

**3. WebView 로딩 오류**
```bash
해결책:
- 네트워크 연결 상태 확인
- 웹 앱 URL 정확성 검증
- CORS 설정 확인
```

## 향후 개선 계획

- [ ] **Push 알림**: 촬영 완료 알림
- [ ] **오프라인 지원**: 사진 임시 저장
- [ ] **클라우드 동기화**: 사진 백업 기능
- [ ] **AI 분석**: 네이티브 이미지 처리
- [ ] **Share Extension**: 다른 앱에서 사진 공유

## 라이선스

MIT License

## 지원

문제가 발생하면 Issues에 등록해 주세요.