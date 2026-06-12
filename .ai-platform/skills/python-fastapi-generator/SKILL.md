---
name: python-fastapi-generator
description: Python FastAPI 라우터/스키마/서비스/테스트 골격을 생성하는 개발 스킬
agent: developer
category: development
triggers:
  - fastapi
  - python api
  - 파이썬 api
  - pydantic
  - uvicorn
---

# python-fastapi-generator

FastAPI에서 Router, Pydantic Schema, Service, Repository, 테스트 구조를 만든다.

## 입력

- API 요구사항
- Pydantic 모델
- DB/ORM 방식
- 인증 방식
- 비동기 처리 요구

## 산출물

- 라우터/스키마/서비스 코드
- 의존성 주입 구조
- 예외 응답
- pytest 테스트
- 실행 명령

## 작업 절차

1. OpenAPI 계약을 먼저 정리한다.
2. Pydantic 검증과 응답 모델을 명시한다.
3. 비동기/동기 DB 경계를 일관되게 유지한다.
4. pytest로 정상/오류 케이스를 검증한다.

## 품질 기준

- 타입 힌트와 응답 모델을 누락하지 않는다.
- 전역 mutable 상태를 피한다.
- secret은 환경변수로만 참조한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
