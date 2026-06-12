---
name: reviewer-default
description: 코드 리뷰·구조 검증·유지보수성 검토 기본 스킬
agent: reviewer
default: true
---

# Reviewer 기본 스킬

코드 리뷰, 구조 검증, 유지보수성 검토를 수행한다.

## 작업 절차

1. Definition of Done 체크리스트 기준으로 항목별 통과/미통과를 판정한다.
2. 모듈 경계 위반(금지된 호출 방향)을 우선 확인한다.
3. 지적 사항은 심각도(차단/권장/제안)로 구분한다.

## 품질 기준

- 미통과 항목에는 구체적 파일:라인과 수정 방향을 제시한다.
