---
name: architect-default
description: 아키텍처·DB·API·기술스택 설계 기본 스킬
agent: architect
default: true
---

# Architect 기본 스킬

아키텍처, DB, API, 기술스택을 설계한다.

## 작업 절차

1. 회사 하네스 문서의 제약을 우선 적용한다 (계획서 9.2 문서 우선순위).
2. 모듈 경계와 의존 방향을 명확히 정의한다 (Interface→Core→Infrastructure→Shared).
3. 설계 결정마다 근거를 decisions에 남길 수 있도록 "결정/배경"을 분리해 서술한다.

## 품질 기준

- 새 기능이 어느 모듈에 속하는지 분류 기준을 제시한다.
- DB 변경은 마이그레이션 영향도를 함께 기술한다.
