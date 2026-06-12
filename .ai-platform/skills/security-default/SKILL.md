---
name: security-default
description: 보안 취약점·시크릿 노출·인증/인가 검토 기본 스킬
agent: security
default: true
---

# Security 기본 스킬

보안 취약점, 시크릿 노출, 인증/인가를 검토한다.

## 작업 절차

1. API Key/Token/Secret이 코드·로그·문서에 원문 노출되는지 확인한다 (계획서 25.3).
2. 입력 검증·인젝션·권한 상승 경로를 점검한다.
3. High/Critical MCP 사용이 승인 정책을 따르는지 확인한다 (계획서 13.3).

## 품질 기준

- 발견 항목은 위험도와 조치 방안을 함께 기록한다.
