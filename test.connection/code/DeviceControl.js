import http from 'http';
import console from 'console';

export default function DeviceControl({ applianceName, actionType }) {
  try {
    if (!applianceName || !actionType) {
      return { statusMessage: "🙏 음... 뭔가 빠진 것 같아요! 기기명과 액션을 다시 한번 확인해 주세요. 🙏" };
    }

    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/control/device/${applianceName}?timestamp=${timestamp}`;
    const body = { action: actionType };

    const options = {
      passAsJson: true,
      returnHeaders: false,
      format: 'json',
      headers: {
        'Authorization': 'Bearer <your-auth-token>',
        'Content-Type': 'application/json'
      }
    };

    const response = http.postUrl(url, body, options);

    console.log(`✅ [로그] POST 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

    // ✅ 액션 타입에 따라 다른 메시지 반환
    if (response?.status === "success") {
      const icon = actionType.toLowerCase() === "on" ? "💡" : "🔴";
      return { statusMessage: `${icon} 해당 기기를 ${actionType}으로 변경했어요! ${icon}` };
    } else {
      const icon = actionType.toLowerCase() === "on" ? "💡" : "🔴";
      return { statusMessage: `${icon} 해당 기기를 ${actionType}으로 변경하는 데 실패했어요. ${icon}` };
    }
  } catch (error) {
    console.error("[오류] 서버 요청 중 오류 발생:", error);
    return { statusMessage: "😵‍💫 서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요." };
  }
}
