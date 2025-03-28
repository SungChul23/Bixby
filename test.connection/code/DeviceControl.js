import http from 'http';
import console from 'console';

export default function DeviceControl({
  applianceName,
  actionType,
  userSession
}) {
  try {
    // ✅ 필수 값 체크
    if (!applianceName || !actionType) {
      return {
        success: false,
        statusMessage: `뭔가 빠진 것 같아요! 기기명과 액션을 다시 한번 확인해 주세요.`,
        name: " ",
        imageUrl: "images/icons/error.png"
      };
    }

    // ✅ userSession 안전하게 확인 + accessToken 꺼내기
    if (!userSession || !userSession.accessToken || userSession.accessToken === '없음') {
      console.log("🚨 accessToken이 유효하지 않음. 로그인 필요.");
      return {
        success: false,
        statusMessage: "로그인이 필요합니다. 먼저 로그인해 주세요.",
        name: " ",
        imageUrl: "images/icons/error.png"
      };
    }

    const accessToken = userSession.accessToken;
    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/control/device/${applianceName}?timestamp=${timestamp}`;
    const body = {
      action: actionType
    };

    const options = {
      passAsJson: true,
      returnHeaders: false,
      format: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const response = http.postUrl(url, body, options);

    console.log(`✅ [로그] POST 요청 응답 ▶ ${JSON.stringify(response, null, 2)}`);

    const deviceName = response?.plugName || "알 수 없음";
    const isOn = actionType.toLowerCase() === "on";
    const imageUrl = isOn ?
      "images/icons/deviceon.png" :
      "images/icons/deviceoff.png";

    if (response?.status === "success") {
      return {
        success: true,
        statusMessage: `${deviceName}이(가) ${actionType} 상태로 변경되었습니다 :D`,
        name: deviceName,
        imageUrl: imageUrl
      };
    } else {
      return {
        success: false,
        statusMessage: `${deviceName}이(가) ${actionType} 상태로 변경하는 데 실패했어요.`,
        name: deviceName,
        imageUrl: imageUrl
      };
    }

  } catch (error) {
    console.error("[오류] 서버 요청 중 오류 발생:", error);

    // ✅ 404 응답 처리
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      let errorMessage = "제어하려는 플러그가 없습니다.";
      try {
        const body = error.response?.body;
        if (body && typeof body === 'object') {
          errorMessage = body.message || errorMessage;
        }
      } catch (e) {
        console.log("❗ 404 메시지 파싱 실패:", e);
      }

      return {
        success: false,
        statusMessage: errorMessage,
        name: " ",
        imageUrl: "images/icons/error.png"
      };
    }

    // ✅ 기타 서버 오류
    return {
      success: false,
      statusMessage: "해당 기기가 존재하지 않아요.",
      name: " ",
      imageUrl: "images/icons/error.png"
    };
  }
}