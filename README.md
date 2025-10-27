# 🎨 PicoArt v5 - 최종 완성 버전

AI 아트 스타일 변환 웹 애플리케이션

---

## ✨ 특징

- 🎨 6가지 예술 스타일 (Van Gogh, Picasso, Monet, Munch, Klimt, 수채화)
- ⚡ 빠른 변환 (10-20초)
- 📱 반응형 디자인
- 🔒 안전한 API 토큰 관리 (저장하지 않음)
- 📊 실시간 Console 로그

---

## 📁 파일 구조

```
picoart-v5-final/
├── index.html       # 메인 페이지
├── api/
│   ├── convert.js   # 변환 API
│   └── status.js    # 상태 확인 API
├── vercel.json      # Vercel 설정 (최소화)
├── .gitignore
└── README.md        # 이 파일
```

---

## 🚀 배포 방법

### 1단계: GitHub 업로드

**GitHub Desktop 사용:**
1. File → Create New Repository
2. Name: `picoart-v5-final`
3. Local Path: 이 폴더 선택
4. Create Repository
5. Publish repository (Public)

### 2단계: Vercel 배포

1. https://vercel.com/new 접속
2. `picoart-v5-final` 저장소 Import
3. 설정 변경하지 말고 바로 Deploy!

### 3단계: 완료!

```
✅ https://picoart-v5-final.vercel.app
```

---

## 🧪 테스트

1. **Replicate API 토큰 발급**: https://replicate.com/account/api-tokens
2. **사진 업로드** (자동 리사이즈: 800px)
3. **스타일 선택**
4. **변환 시작!**
5. **F12 → Console에서 로그 확인**

---

## 💰 비용

- **Vercel**: 무료 (월 100GB 대역폭)
- **Replicate**: 변환당 약 $0.0059

---

## 🔧 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- Vercel Serverless Functions (Node.js)
- Replicate AI API (Style Transfer)

---

## 📝 주요 개선사항 (v5)

- ✅ 간소화된 vercel.json (builds 제거)
- ✅ 실시간 Console 로그
- ✅ 명확한 에러 메시지
- ✅ predictionId 반환 보장
- ✅ 자동 이미지 리사이즈

---

## 🐛 문제 해결

### 404 에러
- 브라우저 캐시 문제: Ctrl+Shift+R (하드 새로고침)
- 시크릿 창에서 테스트: Ctrl+Shift+N

### API 에러
- Replicate 크레딧 확인
- API 토큰 확인 (r8_로 시작)

### 빌드 에러
- GitHub 파일 구조 확인
- index.html이 루트에 있어야 함

---

## 📞 지원

**문제 발생 시:**
1. F12 → Console 확인
2. Vercel → Build Logs 확인
3. GitHub 파일 구조 확인

---

**🎉 PicoArt v5 - Made with ❤️**
