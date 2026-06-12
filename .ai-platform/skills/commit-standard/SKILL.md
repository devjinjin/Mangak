---
name: commit-standard
description: 커밋 메시지와 변경 단위를 회사 표준에 맞추는 표준 스킬
agent: reviewer
category: standard
triggers:
  - commit
  - 커밋
  - conventional commit
  - 메시지
---

# commit-standard

변경사항을 의미 있는 커밋 단위로 나누고 표준 메시지를 작성한다.

## 입력

- git diff/status
- 작업 목적
- 이슈/티켓 번호
- 릴리즈 영향

## 산출물

- 커밋 단위 제안
- 커밋 메시지
- 본문/푸터
- 검증 체크

## 작업 절차

1. 변경 유형을 분류한다.
2. 관련 없는 변경은 분리한다.
3. 테스트 결과를 커밋 전 확인한다.

## 품질 기준

- 보호 브랜치 직접 커밋을 피한다.
- 민감정보 포함 여부를 확인한다.
- 메시지에 구현 세부보다 사용자 가치를 담는다.

## 사용 원칙

- 내부 개발 도구용 스킬이다. 외부 공개나 public marketplace 배포를 전제로 하지 않는다.
- 프로젝트의 기존 구조, 회사 표준, 보안 정책, Definition of Ready/Done을 우선한다.
- 모호한 입력은 가정하지 말고 필요한 확인 질문과 누락 문맥을 먼저 정리한다.
