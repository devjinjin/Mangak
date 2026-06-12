---
name: security-review
description: 변경사항을 보안 관점으로 리뷰하는 품질 스킬
agent: security
category: quality
triggers:
  - security review
  - 보안 리뷰
  - 취약점
  - secret scan
---

# security-review

인증/인가, 입력 검증, secret, 로그, 의존성 취약점을 리뷰한다.

## 입력

- diff
- 위협 모델
- 인증/권한 구조
- 데이터 민감도
- 외부 연동

## 산출물

- 보안 리뷰 결과
- 위험도
- 재현/공격 시나리오
- 조치 방안
- 검증 명령

## 작업 절차

1. 공격 표면을 식별한다.
2. 권한 우회와 입력 검증을 점검한다.
3. secret/로그/오류 메시지를 확인한다.
4. 의존성 취약점과 설정 노출을 본다.

## 품질 기준

- 추정만으로 취약점이라고 단정하지 않는다.
- 위험도를 분류한다.
- 조치 후 검증 방법을 제시한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
