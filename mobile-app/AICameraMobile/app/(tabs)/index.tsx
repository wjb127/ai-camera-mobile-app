import React, { useRef, useEffect } from 'react';
import { Platform, StyleSheet, View, Alert, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();

  // 웹 앱 URL - 개발 시에는 로컬, 배포 시에는 배포된 URL 사용
  const WEB_APP_URL = __DEV__ 
    ? 'http://localhost:3005' // 개발 모드
    : 'https://ai-camera-mobile-app.vercel.app'; // 배포된 URL로 변경 필요

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from web:', data);
      
      // 웹에서 오는 메시지 처리
      switch (data.type) {
        case 'CAMERA_PERMISSION_REQUEST':
          handleCameraPermission();
          break;
        case 'PHOTO_CAPTURED':
          handlePhotoCaptured(data.imageData);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const handleCameraPermission = () => {
    // iOS에서 카메라 권한 요청 (웹뷰에서 자동으로 처리됨)
    console.log('Camera permission requested');
  };

  const handlePhotoCaptured = async (imageData: string) => {
    console.log('Photo captured:', imageData.substring(0, 50) + '...');
    
    try {
      // 미디어 라이브러리 권한 요청
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진을 저장하려면 사진 라이브러리 접근 권한이 필요합니다.');
        return;
      }

      // Base64 데이터에서 실제 이미지 데이터 추출
      const base64Data = imageData.split(',')[1];
      const filename = `ai-camera-${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      // 파일로 저장
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 사진 라이브러리에 저장
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      
      // AI Camera 앨범 생성 또는 가져오기
      let album = await MediaLibrary.getAlbumAsync('AI Camera');
      if (album == null) {
        album = await MediaLibrary.createAlbumAsync('AI Camera', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert(
        '사진 저장됨',
        `사진이 "AI Camera" 앨범에 저장되었습니다.`,
        [{ text: '확인' }]
      );

      // 임시 파일 삭제
      await FileSystem.deleteAsync(fileUri);
      
    } catch (error) {
      console.error('Photo save error:', error);
      Alert.alert(
        '저장 실패',
        '사진을 저장하는 중 오류가 발생했습니다.',
        [{ text: '확인' }]
      );
    }
  };

  const sendMessageToWeb = (message: any) => {
    const js = `window.postMessage(${JSON.stringify(message)}, '*');`;
    webViewRef.current?.injectJavaScript(js);
  };

  const handleLoadEnd = () => {
    console.log('WebView loaded successfully');
    // 웹 앱에 네이티브 환경임을 알림
    sendMessageToWeb({
      type: 'NATIVE_APP_READY',
      platform: Platform.OS,
      isNative: true
    });
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert(
      '연결 오류',
      '웹 앱을 로드할 수 없습니다. 네트워크 연결을 확인해주세요.',
      [{ text: '확인' }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
        // iOS 카메라 접근을 위한 설정
        allowsProtectedMedia={true}
        allowsBackForwardNavigationGestures={false}
        // 카메라 권한 관련
        mediaCapturePermissionGrantType="grant"
        onPermissionRequest={(request) => {
          console.log('Permission requested:', request.nativeEvent);
          request.nativeEvent.grant();
        }}
        // 추가 보안 설정
        originWhitelist={['*']}
        sharedCookiesEnabled={true}
        // 성능 최적화
        cacheEnabled={true}
        incognito={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b82f6',
  },
  webview: {
    flex: 1,
  },
});
