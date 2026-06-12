---
name: docker-deploy
description: Dockerfile/Compose/이미지 빌드·실행 절차를 작성하는 운영 스킬
agent: developer
category: operations
triggers:
  - docker
  - dockerfile
  - compose
  - 컨테이너
---

# docker-deploy

애플리케이션을 컨테이너 이미지로 빌드하고 로컬/내부 환경에서 실행 가능하게 만든다.

## 입력

- 런타임
- 빌드 명령
- 포트
- 환경변수
- 스토리지 요구

## 산출물

- Dockerfile
- docker-compose.yaml
- 빌드/실행 명령
- 헬스체크
- 보안 점검

## 작업 절차

1. 멀티스테이지 빌드를 우선 검토한다.
2. non-root 사용자와 최소 이미지를 적용한다.
3. 환경변수와 볼륨을 문서화한다.

## 품질 기준

- 이미지에 secret을 bake하지 않는다.
- 불필요한 포트를 열지 않는다.
- 캐시/레이어 크기를 점검한다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
