---
name: adr-generator
description: Architecture Decision Record를 생성하는 프로젝트 관리 스킬
agent: architect
category: project
triggers:
  - adr
  - architecture decision
  - 의사결정 기록
  - 기술 결정
---

# adr-generator

중요 기술/구조 결정을 ADR로 남긴다.

## 입력

- 결정 배경
- 선택지
- 제약사항
- 영향 범위
- 결정권자

## 산출물

- ADR 문서
- 대안 비교
- 결정
- 결과/후속 작업

## 작업 절차

1. 문제와 맥락을 분리한다.
2. 대안을 장단점으로 비교한다.
3. 결정과 근거를 명확히 적는다.
4. 재검토 조건을 포함한다.

## 품질 기준

- 결정 없는 회의록을 만들지 않는다.
- 대안 비교를 생략하지 않는다.
- 영향 범위를 기록한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
