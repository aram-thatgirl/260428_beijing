# SK China · Beijing AI Training — 수강생 대시보드

2026-04-28 SK China 베이징 오피스에서 진행되는 AI 활용 교육의 수강생용 정적 대시보드입니다. 수강생은 이 사이트에서 실습 프롬프트를 한·중 비교로 복사하고, 만족도 설문 CSV 두 버전을 다운로드하며, 각 Part의 체크리스트로 진행 상황을 확인할 수 있습니다.

## 구성

```
dashboard/
├── index.html
├── assets/
│   ├── style.css
│   ├── app.js
│   └── data/
│       ├── prompts.js
│       ├── SK_China_AI_Training_Satisfaction_Survey_KR.csv
│       └── SK_China_AI_Training_Satisfaction_Survey_CN.csv
├── .nojekyll
└── README.md
```

순수 HTML · CSS · JavaScript로만 구성되어 빌드 과정이 없습니다. 어떤 정적 호스팅 환경에서도 그대로 동작합니다.

## 로컬에서 실행

`index.html`을 바로 열면 브라우저 보안 정책 때문에 CSV 다운로드가 막힐 수 있습니다. 간단한 로컬 서버를 띄워 사용하세요.

```bash
# Python 있을 때
cd dashboard
python -m http.server 8000

# Node 있을 때
npx serve dashboard
```

그런 다음 `http://localhost:8000` 에 접속합니다.

## GitHub Pages로 배포

```bash
cd dashboard
git init
git add .
git commit -m "Initial dashboard"
git branch -M main
git remote add origin git@github.com:<USER>/<REPO>.git
git push -u origin main
```

리포지토리 **Settings → Pages** 에서 Source를 `main / (root)` 로 설정하면 몇 분 뒤 `https://<USER>.github.io/<REPO>/` 에서 대시보드가 뜹니다. `.nojekyll` 파일이 포함돼 Jekyll 처리 없이 그대로 서빙됩니다.

## 주요 기능

- **한·중 프롬프트 비교** — 프롬프트팩의 13개 프롬프트(마크다운 3 · 4원칙 1 · 할루시네이션 제어 1 · Part 2 #1–#4 · Part 3 #5–#7 · Part 4 #8)를 한국어/中文 탭으로 열람하고, 섹션 상단의 **한·중 비교** 버튼으로 두 언어를 좌우 나란히 볼 수 있습니다.
- **외부 AI 도구 빠른 실행** — 화면 어디에서나 우측 하단 플로팅 버튼 두 개로 즉시 접속:
  - **Kimi** (`kimi.com`) — Part 4 PPT 실습용
  - **千问 / Qianwen** (`www.qianwen.com`) — Part 2–3 분석·리서치용
- **원클릭 복사** — 각 언어 카드의 **Copy** 버튼으로 클립보드에 복사합니다 (`navigator.clipboard` + `execCommand` 폴백).
- **CSV 두 버전 다운로드** — 한국어·중국어 혼재 반을 위해 주 언어 비율이 다른 두 파일을 별도 제공합니다.
- **체크리스트** — 할루시네이션 3원칙, 클리닝·교차 검증·출처 검증 등 실습 중 체크할 항목을 클릭으로 토글합니다 (세션 내 유지).
- **스크롤 스파이 네비게이션** — 현재 보고 있는 섹션이 상단 내비게이션에서 강조됩니다.
- **인쇄 대응** — 인쇄 시 네비·버튼은 숨고, 모든 프롬프트는 한·중 비교 모드로 자동 전환됩니다.

## 콘텐츠 구조

| 섹션 | 내용 |
|---|---|
| Hero · Overview | 일시 · 5단 파이프라인 · 도구 스택 (DeepSeek + Qwen / Kimi K2.6) |
| Part 1 · 프롬프트 기초 | 4원칙 · 마크다운 3 + 4원칙 적용 + 할루시네이션 제어 예시 · 할루시네이션 3유형 / 3원칙 |
| Part 2 · 데이터 분석 | 데이터 스펙 · 실습 프롬프트 #1–#4 · 클리닝 · 교차 검증 체크리스트 |
| Part 3 · AI 리서치 | 검색 연산자 6종 · 실습 프롬프트 #5–#7 · 출처 검증 체크리스트 |
| Part 4 · PPT 제작 | Kimi 워크플로우 · 피라미드 구조 · 실습 프롬프트 #8 · 실패 대응 |
| Closing | 핵심 요약 3개 · 활용 시나리오 6종 |
| Data · FAQ | CSV 두 버전 · 6개 FAQ (DeepThink 모드 포함) |

## 브라우저 지원

최신 Chrome · Edge · Safari · Firefox에서 동작합니다. Internet Explorer는 지원하지 않습니다.

## 데이터에 대해

CSV 두 파일의 모든 응답은 교육용 가상 샘플입니다. 정량 지표 (전반만족도 4.12 · 강사만족도 4.34 등) 와 의도된 결함 (중복 ID R027, 척도 이상값 R028 등) 은 두 버전에서 동일하며, 차이는 자유 텍스트의 언어 비율뿐입니다.

---

© 2026 · Aram Kim · 본 사이트는 교육 실습 목적으로만 사용하세요.
