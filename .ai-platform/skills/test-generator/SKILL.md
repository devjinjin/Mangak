---
name: test-generator
description: 요구사항과 코드 변경에 맞는 테스트를 생성하는 품질 스킬
agent: tester
category: quality
triggers:
  - test generator
  - 테스트 생성
  - unit test
  - integration test
  - e2e
---

# test-generator

단위/통합/E2E 테스트 케이스와 코드를 생성한다.

## 입력

- 요구사항
- 대상 코드
- 테스트 프레임워크
- 외부 의존성
- 엣지 케이스

## 산출물

- 테스트 목록
- 테스트 코드
- fixture/mock 전략
- 실행 명령
- 커버리지 갭

## 작업 절차

1. 행동 기준 테스트명을 작성한다.
2. 정상/오류/경계 케이스를 나눈다.
3. 외부 의존성은 테스트 목적에 맞게 격리한다.
4. 실행 명령과 기대 결과를 기록한다.

## 품질 기준

- 구현 상세만 테스트하지 않는다.
- 스냅샷 남용을 피한다.
- 실패 재현 가능한 입력을 남긴다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
