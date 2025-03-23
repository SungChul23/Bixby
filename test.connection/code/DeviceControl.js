import http from 'http';
import console from 'console';
import fetchAccessToken from './fetchAccessToken'; // accessToken을 가져오는 함수

export default function DeviceControl({ applianceName, actionType }) {
  try {
    if (!applianceName || !actionType) {
      return { 
        success: false,
        statusMessage: `뭔가 빠진 것 같아요! 기기명과 액션을 다시 한번 확인해 주세요.`,
        name: " ", 
        imageUrl: "images/icons/error.png"
      };
    }

    // ✅ Secrets에서 accessToken 가져오기
    const accessToken = fetchAccessToken();

    if (!accessToken) {
      console.log("🚨 accessToken을 가져올 수 없습니다. 로그인 필요.");
      return {
        success: false,
        statusMessage: "로그인이 필요합니다. 다시 로그인해 주세요.",
        name: " ",
        imageUrl: "images/icons/error.jpg"
      };
    }

    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/control/device/${applianceName}?timestamp=${timestamp}`;
    const body = { action: actionType };

    const options = {
      passAsJson: true,
      returnHeaders: false,
      format: 'json',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const response = http.postUrl(url, body, options);

    console.log(`✅ [로그] POST 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

    const deviceName = response?.plugName || "알 수 없음";
    const isOn = actionType.toLowerCase() === "on";
    const imageUrl = isOn
      ? "images/icons/deviceon.png"
      : "images/icons/deviceoff.png";

    if (response?.status === "success") {
      return {
        success: true, // ✅ 성공 여부 전달
        statusMessage: `${deviceName}이(가) ${actionType} 상태로 변경되었습니다.`,
        name: deviceName,
        imageUrl: imageUrl
      };
    } else {
      return {
        success: false, // ✅ 실패도 명시
        statusMessage: `${deviceName}이(가) ${actionType} 상태로 변경하는 데 실패했어요.`,
        name: deviceName,
        imageUrl: imageUrl
      };
    }
  } catch (error) {
    console.error("[오류] 서버 요청 중 오류 발생:", error);
    return {
      success: false, // ✅ 예외 발생도 실패 처리
      statusMessage: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요.",
      name: " ",
      imageUrl: "images/icons/error.png"
    };
  }
}
