import http from 'http';
import console from 'console';

export default function DeviceControl({ applianceName, actionType }) {
  try {
    if (!applianceName || !actionType) {
      return { 
        statusMessage: `🙏 음... 뭔가 빠진 것 같아요! 기기명과 액션을 다시 한번 확인해 주세요. 🙏`,
        name: " ", 
        imageUrl: "images/icons/error.jpg"
      };
    }

    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/control/device/${applianceName}?timestamp=${timestamp}`;
    const body = { action: actionType };


    const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0MjEyNDgyMCwiZXhwIjoxNzQyNzI5NjIwfQ.1TpizVCPFXafq5I7vXD7GFsFOwjJdIVqVcBYIOox65g";
    //임의로 토큰 하드코딩

    const options = {
      passAsJson: true,
      returnHeaders: false,
      format: 'json',
      headers: {
        'Authorization': `Bearer ${accessToken}`, //  토큰을 Authorization 헤더에 추가
        'Content-Type': 'application/json'
      }
    };

    const response = http.postUrl(url, body, options);

    console.log(`✅ [로그] POST 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

    // ✅ 응답에서 plugName을 가져와서 name으로 사용
    const deviceName = response?.plugName || "알 수 없음";

    const isOn = actionType.toLowerCase() === "on";
    const imageUrl = isOn
      ? "images/icons/deviceon.png"
      : "images/icons/deviceoff.png";

    if (response?.status === "success") {
      return {
        statusMessage: `이(가) ${actionType} 상태로 변경되었습니다.`,
        name: deviceName, //  plugName을 name으로 설정
        imageUrl: imageUrl
      };
    } else {
      return {
        statusMessage: `이(가) ${actionType} 상태로 변경하는 데 실패했어요.`,
        name: deviceName,
        imageUrl: imageUrl
      };
    }
  } catch (error) {
    console.error("[오류] 서버 요청 중 오류 발생:", error);
    return {
      statusMessage: "😵‍💫 서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요.",
      name: " ",
      imageUrl: "images/icons/error.jpg"
    };
  }
}
