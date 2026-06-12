---
name: prd-generator
description: PRD/Product Requirements Document를 생성하는 프로젝트 관리 스킬
agent: planning
category: project
triggers:
  - prd
  - 제품 요구사항
  - 요구사항 정의
  - 기획서
---

# prd-generator

제품/기능 요구사항을 PRD 형식으로 구조화한다.

## 입력

- 문제 정의
- 대상 사용자
- 비즈니스 목표
- 기능 범위
- 제약/일정

## 산출물

- PRD 문서
- 기능 요구사항
- 비기능 요구사항
- 수용 기준
- 오픈 질문

## 작업 절차

1. 목표와 성공지표를 정의한다.
2. 사용자 시나리오와 범위를 나눈다.
3. FR/NFR과 우선순위를 부여한다.
4. 불확실성은 질문으로 남긴다.

## 품질 기준

- 구현 세부를 PRD에 과도하게 넣지 않는다.
- 제외 범위를 명시한다.
- 검증 가능한 수용 기준을 작성한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
