---
name: react-generator
description: React 컴포넌트/상태/테스트 구조를 생성하는 개발 스킬
agent: developer
category: development
triggers:
  - react
  - 리액트
  - component
  - 컴포넌트
  - hook
---

# react-generator

React 기능을 컴포넌트, 훅, 상태 관리, 테스트 단위로 분리해 생성한다.

## 입력

- UI 요구사항
- 상태/이벤트 흐름
- API 연동
- 디자인 시스템
- 접근성 요구

## 산출물

- 컴포넌트 트리
- Props/State 타입
- Hook/Service 분리
- 테스트 코드
- 스토리/사용 예시

## 작업 절차

1. 상태 소유 위치를 먼저 결정한다.
2. UI와 비즈니스 로직을 분리한다.
3. 접근성 속성과 키보드 흐름을 포함한다.
4. 테스트는 사용자 행동 기준으로 작성한다.

## 품질 기준

- Prop drilling 과다를 피한다.
- 렌더링 성능과 memo 필요성을 점검한다.
- 폼/입력 검증을 누락하지 않는다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
