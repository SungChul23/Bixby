import http from 'http';
import console from 'console';

export default function DeviceControl({ applianceName, actionType }) {
  try {
    if (!applianceName || !actionType) {
      return "🙏 음... 뭔가 빠진 것 같아요! 기기명을 다시 한번 확인해 주세요. 🙏";
    }

    const timestamp = new Date().getTime(); // 타임스탬프 추가하여 요청을 고유하게 설정
    const url = `https://jkah.shop:8443/control/device/${applianceName}?timestamp=${timestamp}`;
    const body = { action: actionType };

    const options = {
      passAsJson: true,
      returnHeaders: false, // 리턴 헤더 비활성화
      format: 'json',
      headers: {
        'Authorization': 'Bearer <your-auth-token>', // 나중에 토큰
        'Content-Type': 'application/json'
      }
    };

    const response = http.postUrl(url, body, options);

    console.log(`✅ [로그] POST 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

    // `status`가 "success"인 경우 사용자에게 맞춤형 응답 반환
    if (response?.status === "success") {
      return `😁 플러그 제어에 성공했어요 😁`;
    } else if (response?.message) {
      return response.message;  // 기존 메시지 반환
    } else {
      console.error("[오류] 응답에 status 및 message 필드 없음");
      return "🤔 서버에서 이상한 응답을 보냈어요! 다시 시도해 주세요. 🤔";
    }
  } catch (error) {
    console.error("[오류] 서버 요청 중 오류 발생:", error);
    return "😵‍💫 서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요. ";
  }
}
