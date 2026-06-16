# Current State

> 마지막 갱신: 2026-06-16T03:20:33.258Z

## 현재/최근 작업
다음 목표를 구현해줘:
기존 데이터 구조에는 설명, 암기설명 이 있는데 "두음" 이라는 데이터를 추가로 두고 싶어. 프로젝트내 BASE_DATA.json 구조에 dueum 이라는 것을 추가 하고 싶은거야. 기존 데이터 구조에 방해가 가지 않도록 추가를 해줘

[이 프로젝트의 최근 개발 히스토리 — 아래 맥락을 이어서 작업해줘]
- [바이브] 이전 작업내역을 알려줘 → 이전 작업 내역을 정리하면 다음과 같습니다.

## 프로젝트 개요
**Mangak** — 간격 반복 학습(SRS, Spaced Repetition System) 기반 학습 관리 웹앱입니다. (React + Vite + TypeScript, IndexedDB 사용, GitHub Pages 배포)

## 커밋 내역 (총 2개)

**
- [바이브] 해당 코드들을 분석을 해줘. → 전체 소스를 분석했습니다. 코드 분석 결과를 정리해 드립니다.

# Mangak 코드 분석

## 1. 프로젝트 정체성

| 항목 | 내용 |
|------|------|
| 실제 앱 이름 | **TechMaster Recall** (package.json name은 `techmaster-recall`, UI 헤더도 동일) 
- [바이브] 해당 내용 동작에 유념해서 개선처리 진행해줘 → 타입체크 통과(EXIT:0), `importData` 소비처는 `Settings.tsx` 하나뿐이라 반환 타입 변경에 따른 영향도 없습니다. 순환 의존성도 없습니다(`db → srs → types`, 단방향).

## 완료한 개선 — Import 안정성 강화

최근 커밋 흐름(JSON 가져오기 예외처리)을 이
- [바이브] Mangak을 브랜드로 할거야. UX 개선이 필요한 부분도 진행을 해줘 → 남은 `techmaster-recall`은 의도적으로 유지한 `DB_NAME` 하나뿐입니다(주석으로 이유 명시). 변경 결과를 정리합니다.

## 완료 — Mangak 브랜딩 + UX 개선

### 1) 브랜딩 통일 (`TechMaster Recall` → `Mangak`)
사용자에
- [Agent·코드 리뷰] 타입체크 통과(EXIT:0). `BASE_DATA.json`은 앱 코드에서 import되지 않는 **수동 가져오기용 데이터 파일**이며, 가져올 때 `normalizeTopic()`이 `dueum` 누락을 자동 보정하므로 안전합니다.

## 작업 완료 요약

기존 데이터 구조에 영향 없이 **두음(`dueum`)** 필드를 추가했습니다. `memorizat

-----

두음을 암기 설명 위로 올려주고 http://localhost:5173/#/review 정답보기 위에 두음보기 버튼을 추가해줘

## 사용 Runner
claude-code

## 상태
실행 실패

## 비고

