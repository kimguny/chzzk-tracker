@AGENTS.md

# chzzk-tracker

치지직 팔로우 분석 및 맞팔 취소 감지 서비스. 백엔드 없이 Vercel만으로 운영.

## 프로젝트 배경

기존 프로젝트 `guny-world-frontend`(`/Users/rlarjs/Project/React/guny-world-frontend`)에서 치지직 팔로우 확인 기능만 분리해 독립 서비스로 만든 것. 기존엔 Go 백엔드(`/Users/rlarjs/Project/Go/guny-world-backend`)가 필요했지만, 이 프로젝트는 Next.js API Route로 대체해 Vercel 단독 배포가 목표.

나중에 Google AdSense 광고를 붙여 트래픽 수익화 예정.

## 핵심 기능

### 1. 팔로우 분석
- 입력: `NID_AUT`, `NID_SES` (네이버 로그인 쿠키), 치지직 채널 ID
- 출력: 팔로워 / 팔로잉 / 맞팔 / 나만팔로우(내가 팔로우하지만 상대는 안 함) / 상대만팔로워(상대가 팔로우하지만 나는 안 함)

### 2. 맞팔 취소 감지 (메인 차별점)
- "맞팔이었다가 언팔한 사람 찾기" — 사용자 니즈가 가장 높은 기능
- localStorage에 이전 조회 결과를 타임스탬프와 함께 저장
- 다음 조회 시 이전 맞팔 목록과 비교 → 사라진 사람 = 맞팔 취소한 사람

## 아키텍처

```
브라우저 → Next.js API Route (/api/chzzk) → 치지직 외부 API
                ↑
        CORS 때문에 반드시 서버 사이드에서 호출해야 함
        브라우저에서 직접 호출 시 차단됨
```

외부 API 호출은 무조건 `src/app/api/` 하위 Route Handler로 구현.

## 치지직 API 명세

### 팔로워 조회 (채널 관리자 권한 필요)
```
GET https://api.chzzk.naver.com/manage/v1/channels/{channelId}/followers?page={n}&size=10000&userNickname=
```
- 응답에서 추출: `content.data[].user.nickname`
- 최대 5페이지, 빈 데이터 나오면 루프 중단

### 팔로잉 조회 (본인 팔로잉 목록)
```
GET https://api.chzzk.naver.com/service/v1/channels/followings?size=500&page={n}
```
- 응답에서 추출: `content.followingList[].channel.channelName`
- 최대 100페이지, 빈 데이터 나오면 루프 중단

### 공통 요청 헤더
```
Cookie: NID_AUT={값}; NID_SES={값}
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
```

### 주의사항
- 각 요청 사이 300ms delay 필요 (rate limit)
- `NID_AUT`, `NID_SES`는 네이버 로그인 후 브라우저 쿠키에서 복사하는 값

## 타입 정의

```typescript
interface FetchFollowersParams {
  NID_AUT: string;
  NID_SES: string;
  id: string; // 치지직 채널 고유 ID (URL 뒤에 붙는 값)
}

interface ChzzkResponse {
  followers: string[];      // 나를 팔로우하는 사람들
  followings: string[];     // 내가 팔로우하는 사람들
  mutualFollows: string[];  // 맞팔
  onlyFollowing: string[];  // 내가 팔로우하지만 상대는 안 함
  onlyFollowers: string[];  // 상대가 팔로우하지만 나는 안 함
}

// localStorage 저장 구조
interface SavedSnapshot {
  timestamp: number;
  mutualFollows: string[];
  followers: string[];
  followings: string[];
}
```

## 원본 코드 참조

이식할 때 참고:
- UI: `/Users/rlarjs/Project/React/guny-world-frontend/src/components/chzzk/CheckFollow.tsx`
- 타입: `/Users/rlarjs/Project/React/guny-world-frontend/src/types/chzzk.ts`
- Go 백엔드 로직(API Route로 이식): `/Users/rlarjs/Project/Go/guny-world-backend/api/chzzk/chzzk.go`

## 개발 제약

- 백엔드 서버 없음. 모든 서버 로직은 Next.js API Route로.
- DB 없음. 히스토리는 localStorage로 관리. (추후 Supabase 업그레이드 가능하도록 데이터 접근 로직은 분리해서 작성)
- Vercel 무료 티어 기준으로 개발. 서버리스 함수 실행 시간 제한(10초) 주의. 치지직 API 페이지네이션이 많으면 타임아웃 위험 있음.

## SEO 타겟 키워드

- 치지직 팔로우 확인
- 치지직 맞팔 조회
- 치지직 언팔 확인
- 치지직 언팔한 사람 찾기
