---
name: decision-memory
description: 중요 의사결정을 재사용 가능한 형태로 기록하는 기억 스킬
agent: architect
category: memory
triggers:
  - decision memory
  - 결정 기억
  - 의사결정
  - decision log
---

# decision-memory

프로젝트의 중요한 결정과 이유, 대안을 시간순으로 기록한다.

## 입력

- 결정 내용
- 맥락
- 대안
- 근거
- 영향 범위

## 산출물

- decision log 항목
- ADR 연결
- 재검토 조건
- 후속 작업

## 작업 절차

1. 결정과 논의를 분리한다.
2. 대안과 기각 이유를 적는다.
3. 영향 받는 모듈/팀을 명시한다.

## 품질 기준

- 결정자와 날짜를 빼먹지 않는다.
- 결과만 쓰고 근거를 생략하지 않는다.
- 번복 조건을 기록한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
