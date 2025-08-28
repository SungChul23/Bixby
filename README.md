# 🔌 깜빡 (Blink AI)
> **"깜빡 잊고 켜둔 전기, 음성으로 제어해보자"**  
IoT 플러그 + AI 전력 예측 + 빅스비 음성 제어 기반의 스마트홈 에너지 관리 시스템

---

## 🧠 1. 빅스비란 무엇인가?

<img src="https://blinkbixby.s3.ap-northeast-2.amazonaws.com/logobixby.png" width="200" align="right">

빅스비(Bixby)는 삼성전자가 개발한 **AI 음성 비서 플랫폼**으로, 단순한 명령 수행을 넘어 **자연어 이해(NLU)** 기술을 기반으로 사용자의 의도를 파악하고 맞춤형 응답을 제공합니다.  
특히 한국어 음성 인식 성능이 뛰어나며, 스마트폰을 비롯해 가전, 웨어러블 등 다양한 삼성 디바이스와의 높은 호환성을 자랑합니다.  

본 프로젝트에서는 이러한 빅스비의 강점을 활용하여 IoT 플러그와 연결되는 **빅스비 캡슐(Bixby Capsule)**을 제작하였고, 사용자가 “전등 꺼줄래?”, “컴퓨터 켜” 같은 **자연어 발화**를 통해 직관적으로 기기를 제어할 수 있도록 구현했습니다.  
즉, 빅스비는 단순한 음성 입력 수단을 넘어, 사용자의 명령을 구조화하여 실제 기기 제어와 서비스 로직으로 연결하는 **중앙 허브 역할**을 수행합니다.  

---

## 🎯 2. 빅스비를 적용한 이유
스마트홈 환경에서는 리모컨, 앱 UI, 물리적 스위치 등 다양한 제어 수단이 존재하지만, **1인 가구나 바쁜 현대인**에게는 손이 자유롭지 않을 때 쉽게 접근할 수 있는 방법이 필요합니다.  
이를 검증하기 위해 진행한 사전 설문조사에서는, 응답자의 다수가 “음성 명령 기반의 제어 기능이 가장 직관적이고 편리하다”라고 답변했습니다.  

이에 따라 본 프로젝트에서는 여러 음성 플랫폼(Alexa, Google Assistant 등)을 비교 검토했으며,  
- 한국어 인식 성능  
- 안드로이드 기반 기기와의 높은 호환성  
- 개발 환경의 유연성  

을 고려하여 **빅스비를 최종 선택**했습니다.  
덕분에 사용자는 버튼 클릭이나 별도의 앱 실행 없이 **자연어 발화만으로 기기 상태 확인, 제어, 그룹 관리** 등을 수행할 수 있게 되었으며, 이는 접근성과 사용자 경험(UX)을 크게 향상시켰습니다.  

---

## 🏗️ 3. 시스템 아키텍처
다음 그림은 MQTT 프로토콜 기반의 **깜빡 프로젝트 전체 아키텍처**를 나타낸 것입니다.  

![System Architecture](https://blinkbixby.s3.ap-northeast-2.amazonaws.com/blinkarchitecture.png)

---

## 🧩 4. 빅스비 캡슐 구조
사용자가 “선풍기 켜줄래”라고 말하면, 빅스비는 이를 그대로 실행하지 않습니다.  
대신 발화를 **의미 단위로 구조화(Parsing)** 하여,  
1. 제어 대상 기기명 *(applianceName)*  
2. 동작 유형 *(actionType)*  
3. 사용자 인증 정보 *(userSession)*  
의 세 가지 입력 요소로 나눕니다.  

이후 이 요소들은 `DeviceControl.model.bxb` 파일의 **Goal**(목표 단위)로 전달되고, 실제 동작은 `DeviceControl.js` 액션 코드에서 수행됩니다.  
이 단계에서 API 호출 또는 내부 로직이 실행되어 기기가 제어되며, 처리 결과는 `DeviceControlResult`를 통해 사용자에게 **자연스러운 언어 피드백**으로 전달됩니다.  

즉, 빅스비 캡슐은 **자연어 → 구조화된 파라미터 → 서비스 로직 실행 → 사용자 피드백**의 흐름을 담당하며, 사용자 발화를 실제 서비스 동작으로 연결하는 **중추적 역할**을 담당합니다.  

![Bixby Capsule Flow](https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbystructure.png)

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
로그인이 필요한 발화가 수행되면, 빅스비 캡슐은 서버와 연동하여 OAuth 2.0 기반 인증을 진행합니다.  

![OAuth Flow](https://blinkbixby.s3.ap-northeast-2.amazonaws.com/bixbyOauth.png)

1. 사용자 발화 전달  
2. 빅스비 서버 검사  
3. OAuth 2.0 인증 서버(카카오)와 연동 → 액세스 토큰 발급  
4. 빅스비 서버가 카카오 토큰을 AWS 서버용 내부 토큰으로 변환 요청  
5. AWS 내부 로직에서 최종 서비스 토큰 생성  
6. 빅스비 서버가 사용자에게 토큰 전달 → 인증 완료  

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
