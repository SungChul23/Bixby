import http from 'http'; // Bixby에서 http 모듈 가져오기
import console from 'console'; // Bixby에서 log 모듈 가져오기

export default function sendServerRequest({
  requestType,
  applianceName,
  actionType // 추가된 파라미터
}) {
  let response;

  try {
    if (requestType === 'GET') {
      // GET 요청을 처리
      const timestamp = new Date().getTime();
      response = http.getUrl(`http://jkah.shop:5000/getTest?timestamp=${timestamp}`, { // 매 요청을 고유하게 만들자 (캐시 방지)
        format: 'json',
        headers: {
          'Cache-Control': 'no-cache' // 캐시 방지
        }
      });
      return {
        message: response.message ? response.message : "응답 메시지가 없습니다.",
      };

    } else if (requestType === 'POST' && applianceName && actionType) {
      // POST 요청을 처리
      const timestamp = new Date().getTime();

      // JSON 형식으로 기기명과 상태를 전달
      const body = {
        actual_device: applianceName, // 기기명
        action: actionType, // 상태
        message: '${applianceName}, ${actionType}'

      };

      const options = {
        passAsJson: true, // 기본적으로 JSON 형식
        returnHeaders: true,
        format: 'json',
        headers: {
          'Authorization': 'Bearer <your-auth-token>', // 인증 헤더 추가 (필요시)
        }
      };

      response = http.postUrl(`https://jkah.shop/postTest?timestamp=${timestamp}`, body, options); // 매 요청을 고유하게 만들자 (캐시 방지)

      console.log('서버 응답 전체: ', JSON.stringify(response)); // 서버 응답을 로그로 출력

      return {
        message: response.parsed.message ? response.parsed.message : "응답 메시지가 없습니다.",
        userMessage: response.parsed.userMessage ? response.parsed.userMessage : "유저 메시지가 없습니다."
      };

    } else {
      throw new Error("POST 요청에는 기기 이름과 상태가 필요합니다!!");
    }
  } catch (error) {
    console.error('서버 요청 중 오류가 발생했습니다: ', error); // 오류 로그 출력
    throw new Error("서버 요청 중 오류가 발생했습니다.");
  }
}
