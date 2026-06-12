---
name: nextjs-generator
description: Next.js App Router 기반 페이지/API/컴포넌트 구조를 생성하는 개발 스킬
agent: developer
category: development
triggers:
  - next
  - nextjs
  - next.js
  - app router
  - 서버 컴포넌트
---

# nextjs-generator

Next.js에서 라우트, 서버/클라이언트 컴포넌트, API Route/Server Action, 테스트 골격을 만든다.

## 입력

- 페이지 요구사항
- 라우팅 구조
- 데이터 소스
- 인증 방식
- SEO/성능 요구

## 산출물

- app/ 라우트 구조
- 컴포넌트 분리안
- 데이터 로딩/캐싱 전략
- API/Action 코드
- 테스트와 접근성 체크

## 작업 절차

1. Server Component 우선 구조를 설계한다.
2. 클라이언트 상태는 필요한 부분만 분리한다.
3. 캐시/리밸리데이션 정책을 명시한다.
4. 접근성, 메타데이터, 에러/로딩 UI를 포함한다.

## 품질 기준

- 불필요한 use client를 피한다.
- 민감정보가 클라이언트 번들에 노출되지 않게 한다.
- 라우트별 성능 영향을 설명한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
