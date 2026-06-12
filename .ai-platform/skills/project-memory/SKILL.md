---
name: project-memory
description: 프로젝트 장기 기억을 구조화하고 갱신하는 기억 스킬
agent: planning
category: memory
triggers:
  - project memory
  - 프로젝트 기억
  - 프로젝트 요약
  - memory
---

# project-memory

프로젝트 목적, 구조, 제약, 현재 상태를 재사용 가능한 기억으로 정리한다.

## 입력

- 프로젝트 README
- 현재 상태
- 주요 제약
- 최근 변경
- 운영 정보

## 산출물

- project-summary 갱신안
- current-state 갱신안
- constraints 갱신안
- 다음 작업

## 작업 절차

1. 오래 유지될 사실만 기록한다.
2. 임시 진행상황과 장기 사실을 분리한다.
3. 출처 파일과 갱신 이유를 남긴다.

## 품질 기준

- 일시적 TODO를 장기 기억에 넣지 않는다.
- 비밀값을 기록하지 않는다.
- 검증되지 않은 추정을 사실처럼 쓰지 않는다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
