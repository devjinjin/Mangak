# Mangak

기술사(정보관리 · 컴퓨터시스템응용) 전용 **이미지 기반 인출학습 + 망각곡선 복습** PWA.

서버 · 백엔드 · 로그인 없음. 모든 데이터는 브라우저 IndexedDB에만 저장됩니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크 + 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기 (PWA 동작 확인용)
```

## 배포

### GitHub Pages (자동 배포 설정 완료)

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드 후 GitHub Pages에 배포합니다.

최초 1회 설정:

1. GitHub에서 새 저장소 생성 (예: `mangak`)
2. 로컬에서 push:
   ```bash
   git init
   git add .
   git commit -m "feat: Mangak MVP"
   git branch -M main
   git remote add origin https://github.com/<계정명>/mangak.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 변경
4. Actions 탭에서 배포 완료 후 `https://<계정명>.github.io/mangak/` 접속

HashRouter 기반이라 서브 경로(`/<repo>/`)에서도 라우팅이 그대로 동작합니다.

### Cloudflare Pages (대안)

- Build command: `npm run build` / Build output directory: `dist`

## 기술 스택

React 18 + TypeScript + Vite / Tailwind CSS / IndexedDB / vite-plugin-pwa

## 구조

```
src/
  types.ts            # Category · Topic · ReviewState · ReviewLog · ExportData
  lib/db.ts           # IndexedDB CRUD, Export/Import(병합·덮어쓰기), 초기화
  lib/srs.ts          # 망각곡선 알고리즘(점수 1~5 → 1/3/7/14/30일), 취약토픽 판정
  pages/
    Dashboard.tsx     # 오늘·지연 복습 수, 전체 토픽, 평균 점수, 최근 학습
    TopicList.tsx     # 검색 + 카테고리/태그 필터
    TopicDetail.tsx   # 이미지·설명·복습 상태·이력, 삭제(이력 삭제 여부 확인)
    TopicEdit.tsx     # 생성/수정, 다중 이미지 업로드(개별 삭제·순서 변경, 1600px 리사이즈)
    Review.tsx        # 인출학습: 제목만 표시 → 백지복기 → 정답 → 자가평가
    Statistics.tsx    # 7일 학습량, 카테고리별 숙련도, 취약 토픽
    Settings.tsx      # Export / Import / 데이터 초기화
    Categories.tsx    # 카테고리 CRUD + 색상 + 정렬
```

## 복습 알고리즘 (MVP)

| 점수 | 의미 | 다음 복습 |
|---|---|---|
| 5 | 완벽히 인출 | 30일 |
| 4 | 대부분 인출 | 14일 |
| 3 | 절반 정도 | 7일 |
| 2 | 거의 기억 안 남 | 3일 |
| 1 | 전혀 기억 안 남 | 1일 |

점수 1~2는 failCount 증가. 오늘의 복습 큐는 `지연 큰 순 → 낮은 점수 → 오래 복습 안 한 순`으로 정렬.

취약 토픽 기준: 최근 점수 ≤2, 또는 failCount ≥2, 또는 7일 이상 지연.

## 남은 작업

- [ ] PWA 아이콘: 현재 SVG만 포함. iOS 홈 화면 설치 품질을 위해 `public/`에 192/512px PNG 추가 후 `vite.config.ts` manifest icons에 등록 권장
- [ ] 실기기 PWA 설치 / 오프라인 테스트
- [ ] V2: OCR, AI 키워드 추출, 예상문제 생성, 클라우드 동기화 등
