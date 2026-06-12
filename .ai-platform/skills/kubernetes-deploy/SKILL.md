---
name: kubernetes-deploy
description: Kubernetes 배포 매니페스트/Helm/검증 절차를 작성하는 운영 스킬
agent: developer
category: operations
triggers:
  - kubernetes
  - k8s
  - helm
  - 쿠버네티스
  - 배포
---

# kubernetes-deploy

Kubernetes 배포 리소스, 설정, 롤백, 헬스체크 절차를 만든다.

## 입력

- 서비스 특성
- 이미지/태그
- 환경변수/secret
- 리소스 요구
- Ingress/Service

## 산출물

- Deployment/Service/Ingress
- ConfigMap/Secret 참조
- Helm values
- 검증/롤백 명령

## 작업 절차

1. namespace와 환경을 확인한다.
2. 리소스 request/limit와 probes를 설정한다.
3. secret은 외부 저장소 참조로 둔다.
4. rollout/rollback 명령을 제시한다.

## 품질 기준

- 0.0.0.0 공개 범위를 확인한다.
- secret 원문을 커밋하지 않는다.
- readiness/liveness probe를 누락하지 않는다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
