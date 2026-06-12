---
name: egov-generator
description: eGovFrame/eGov 기반 업무 화면·서비스·DAO·쿼리 구조를 생성하는 개발 스킬
agent: developer
category: development
triggers:
  - egov
  - egovframe
  - 전자정부
  - eGovFrame
  - 전자정부프레임워크
---

# egov-generator

전자정부 표준 프로젝트에서 Controller, Service, VO, Mapper/DAO, JSP/API 흐름을 생성한다.

## 입력

- 업무 기능명
- 메뉴/권한 정보
- 테이블 또는 VO 정의
- 검색/페이징 조건
- 전자정부 버전/템플릿

## 산출물

- 업무 모듈 구조
- Controller/Service/VO/Mapper 코드
- 검색/페이징 처리
- 권한/검증 포인트
- 테스트 시나리오

## 작업 절차

1. 기존 eGov 패키지 접두사와 공통 컴포넌트를 확인한다.
2. VO/DTO와 Mapper 쿼리를 먼저 정렬한다.
3. 전자정부 공통 페이징/메시지/예외 방식을 따른다.
4. 권한, 감사 로그, 개인정보 항목을 점검한다.

## 품질 기준

- 전자정부 표준 명명 규칙을 따른다.
- SQL 인젝션 위험을 제거한다.
- 공통 컴포넌트 중복 구현을 피한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
