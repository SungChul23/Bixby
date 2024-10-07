import http from 'http'; // Bixby에서 http 모듈 가져오기

export default function sendServerRequest({
  requestType,
  applianceName
}) {
  let response;

  try {
    if (requestType === 'GET') {
      // GET 요청을 처리
      const timestamp = new Date().getTime(); // 타임스탬프 추가하여 매번 고유한 요청으로 만듦
      response = http.getUrl(`https://jkah.shop/getTest?timestamp=${timestamp}`, {
        format: 'json',
        headers: {
          'Cache-Control': 'no-cache' // 캐시 방지
        }
      });

      // message와 userMessage를 기본값으로 처리하여 반환
      return {
        message: response.message ? response.message : "응답 메시지가 없습니다",
      };

    } else if (requestType === 'POST' && applianceName) {
      // POST 요청을 처리 
      const timestamp = new Date().getTime(); // 타임스탬프 추가하여 매번 고유한 요청으로 만듦
      response = http.postUrl(`https://jkah.shop/postTest?timestamp=${timestamp}`, {
        format: 'json',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' // 캐시 방지
        },
        body: {
          message: applianceName
        }
      });

      // 서버 응답에 message와 userMessage 추가
      return {
        message: response.message ? response.message : "응답 메시지가 없습니다",
        userMessage: response.userMessage ? response.userMessage : null // userMessage가 없을 경우 null로 설정
      };
    } else {
      throw new Error("POST 요청에는 가전 기기 이름이 필요합니다 !!");
    }
  } catch (error) {
    throw new Error("서버 요청 중 오류가 발생했습니다.");
  }
}
