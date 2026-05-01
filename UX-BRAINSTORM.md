# 자연예쁨의원 UX/UI 브레인스토밍 회의록

**일시**: 2026-05-02
**대상**: arsea-jayeon-text-only 랜딩페이지
**목적**: 사용자 친화도 향상을 위한 디자인·UX 개선안 도출 (PC + 모바일 분리 검토)

---

## 회의 참석자 (10명)

| # | 이름 | 직책 | 관점 |
|---|------|------|------|
| 1 | 이지은 | UX 디렉터 | 정보 위계 · 사용자 여정 · IA |
| 2 | 박민호 | UI 디자이너 | 비주얼 시스템 · 타이포 · 스페이싱 |
| 3 | 김서윤 | 모바일 UX 스페셜리스트 | 모바일 전용 패턴 · 터치 UX |
| 4 | 정현수 | 인터랙션 / 모션 디자이너 | 트랜지션 · 마이크로인터랙션 |
| 5 | 윤소라 | 브랜드 디렉터 | 톤 · 아이덴티티 · 컬러 페르소나 |
| 6 | 김도윤 | CRO / 그로스 마케터 | 전환 최적화 · A/B 후보 |
| 7 | 이재현 | 콘텐츠 전략 / 카피라이터 | 메시지 위계 · 카피 톤 |
| 8 | 박해린 | 사용자 리서처 | 페인 포인트 · 멘탈 모델 |
| 9 | 장유진 | 접근성 / 포용성 디자이너 | a11y · 색 대비 · 키보드 |
| 10 | 신태원 | 퍼포먼스 / SEO 엔지니어 | Core Web Vitals · 구조화 데이터 |

---

## 페이지 현황 스냅샷

- **섹션 11개** (한 페이지 SPA): hero → cases → differentiator → event → portfolio → services → process → director → contact → reviews → faq
- **CSS 3,170줄, JS 663줄, HTML 994줄** — 중급 규모
- **반응형 브레이크포인트**: 1024px / 768px (2개)
- **모션 사용**: 114곳 (transition/animation/cubic-bezier)
- **컬러**: primary `#0063ff` 블루 + 흰 베이스 + 어두운 process 섹션 + 골드(`#c89b5c` director)
- **폰트**: Poppins (영문) + Pretendard Variable (국문)
- **외부 의존성**: Swiper 11
- **카피 톤**: 정밀·1:1·직접 책임 등 의료 신뢰 키워드 (방금 정리 완료)

---

## 라운드 1 — 첫 인상 (각 리더 핵심 발견 1~2개)

### 이지은 (UX 디렉터)
> "**섹션이 11개**, hero → cases는 잘 잡혔지만, FAQ → contact 순서가 반대다. 사용자는 의문 해소 후 예약하는 흐름인데 현재는 contact → reviews → faq로 마지막이 FAQ. **FAQ는 contact 바로 앞에** 와야 한다. 그리고 **cases 카드 클릭 시 어디로 가는가?** 현재 그냥 이미지 + 캡션만 — 케이스를 본 직후 행동 유도가 없다. **cases 카드 hover에 'OO 시술 상담받기' mini-CTA**가 있어야 한다."

### 박민호 (UI 디자이너)
> "비주얼 일관성은 좋다. 하지만 **section-padding이 80~108px로 섹션마다 미세하게 다르다**. 또 **section-title의 폰트 크기**가 섹션 별 다르고 word-break 정책도 다르다 — 모바일에서 줄바꿈이 깨질 위험. **타이포 스케일을 토큰화**(`--h1`, `--h2`, `--body`)하면 일관성 + 유지보수가 좋아진다."

### 김서윤 (모바일 UX)
> "**미디어쿼리가 1024 / 768 두 개뿐**. 360px(갤럭시 S 시리즈), 320px(아이폰 SE 1세대) 같은 작은 디바이스 디테일이 부족하다. 가장 큰 누수: **모바일에서 어디서나 즉시 예약 가능한 CTA가 없다**. 헤더는 햄버거뿐. 페이지 어디서든 'tap → 전화'가 가능해야 한다 → **bottom sticky CTA bar 추가** 필요."

### 정현수 (인터랙션 / 모션)
> "모션 114곳, cubic-bezier 일관성 OK. 다만 **hero auto-play 5초가 모든 슬라이드에 동일** — 카피 길이 다른데 동일 시간이면 첫 슬라이드는 짧고 둘째는 부족할 수 있다. 또 **모바일에서 슬라이드 swipe 가능 여부 표시**(force visible dots, swipe hint 한 번)가 필요. **prefers-reduced-motion 미대응** — 모션 민감 사용자에게 부담."

### 윤소라 (브랜드 디렉터)
> "**'자연예쁨' = 따뜻함 / 친근감**, 그런데 primary `#0063ff`는 차갑고 강한 인상. **브랜드 페르소나와 톤 충돌**. director 섹션의 골드(`#c89b5c`), 누드 베이지를 보조로 도입해 따뜻한 인상을 주고, 블루는 신뢰의 액센트로 쓰는 비율 조정이 필요. 로고가 로고텍스트(NATURAL BEAUTY) 영문 — 한글 보조 없이도 OK이지만, 뱃지에 'LASER CENTER SKIN CLINIC' 영문 보조 표시가 약함."

### 김도윤 (CRO / 그로스 마케터)
> "전환 후크 분석:
> - 1순위: **이벤트 89만원 가격** — hero에 이미 잘 노출
> - 2순위: **시술 전후 사진** — 2번째 섹션으로 잘 끌어올림 (방금 작업)
> - 3순위: **의사 신뢰** — 8번째 섹션이라 늦다
>
> **모바일 전화 CTA 부재**가 가장 큰 누수. 사용자가 페이지 중간에서 전화하고 싶어도 헤더로 스크롤업 해야 한다. **Sticky bottom 'tel:' 버튼**이 들어가면 전환률 +20% 기대."

### 이재현 (콘텐츠 / 카피)
> "방금 카피 톤 정리됐다. **이제 헤딩 길이의 일관성**이 남은 과제. 어떤 섹션은 1줄 ('대표 프로그램'), 어떤 섹션은 3줄 ('대표 프로그램과 이벤트, 진료 안내까지...'). 모바일에서 `<br>`이 의도와 다르게 동작 가능 — `word-break:keep-all` + `<br>` 조합 정책 통일 필요. **section-label(영문)**이 섹션마다 다른 케이스 (Capital Case vs UPPERCASE) — 통일."

### 박해린 (사용자 리서처)
> "피부과 사용자 멘탈 모델: **고민 인식 → 비슷한 사례 보기 → 의사 신뢰 → 가격 확인 → 예약**. 현재 흐름은 좋게 잡혔지만, **director가 8번째**라 cases 본 직후 의사 정보가 없다. **'이 사례를 누가 시술했나?'** 라는 질문에 즉시 답해야 한다 → cases 헤더 옆에 '이은영 대표원장 직접 시술' 라벨, 또는 cases 직후 director 미니 카드 inline 삽입."

### 장유진 (접근성 / 포용성)
> "체크리스트:
> - [✓] alt 텍스트 명확
> - [✓] 일부 aria 적용 (탭 role/aria-selected)
> - [✗] **prefers-reduced-motion 미대응**
> - [✗] **컬러 대비**: `#5b6478` 회색 라벨이 흰 배경에 4.5:1 미달 가능
> - [✗] **키보드 네비**: cases 탭 좌우 화살표 이동 불가
> - [✗] **폰 입력 3개 분리**는 보조 기술 사용자에게 부담 — 1개로 통합 + 자동 포맷
> - [✗] **포커스 스타일** 명시적 outline 부족 (브라우저 기본 의존)"

### 신태원 (퍼포먼스 / SEO)
> "**LCP**: hero 이미지가 LCP 후보. `fetchpriority='high'` + preload 필요. **CLS**: section-reveal 애니메이션이 layout shift를 일으키지 않는지 확인. **TBT**: Swiper + 매거진 카드 setInterval + scroll listener — 모바일에서 무거울 가능. **SEO**:
> - structured data 없음 → MedicalClinic / LocalBusiness schema 추가
> - canonical, sitemap.xml 점검
> - og:image 비율 확인
> - meta description 적절 (150자 정도)"

---

## 라운드 2 — 핵심 토론

### 토론 1: Mobile Bottom Sticky CTA Bar
**찬성**: 김도윤, 김서윤, 박해린 (강력 추진)
**구현**: 화면 하단 fixed 64px height
- 좌측 (60%): 📞 **전화 예약 02-558-5058** (primary blue)
- 우측 (40%): 💬 **카톡 상담** 또는 **케이스 보기** (secondary)
- 데스크톱에서는 우측 하단 플로팅 버튼만 노출
- safe-area-inset-bottom 적용 (iPhone notch 대응)

**박민호**: "현재 body가 `padding-bottom: calc(84px + env(safe-area-inset-bottom))`로 모바일 nav-open 시 잠금하는 코드는 있는데, 일반 시 sticky CTA용 패딩은 없음. 추가해야 함."

**결정**: P0 즉시 구현

---

### 토론 2: 섹션 순서 — FAQ를 Contact 앞으로
**현재**: ... → director → contact → reviews → faq
**제안**: ... → director → faq → reviews(news) → contact

**이지은**: "FAQ는 의문 해소 단계. 그 직후 contact가 와야 자연스럽다."
**김도윤**: "Reviews는 'Clinic News' 즉 사회적 증거. 의사 → 사회적증거 → FAQ → 예약 흐름이 더 강력."
**최종 합의**: ... → director → reviews(news) → faq → contact

**결정**: P0 즉시 구현

---

### 토론 3: Director를 Cases 직후로 미리 보기
**박해린**: "옵션 A — hero slide 1에 '이은영 대표원장 직접 진료' 한 줄 / 옵션 B — cases 헤더에 라벨 / 옵션 C — cases 직후 director 미니 카드"

**윤소라**: "옵션 A는 hero가 무거워진다. 옵션 B는 가벼우면서도 즉시 신뢰. 옵션 C는 새 컴포넌트 필요."
**김도윤**: "옵션 B + C 결합 — cases 헤더에 라벨 + cases 끝에 'director에게 직접 상담받기 →' inline 미니 CTA"

**결정**: 옵션 B + C 결합. P1.

---

### 토론 4: 카드 Hover Mini-CTA
**정현수**: "case-card hover 시 -6px 떠오르고 1.04 zoom 적용됨. 여기에 **하단 슬라이드업 'mini-CTA bar'** 추가 — '이 시술 상담받기 →'"
**박민호**: "9개 카드 모두? 일관 카피보다 카테고리 별 다른 카피?"
**이재현**: "얼굴 카드 → '얼굴 시술 상담', 바디 카드 → '바디 시술 상담' 정도가 자연"

**결정**: P1. 시각적 임팩트 있고 구현 부담 적음.

---

### 토론 5: 보조 컬러 도입
**윤소라**: "primary blue 단독은 차갑다. 따뜻한 누드(#f5e6dc), 베이지(#e8dccb), 골드(#c89b5c) 3톤을 보조로."
**박민호**: "디자인 시스템 토큰을 그대로 두고, **섹션별 액센트**로만 도입. 예: cases → 누드 핑크 카드 hover 라인, services → 골드 액센트, director → 골드(이미 적용)."

**결정**: P2. CSS 변수로 추가 후 점진 도입.

---

### 토론 6: Hero 슬라이드 모바일 최적화
**김서윤**:
- h1 폰트 크기: `clamp(28px, 6vw, 40px)` 권장
- hero-event-card: 모바일에서 width:100%, padding 줄임
- swipe hint: 첫 진입 시 슬라이드 한 번 자동 흔들림 또는 dots를 더 두껍게(터치 ≥44px)

**정현수**: "auto-play를 카피 길이에 따라 가변화 — slide1=5s, slide2=4s, slide3=4s"
**결정**: P0 즉시 구현 (clamp + dots 강화), P2 (가변 auto-play)

---

### 토론 7: Cases 탭 모바일 sticky
**김서윤**: "탭이 위에 있고 카드 6개를 스크롤하면 사용자가 탭 존재를 잊는다. **sticky top: 0** 으로 탭 바를 고정시켜 항상 카테고리 전환 가능."
**정현수**: "Z-index 충돌 없게 헤더와 협상 필요. 또는 sticky offset = 헤더 높이."

**결정**: P1.

---

### 토론 8: 폼 입력 통합
**장유진**: "폰 3필드 분리 → 1필드 + 자동 하이픈 포맷 (`010-1234-5678`). 보조 기술과 일반 사용자 모두 좋다."
**김서윤**: "input[type='tel'] + JS 마스킹. 모바일에서 숫자 키보드 자동."

**결정**: P2.

---

### 토론 9: prefers-reduced-motion
**장유진**: "@media (prefers-reduced-motion: reduce)로 hero auto-play, scroll-reveal, hover transform 등 전역 모션 끄기."
**정현수**: "hover scale·transform은 인터랙션 피드백이라 유지, auto-play와 scroll-reveal만 끔."

**결정**: P2. CSS 한 블록으로 가능.

---

### 토론 10: SEO/퍼포먼스
**신태원** 우선순위:
1. hero 첫 이미지 `<link rel="preload" as="image" fetchpriority="high">`
2. structured data (MedicalClinic) 추가
3. og:image 검증, og:locale=ko_KR 추가
4. font-display:swap 확인 (Pretendard CDN은 OK 가능)
5. lazy loading 모든 이미지 적용 (이미 됨)

**결정**: P1 (preload, structured data), P2 (나머지).

---

### 토론 11: nav 메뉴 압축
**이지은**: "nav 7개 → 5개로 줄임. '클리닉 소식', '진료 원칙'은 푸터로."
**김도윤**: "but '메인 이벤트'는 컨버전 키. 유지."
**최종 5개**: 케이스 / 이벤트 / 프로그램 / 의료진 / 예약

**박민호**: "데스크톱 헤더는 7개도 OK. 문제는 모바일 햄버거. **모바일만 5개로 압축**?"
**최종 합의**: 데스크톱 7개 유지, 모바일 햄버거 5개로 압축 + 푸터에 전체 노출.

**결정**: P2.

---

## 라운드 3 — PC vs 모바일 분리 액션 플랜

### [공통 액션]
| # | 액션 | 변경 파일 |
|---|------|-----------|
| C1 | **섹션 순서 변경**: contact ↔ faq + reviews 위치 조정 (… director → reviews → faq → contact) | index.html |
| C2 | **Cases 헤더 라벨**: "이은영 대표원장이 직접 시술한 사례입니다" | index.html |
| C3 | **Cases 끝 inline director 미니 CTA**: 'director에게 직접 상담받기 →' | index.html, css |
| C4 | **카드 hover mini-CTA**: 'OO 시술 상담받기' 슬라이드업 | css, html |
| C5 | **prefers-reduced-motion 대응** | css |
| C6 | **MedicalClinic structured data** | index.html `<head>` |
| C7 | **hero 첫 이미지 preload + fetchpriority** | index.html `<head>` |
| C8 | **컬러 토큰 추가**: --warm-cream, --warm-gold, --warm-nude | css :root |
| C9 | **타이포 토큰화**: --fs-h1, --fs-h2, --fs-body, --fs-small | css :root |
| C10 | **컬러 대비 점검**: #5b6478 라벨 등 4.5:1 미달 색 교체 | css |

### [PC 전용 액션]
| # | 액션 | 변경 파일 |
|---|------|-----------|
| P1 | **floating CTA**: 우측 하단 'tel + kakao' 플로팅 버튼 | index.html, css, js |
| P2 | **hero auto-play 가변**: slide별 5/4/4초 | js (Swiper config) |
| P3 | **section-padding 통일**: 96px 0 108px → 100px 0 100px | css |
| P4 | **포커스 스타일 명시**: a, button 모두 visible focus ring | css |

### [모바일 전용 액션]
| # | 액션 | 변경 파일 |
|---|------|-----------|
| M1 | **🔥 Bottom sticky CTA bar** (전화 + 카톡/케이스) | index.html, css, js |
| M2 | **Hero h1 클램핑**: `clamp(26px, 7vw, 40px)` | css 768px 미디어 |
| M3 | **Cases 탭 sticky**: top:0 (헤더 offset 보정) | css |
| M4 | **nav 햄버거 5개 압축** | index.html mobile-nav |
| M5 | **swipe dots 두껍게**: 터치 영역 ≥44px | css |
| M6 | **폰 입력 1필드 + 자동 포맷** | index.html, js |
| M7 | **safe-area-inset-bottom 적용**: sticky CTA용 패딩 | css body |
| M8 | **360px 미만 viewport 점검**: hero, cases, contact | css |

---

## 우선순위 매트릭스 (Impact × Effort)

| 우선순위 | 액션 | Impact | Effort | 예상 효과 |
|----------|------|--------|--------|-----------|
| **P0 즉시** | M1 Bottom sticky CTA | 매우 높음 | 낮음 | 모바일 전환률 +15~25% |
| **P0 즉시** | M2 Hero h1 클램핑 | 높음 | 매우 낮음 | 모바일 가독성 |
| **P0 즉시** | C1 FAQ ↔ Contact 순서 | 중간 | 매우 낮음 | 사용자 흐름 자연화 |
| **P0 즉시** | C7 Hero preload (LCP) | 높음 | 낮음 | LCP 개선 |
| **P1** | C3 Cases 끝 director 미니 CTA | 높음 | 낮음 | 신뢰 빠른 구축 |
| **P1** | M3 Cases 탭 sticky | 높음 | 중간 | 탭 발견율 ↑ |
| **P1** | C4 카드 hover mini-CTA | 중간 | 낮음 | 직접 전환 |
| **P1** | C2 Cases 헤더 라벨 | 중간 | 매우 낮음 | 신뢰 강화 |
| **P1** | C6 Structured data | 높음 (SEO) | 낮음 | 검색 노출 |
| **P1** | P1 PC floating CTA | 중간 | 낮음 | 데스크톱 전환 |
| **P2** | C8/C9 디자인 토큰화 | 중간 | 중간 | 유지보수 |
| **P2** | C5 prefers-reduced-motion | 낮음 | 낮음 | a11y |
| **P2** | M6 폰 1필드 통합 | 중간 | 중간 | 폼 완료율 |
| **P2** | M4 모바일 nav 5개 압축 | 낮음 | 매우 낮음 | 인지 부하 ↓ |
| **P2** | C10 컬러 대비 | 낮음 | 낮음 | a11y |
| **P3** | 보조 컬러 점진 도입 | 중간 | 높음 | 브랜드 톤 |
| **P3** | P2 hero auto-play 가변 | 낮음 | 낮음 | UX 디테일 |

---

## 결론 (의장 발언 — 이지은)

> "오늘 회의에서 가장 큰 합의는 두 가지다.
>
> **첫째, 모바일 컨버전 누수 1순위는 'sticky CTA 부재'**. P0로 즉시 구현해야 한다. 비용은 낮고 효과는 가장 높다.
>
> **둘째, 사용자 멘탈 모델에 맞춘 흐름 재배치**. cases 직후 director 미리 보기 + FAQ를 contact 앞으로. 이미 cases는 2번째로 끌어올렸으니 이 둘만 더하면 사용자 여정이 매우 자연스러워진다.
>
> **카피는 이미 정리됐고, 시각·인터랙션·a11y는 점진 개선이 가능**하다. 지금 단계에서는 컨버전 직결 P0/P1 먼저 끝내고, 그다음 디자인 토큰화·a11y를 점진적으로 도입하자.
>
> P0 4건 (Bottom CTA, Hero clamp, FAQ 순서, Hero preload)부터 시작하면 빠르게 임팩트를 볼 수 있다."

---

## 다음 단계 제안

사용자에게 다음 옵션 중 선택 요청:

1. **P0만 일괄 구현** (즉시, 1~2시간 소요)
2. **P0 + P1까지 구현** (반나절 소요)
3. **P0~P3 전체 구현** (1~2일 소요)
4. **추가 토론 필요한 항목 별도 회의**
