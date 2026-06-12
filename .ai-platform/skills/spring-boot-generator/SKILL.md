---
name: spring-boot-generator
description: Spring Boot 기반 API/서비스/테스트 골격을 회사 표준에 맞춰 생성하는 개발 스킬
agent: developer
category: development
triggers:
  - spring
  - spring boot
  - 스프링
  - rest api
  - jpa
---

# spring-boot-generator

Spring Boot 프로젝트에서 Controller, Service, Repository, DTO, 테스트 골격을 일관된 계층 구조로 생성한다.

## 입력

- 기능 요구사항
- 도메인/엔티티 후보
- API 경로와 메서드
- 인증/권한 요구사항
- DB/트랜잭션 제약

## 산출물

- 패키지 구조
- Controller/Service/Repository/DTO 코드
- 예외/응답 규격
- 단위/통합 테스트
- 실행/검증 명령

## 작업 절차

1. 기존 패키지와 네이밍 규칙을 확인한다.
2. API 계약과 DTO를 먼저 정의한다.
3. Service에는 비즈니스 규칙과 트랜잭션 경계를 둔다.
4. Repository는 조회 목적별로 분리하고 N+1 위험을 점검한다.
5. 테스트와 실행 명령을 함께 제공한다.

## 품질 기준

- 계층 의존 방향을 위반하지 않는다.
- 설정값을 하드코딩하지 않는다.
- 입력 검증과 예외 응답을 포함한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
