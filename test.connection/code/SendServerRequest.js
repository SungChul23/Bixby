import http from 'http';
import console from 'console';

export default function sendServerRequest({
  applianceName,
  actionType
}) {
  try {
    if (!applianceName || !actionType) {
      return { message: "잘못된 요청입니다. 기기명과 액션을 확인하세요." };
    }

 const timestamp = new Date().getTime(); //현재 시간 타임스탬프 추가로 매 요청 고유하게 수정
    const url = `https://jkah.shop:8443/control/device/${applianceName}?timestamp=${timestamp}`; 
    const body = { action: actionType };

    const options = {
      passAsJson: true,
      returnHeaders: false, // 일단 리턴 헤더 비활성화
      format: 'json',
      headers: {
        'Authorization': 'Bearer <your-auth-token>',
        'Content-Type': 'application/json'
      }
    };

    const response = http.postUrl(url, body, options);

    
    console.log(`POST 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

    // 🔹 응답이 정상적으로 들어오는지 확인 후 처리
    if (response && response.message) {
      return { message: response.message }; 
    } else if (response?.body?.message) {
      return { message: response.body.message };
    } else {
      console.error("[오류] 응답에 message 필드가 없음");
      return { message: "서버에서 올바른 응답을 받지 못했습니다." };
    }
  } catch (error) {
    console.error('서버 요청 중 오류 발생:', error);
    return {
      message: "서버 요청 중 오류가 발생했습니다. 다시 시도해 주세요."
    };
  }
}
