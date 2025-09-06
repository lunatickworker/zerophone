# ZeroPhone 🔋

프리미엄 중고폰 쇼핑몰 - 검증된 품질의 중고 스마트폰을 합리적인 가격에 만나보세요.

## ✨ 주요 기능

### 🛒 쇼핑 기능
- **스마트 검색/필터**: 브랜드, 모델, 가격대별 상세 검색
- **상품 상세페이지**: 검수 기준 포함 상세 정보 제공
- **장바구니/결제**: 간편한 주문 및 결제 시스템
- **QR/바코드 발급**: 주문 확인 및 픽업 서비스

### 🎉 이벤트 & 혜택
- **적립금 시스템**: 구매 시 적립금 지급
- **응모 이벤트**: 다양한 경품 이벤트 참여
- **고객 등급제**: 구매 실적에 따른 등급별 혜택

### 💬 커뮤니티
- **후기/평점**: 실제 구매 고객의 솔직한 후기
- **메인 화면 롤링**: 블로그, 인스타그램, 자체 컨텐츠
- **토론방**: 사용자 간 정보 공유 및 소통

### 🎨 디자인 특징
- **프리미엄 브랜드 이미지**: 블랙 + 골드 포인트 + 무채색 톤
- **심플하고 직관적인 UI/UX**: 무신사, KREAM, 당근마켓 참고
- **반응형 디자인**: 데스크톱/모바일 최적화

## 🚀 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Build Tool**: Vite
- **Backend**: Supabase
- **State Management**: Context API + Custom Hooks
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 🔧 환경 설정

### Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `.env.local` 파일 생성 후 아래 환경변수 추가:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   └── figma/          # Figma 관련 컴포넌트
├── hooks/              # 커스텀 훅
├── styles/             # 스타일 파일
├── utils/              # 유틸리티 함수
└── supabase/           # Supabase 설정 및 함수
```

## 👨‍💼 관리자 기능

### 관리자 로그인
- **ID**: admin
- **PW**: admin

### 관리자 페이지 기능
- 상품 관리 (등록/수정/삭제)
- 주문 관리
- 사용자 관리
- 이벤트 관리
- 통계 대시보드

## 🔒 인증 시스템

- 회원가입/로그인
- 소셜 로그인 (Google, Kakao 등)
- 사용자 프로필 관리
- 주문 내역 조회

## 🌟 주요 페이지

- **메인 페이지**: 추천 상품, 브랜드 카테고리, 커뮤니티
- **상품 검색**: 필터링 및 정렬 기능
- **상품 상세**: 상품 정보, 검수 기준, 리뷰
- **장바구니**: 선택 상품 관리
- **결제**: 간편 결제 시스템
- **커뮤니티**: 후기, 토론방
- **마이페이지**: 주문 내역, 적립금, 등급 정보

## 📱 반응형 지원

- 모바일 퍼스트 디자인
- 태블릿/데스크톱 최적화
- Touch-friendly 인터페이스

## 🎯 비즈니스 목표

- 중고폰 거래의 신뢰성 향상
- 사용자 친화적인 쇼핑 경험 제공
- 커뮤니티 기반의 브랜드 충성도 구축
- 프리미엄 브랜드 이미지 확립

## 📄 라이선스

MIT License

---

**ZeroPhone Team** 💚