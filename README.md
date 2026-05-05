<div align="center">

<img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/mainlogo.png" alt="깜빡 로고" width="600px"/>

# 🔌 깜빡 (Blink)

**깜빡 잊고 켜둔 전기, 음성으로 제어해보자**

> IoT 스마트 플러그 + AI 전력 예측 + 빅스비 음성 제어 기반의 스마트홈 에너지 관리 시스템

</div>

---

## 🏆 수상

| 대회 | 수상 |
|------|------|
| 2025 제2회 전국대학 소프트웨어 성과 공유 포럼 (과학기술정보통신부, 부산광역시) | 🥇 최우수상 · 동아대학교 총장상 |

---

## 📌 목차

1. [프로젝트 배경 & 기획 의도](#1-프로젝트-배경--기획-의도)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [나의 역할 — Bixby 캡슐](#4-나의-역할--bixby-캡슐)
5. [핵심 구현 상세](#5-핵심-구현-상세)
6. [트러블슈팅](#6-트러블슈팅)
7. [주요 기능 & UI](#7-주요-기능--ui)

---

## 1. 프로젝트 배경 & 기획 의도

**"1인 가구의 가장 흔한 실수 — 켜놓고 나온 전자기기"**

사전 설문조사 결과, 응답자 다수가 외출 후 전자기기를 켜둔 경험이 있었으며 음성 명령 기반의 제어가 가장 직관적이고 편리하다고 답했습니다. 리모컨이나 앱 UI는 손이 자유롭지 않을 때 불편하고, 물리 스위치는 외출 후엔 의미가 없습니다.

이에 **IoT 플러그 + 음성 제어 + AI 전력 예측**을 결합하여, 어디서든 자연어 한 마디로 기기를 제어하고 전력 낭비를 줄이는 시스템을 설계했습니다.

### 왜 빅스비(Bixby)인가?

<img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/logobixby.png" width="180" align="right"/>

여러 음성 플랫폼(Alexa, Google Assistant 등)을 비교 검토한 끝에 빅스비를 선택했습니다.

| 비교 기준 | 선택 이유 |
|-----------|-----------|
| 한국어 인식 성능 | 국내 사용자 환경에서 가장 높은 자연어 이해(NLU) 정확도 |
| 기기 호환성 | Android 기반 삼성 기기와의 높은 연동성 |
| 개발 유연성 | 캡슐(Capsule) 구조로 복잡한 서비스 로직 구현 가능 |

<br>

빅스비는 단순한 음성 입력 수단이 아니라, 사용자의 자연어 발화를 구조화하여 실제 기기 제어 로직으로 연결하는 **중앙 허브 역할**을 담당합니다.

---

## 2. 기술 스택

**Bixby 캡슐**  
![Bixby](https://img.shields.io/badge/Bixby_Studio-1428A0?style=flat&logo=samsung&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

**Backend**  
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-660066?style=flat&logoColor=white)

**Cloud & Database**  
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazonaws&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

**Auth**  
![Kakao](https://img.shields.io/badge/Kakao_OAuth-FFCD00?style=flat&logo=kakao&logoColor=black)

---

## 3. 시스템 아키텍처

MQTT 프로토콜을 기반으로 **App / Bixby / IoT 서버 / AI 서버 / DB** 간의 데이터 흐름을 설계했습니다.

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/blinkarchitecture.png" width="700"/>
</p>

```
클라이언트 (App / Bixby)
    └─▶ IoT 서버 (기기 제어 · 인증)
            ├─▶ IoT 플러그 (MQTT 제어)
            └─▶ AI 서버 (전력 예측 모델 학습)
                    └─▶ DB (전력 사용 데이터 저장 · 알림)
```

- 클라이언트의 명령이 서버를 통해 IoT 플러그로 전달
- 주기적으로 수집된 전력 사용 데이터를 AI 모델로 학습 → 예측 및 이상 알림 제공

---

## 4. 나의 역할 — Bixby 캡슐

> 담당 파트: 빅스비 캡슐 설계 및 전체 구현

- **발화 파싱 구조 설계** — 자연어 발화를 기기명·동작 유형·사용자 인증 3개 슬롯으로 구조화
- **어휘 정규화 (.vocab)** — 유사 표현 매핑으로 다양한 발화 패턴을 단일 슬롯 값으로 통일
- **OAuth 2.0 인증 연동** — 카카오 OAuth → AWS 내부 토큰 변환 플로우 구현
- **예외 처리 UX** — 기기 미등록, 그룹 없음 등 다양한 예외 상황에 대한 자연어 피드백 설계
- **발화 시나리오 설계** — 로그인·기기 제어·상태 확인·그룹 관리 등 전체 발화 어휘 정의

---

## 5. 핵심 구현 상세

### 4-1. 빅스비 캡슐 처리 흐름

사용자가 *"선풍기 켜줄래"* 라고 말하면, 빅스비는 이를 즉시 실행하지 않습니다.

```
사용자 발화 ("선풍기 켜줄래")
    └─▶ 의미 단위 파싱 (NLU)
            ├─ 기기명      : applianceName = "선풍기"
            ├─ 동작 유형   : actionType   = "on"
            └─ 사용자 인증 : userSession
                    └─▶ DeviceControl.model.bxb (Goal 전달)
                            └─▶ DeviceControl.js (API 호출 · 기기 제어)
                                    └─▶ DeviceControlResult → 자연어 피드백 반환
```

자연어 → 구조화된 파라미터 → 서비스 로직 실행 → 사용자 피드백의 흐름으로 동작합니다.

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbystructure.png" width="650"/>
</p>

---

### 4-2. 발화 어휘 정규화 — 유사어 매핑

같은 의미도 사용자마다 표현 방식이 다릅니다. `.vocab` 파일로 다양한 유사 표현을 하나의 슬롯 값으로 정규화했습니다.

> 예: **"에어컨 켜"** / **"냉방기 가동시켜"** / **"쿨러 온"** → 동일한 명령으로 처리

**기기 어휘 매핑**

| 기기 | 인식 표현 |
|------|-----------|
| 핸드폰 충전기 | 핸드폰충전기, 휴대폰충전기, 스마트폰충전기 |
| 에어컨 | 에어컨, 냉방기, 쿨러 |
| 전자레인지 | 전자레인지, 렌지, 마이크로파오븐 |
| 컴퓨터 본체 | 컴퓨터본체, 본체, PC, 데스크탑 |
| 컴퓨터 모니터 | 컴퓨터모니터, 모니터, 디스플레이, PC모니터 |

**동작 어휘 매핑**

| 동작 | 인식 표현 |
|------|-----------|
| ON  | 켜, 가동시켜, 키자, 켜줄래, 온, 스타트 |
| OFF | 꺼, 멈춰, 꺼자, 꺼줄래, 오프, 스탑 |

---

### 4-3. OAuth 2.0 인증 플로우

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyOauth.png" width="650"/>
</p>

```
① 사용자 발화
② 빅스비 서버 검사
③ 카카오 OAuth 2.0 인증 → 액세스 토큰 발급
④ 빅스비 서버가 카카오 토큰을 AWS 서버용 토큰으로 변환 요청
⑤ AWS 내부 로직에서 서비스 토큰 생성
⑥ 사용자에게 토큰 전달 → 인증 완료
```

보안성과 서비스 연동성을 동시에 확보하는 구조입니다.

---

## 6. 트러블슈팅

<details>
<summary><b>① OAuth 2.0 연동 — 카카오 토큰과 빅스비 세션의 불일치</b></summary>
<br>

**문제**

빅스비 캡슐에서 카카오 OAuth 인증을 연동할 때, 카카오에서 발급된 액세스 토큰을 빅스비 서버가 그대로 수용하지 않는 문제가 있었습니다. 빅스비는 자체 세션 관리 방식이 있어, 외부 OAuth 토큰을 내부 서비스 토큰으로 변환하는 별도 레이어가 필요했습니다. 또한 토큰 만료 시 재발급 플로우가 빅스비 캡슐 생명주기와 맞지 않아 인증이 중간에 끊기는 현상이 발생했습니다.

**해결**

카카오 OAuth 토큰을 그대로 사용하지 않고, 빅스비 서버 → AWS 서버 간 토큰 변환 레이어를 별도로 설계했습니다. 빅스비가 카카오 토큰을 받아 AWS 서버에 전달하면, AWS 내부 로직에서 서비스 전용 토큰을 새로 발급하는 방식으로 분리했습니다. 토큰 만료 처리도 이 레이어에서 일괄 핸들링하여 캡슐 세션 단절 문제를 해결했습니다.

</details>

<details>
<summary><b>② 발화 파싱 실패 — 같은 의도, 다른 표현의 슬롯 매핑 오류</b></summary>
<br>

**문제**

빅스비의 NLU는 학습된 발화 패턴 외의 표현이 들어오면 슬롯을 잘못 인식하거나 아예 매핑에 실패하는 경우가 잦았습니다. 특히 기기명 슬롯에서 문제가 컸는데, "에어컨"은 정상 인식되지만 "냉방기", "쿨러"는 다른 슬롯으로 분류되거나 미인식으로 처리되었습니다. 동작 유형 슬롯도 마찬가지로 "켜줄래", "가동시켜", "온" 같은 유사 표현이 일관되게 처리되지 않았습니다.

**해결**

`.vocab` 파일을 활용한 어휘 정규화 레이어를 구축했습니다. 기기명·동작 유형별로 사용자가 실제로 사용할 법한 유사 표현을 최대한 수집하여 단일 슬롯 값으로 매핑했습니다. 또한 학습 발화(Training Utterance)를 다양한 패턴으로 반복 등록하여 NLU 인식률을 높였고, 슬롯 미인식 시 사용자에게 재발화를 유도하는 예외 처리 응답도 별도로 설계했습니다.

</details>

---

## 7. 주요 기능 & UI

### 기본 기능

<details>
<summary><b>🔐 로그인 / 로그아웃</b></summary>
<br>

발화 예시: *"로그인하자"* / *"로그아웃 할래"*

| 로그인 | 로그아웃 |
|--------|----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/login.jpg" width="280"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/logout.jpg" width="280"> |

</details>

<details>
<summary><b>🔌 기기 제어 / 그룹 제어</b></summary>
<br>

발화 예시: *"[기기명] 켜"* / *"[그룹명] 시작하자"*

| 기기 제어 | 그룹 제어 |
|-----------|-----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/control.jpg" width="280"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/listcontrol.jpg" width="280"> |

</details>

<details>
<summary><b>📡 기기 상태 확인</b></summary>
<br>

발화 예시: *"[기기명] 켜져있어?"* / *"[기기명] 상태 알려줘"*

| 기기 상태 |
|-----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/state.jpg" width="280"> |

</details>

<details>
<summary><b>📋 그룹 리스트 확인</b></summary>
<br>

발화 예시: *"그룹 리스트 보여줘"* / *"무슨 그룹 있어?"*

| 그룹 리스트 |
|-------------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/list.jpg" width="280"> |

</details>

<details>
<summary><b>📱 깜빡 앱 이동</b></summary>
<br>

발화 예시: *"깜빡 앱 실행"* / *"깜빡 열어줘"*

| 앱 이동 |
|---------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/moveapp.jpg" width="280"> |

</details>

---

### 예외 처리

<details>
<summary><b>🚫 예외 상황 대응</b></summary>
<br>

등록된 기기·그룹이 없는 경우에도 자연어 피드백으로 안내합니다.

| 플러그 없음 | 리스트 없음 | 그룹 없음 |
|-------------|-------------|-----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/nocontrol.jpg" width="220"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/nolist.jpg" width="220"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/nogroup.jpg" width="220"> |

</details>
