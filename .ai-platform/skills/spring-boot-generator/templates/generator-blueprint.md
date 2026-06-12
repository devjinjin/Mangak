# spring-boot-generator Generator Blueprint

## 목적

Spring Boot 프로젝트에서 Controller, Service, Repository, DTO, 테스트 골격을 일관된 계층 구조로 생성한다.

## 입력 계약

- 기능 요구사항
- 도메인/엔티티 후보
- API 경로와 메서드
- 인증/권한 요구사항
- DB/트랜잭션 제약

## 생성 순서

1. 기존 패키지와 네이밍 규칙을 확인한다.
2. API 계약과 DTO를 먼저 정의한다.
3. Service에는 비즈니스 규칙과 트랜잭션 경계를 둔다.
4. Repository는 조회 목적별로 분리하고 N+1 위험을 점검한다.
5. 테스트와 실행 명령을 함께 제공한다.

## 기본 출력 패키지

- 패키지 구조
- Controller/Service/Repository/DTO 코드
- 예외/응답 규격
- 단위/통합 테스트
- 실행/검증 명령

## 사용자에게 확인할 항목

- 프로젝트 루트와 대상 모듈
- 회사 표준/공통 라이브러리 적용 여부
- 인증, 권한, 개인정보, 로그 마스킹 요구사항
- 생성 후 실행할 테스트/빌드 명령
