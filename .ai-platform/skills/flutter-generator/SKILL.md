---
name: flutter-generator
description: Flutter 화면·상태관리·서비스·테스트 골격을 생성하는 개발 스킬
agent: developer
category: development
triggers:
  - flutter
  - 플러터
  - dart
---

# flutter-generator

Flutter 앱의 화면, 상태관리, API 클라이언트, 테스트 구조를 생성한다.

## 입력

- 화면 요구사항
- 상태관리 방식
- API 명세
- 플랫폼 권한
- 디자인 가이드

## 산출물

- Widget 구조
- State/Provider/BLoC 구조
- Service/Repository 코드
- 권한/에러 처리
- Widget/Unit 테스트

## 작업 절차

1. 화면과 도메인 상태를 분리한다.
2. 비동기 로딩/에러/빈 상태를 포함한다.
3. 플랫폼 권한과 보안 저장소 사용 여부를 확인한다.

## 품질 기준

- BuildContext 오남용을 피한다.
- 민감정보를 평문 저장하지 않는다.
- 반응형/접근성 요구를 반영한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
