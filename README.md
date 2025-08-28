# 🔌 깜빡 (Blink AI)
> **"깜빡 잊고 켜둔 전기, 음성으로 제어해보자"**  
IoT 플러그 + AI 전력 예측 + 빅스비 음성 제어 기반의 스마트홈 에너지 관리 시스템  

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/mainlogo.png" width="400">
</p>

---

## 🧠 1. 빅스비란 무엇인가?
빅스비(Bixby)는 삼성전자가 개발한 **AI 음성 비서 플랫폼**으로, 한국어 인식 성능이 우수하고 Android 기반 기기와의 호환성이 뛰어납니다.  
본 프로젝트에서는 빅스비 캡슐을 활용하여 IoT 플러그를 자연어 기반 음성 명령으로 제어할 수 있도록 구현하였습니다.  

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/logobixby.png" width="250">
</p>

---

## 🎯 2. 빅스비를 적용한 이유
사용자 중심의 스마트홈 시스템을 구현하기 위해 사전 설문조사를 진행한 결과, 많은 사용자들이 **음성 명령 기반의 직관적인 제어**를 선호하는 것으로 나타났습니다.  
이에 따라 본 프로젝트는 한국어 인식 성능과 호환성이 뛰어난 빅스비를 채택하여, **자연어 기반의 음성 제어 환경**을 제공하였습니다.  

특히, 1인 가구 및 스마트홈 초기 사용자들에게 **손쉬운 접근성과 직관적인 UX**를 제공한다는 점에서 빅스비는 효과적인 선택이었습니다.  

---

## 🏗️ 3. 시스템 아키텍처
MQTT 프로토콜을 기반으로, **App / Bixby / IoT 서버 / AI 서버 / 데이터베이스** 간의 흐름을 설계하였습니다.  
- 클라이언트(App, Bixby) → 서버 → IoT 제어 → AI 학습 모델 → DB 저장  
- 각 모듈은 인증, 데이터 전송, 제어 및 응답 과정을 수행하며, 주기적 전력 사용 데이터를 AI 모델로 학습시켜 **예측·알림 기능**을 제공합니다.  

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/blinkarchitecture.png" width="650">
</p>

---

## 🧩 4. 빅스비 캡슐 구조
사용자의 발화 예: **“선풍기 켜줄래”**  
- 제어 대상 기기명 (applianceName)  
- 동작 유형 (actionType)  
- 사용자 인증 정보 (userSession)  

이 값들은 `DeviceControl.model.bxb` 모델 파일에 매핑되고, 이후 `DeviceControl.js` 액션 코드에서 API 호출 및 제어 로직이 실행됩니다.  
최종 결과는 `DeviceControlResult`로 사용자에게 시각적·언어적 피드백을 제공합니다.  

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbystructure.png" width="650">
</p>

---

## 🗣️ 5. 발화 어휘 정규화 및 유사어 매핑
사용자는 같은 의미를 여러 방식으로 표현할 수 있습니다.  
예: **“에어컨 켜”**, **“냉방기 가동시켜”**, **“쿨러 온”** → 모두 동일 명령으로 처리  

이를 위해 `.vocab` 파일을 활용해 다양한 유사 표현을 정규화하고, 일관된 슬롯 값으로 매핑합니다.  

| 플러그 ID | 기기명 (유사 표현) |
|-----------|------------------|
| eb93422b93d4779663cltg | 핸드폰충전기, 휴대폰충전기, 스마트폰충전기 |
| ebf3b877b6c2a593eefygj | 에어컨, 냉방기, 쿨러 |
| eb8fd0a2d8c5f32c06eewp | 전자레인지, 렌지, 마이크로파오븐 |
| eb5607bd7dcddce97bsmno | 컴퓨터본체, 본체, PC, 데스크탑 |
| ebaa3d69095c0f9048iipj | 컴퓨터모니터, 모니터, 디스플레이, PC모니터 |

| 동작 유형 | 액션명 (유사 표현) |
|-----------|-------------------|
| on  | 켜, 가동시켜, 키자, 켜줄래, 온, 스타트 |
| off | 꺼, 멈춰, 꺼자, 꺼줄래, 오프, 스탑 |

---

## 🔐 6. OAuth 기반 인증 절차
로그인이 필요한 발화가 수행되면, 빅스비 캡슐은 서버와 연동하여 **OAuth 2.0 인증 절차**를 거칩니다.  

<p align="center">
  <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyOauth.png" width="650">
</p>

1. 사용자 발화 전달  
2. 빅스비 서버 검사  
3. OAuth 2.0 인증 서버(카카오)와 연동 → 액세스 토큰 발급  
4. 빅스비 서버가 카카오 토큰을 AWS 서버용 내부 토큰으로 변환 요청  
5. AWS 내부 로직에서 최종 서비스 토큰 생성  
6. 빅스비 서버가 사용자에게 토큰 전달 → 인증 완료  

이 과정은 **보안성과 연동성**을 동시에 보장합니다.  

---

## ⚙️ 7. 주요 기능

### 7-1) 기본 기능

#### 🟢 로그인 / 로그아웃
- 발화 예시  
  - "로그인하자"  
  - "로그인 해줘"  
  - "로그아웃 할래"  

| 로그인 | 로그아웃 |
|--------|----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/login.jpg" width="300"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/logout.jpg" width="300"> |

---

#### 🔌 기기 제어 / 그룹 제어
- 발화 예시  
  - "[기기명] 켜"  
  - "[기기명] 꺼줄래"  
  - "[그룹명] 시작하자"  

| 기기 제어 | 그룹 제어 |
|-----------|-----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/control.jpg" width="300"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/listcontrol.jpg" width="300"> |

---

#### 📡 기기 상태 확인
- 발화 예시  
  - "[기기명] 켜져있어?"  
  - "[기기명] 전원 들어왔어?"  
  - "[기기명] 상태 알려줘"  

| 기기 상태 |
|-----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/state.jpg" width="300"> |

---

#### 📋 그룹 리스트 확인
- 발화 예시  
  - "그룹 리스트 보여줘"  
  - "무슨 그룹 있어?"  
  - "동작 가능한 그룹 알려줘"  

| 그룹 리스트 |
|-------------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/list.jpg" width="300"> |

---

#### 📱 깜빡 앱 이동
- 발화 예시  
  - "깜빡 앱 실행"  
  - "깜빡 열어줘"  
  - "깜빡 앱 켜"  

| 깜빡 앱 이동 |
|---------------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/moveapp.jpg" width="300"> |

---

### 7-2) 예외 상황 처리

#### 🚫 플러그가 없을 때 (기기 제어 / 상태 확인)
- 발화 예시  
  - "[기기명] 켜"  
  - "[기기명] 꺼"  
  - "[기기명] 상태 알려줘"  

| 플러그 없음 |
|-------------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/nocontrol.jpg" width="300"> |

---

#### 🚫 등록된 리스트 및 그룹이 없을 때
- 발화 예시  
  - "그룹 리스트 보여줘"  
  - "무슨 그룹 있어?"  
  - "등록된 그룹 확인해줘"  

| 리스트 없음 | 그룹 없음 |
|-------------|-----------|
| <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/nolist.jpg" width="300"> | <img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyui/nogroup.jpg" width="300"> |

---
