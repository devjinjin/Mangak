---
name: aws-deploy
description: AWS 내부 배포 아키텍처와 배포 절차를 설계하는 운영 스킬
agent: architect
category: operations
triggers:
  - aws
  - ecs
  - eks
  - lambda
  - cloudformation
  - terraform
---

# aws-deploy

AWS에 애플리케이션을 안전하게 배포하기 위한 리소스와 절차를 설계한다.

## 입력

- 서비스 요구
- 계정/리전
- 네트워크
- 보안/IAM
- 비용 제약

## 산출물

- AWS 리소스 설계
- IAM/보안 그룹
- 배포 파이프라인
- 모니터링
- 롤백 절차

## 작업 절차

1. 계정/리전/환경 분리를 확인한다.
2. 최소 권한 IAM을 설계한다.
3. 네트워크 노출과 비용을 점검한다.
4. IaC 우선으로 산출한다.

## 품질 기준

- 공개 접근을 기본값으로 두지 않는다.
- 과권한 IAM을 피한다.
- 비용 영향과 알람을 포함한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
