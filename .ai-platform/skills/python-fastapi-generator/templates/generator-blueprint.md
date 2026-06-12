# python-fastapi-generator Generator Blueprint

## 목적

FastAPI에서 Router, Pydantic Schema, Service, Repository, 테스트 구조를 만든다.

## 입력 계약

- API 요구사항
- Pydantic 모델
- DB/ORM 방식
- 인증 방식
- 비동기 처리 요구

## 생성 순서

1. OpenAPI 계약을 먼저 정리한다.
2. Pydantic 검증과 응답 모델을 명시한다.
3. 비동기/동기 DB 경계를 일관되게 유지한다.
4. pytest로 정상/오류 케이스를 검증한다.

## 기본 출력 패키지

- 라우터/스키마/서비스 코드
- 의존성 주입 구조
- 예외 응답
- pytest 테스트
- 실행 명령

## 사용자에게 확인할 항목

- 프로젝트 루트와 대상 모듈
- 회사 표준/공통 라이브러리 적용 여부
- 인증, 권한, 개인정보, 로그 마스킹 요구사항
- 생성 후 실행할 테스트/빌드 명령
