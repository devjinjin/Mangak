---
name: architecture-standard
description: 회사 아키텍처 표준과 모듈 경계를 적용하는 표준 스킬
agent: architect
category: standard
triggers:
  - architecture standard
  - 아키텍처 표준
  - 모듈
  - 레이어
---

# architecture-standard

레이어, 모듈, 의존 방향, 배포 단위를 회사 표준과 프로젝트 상황에 맞춘다.

## 입력

- 시스템 목적
- 현재 구조
- 품질 속성
- 제약사항
- 배포 방식

## 산출물

- 아키텍처 원칙
- 모듈 경계
- 의존성 규칙
- ADR 후보
- 리스크

## 작업 절차

1. 품질 속성을 우선순위화한다.
2. 모듈별 책임과 금지 의존성을 정한다.
3. 확장/운영/보안 관점을 함께 검토한다.

## 품질 기준

- 과도한 추상화를 피한다.
- 순환 의존을 허용하지 않는다.
- 중요 결정은 ADR로 남긴다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
