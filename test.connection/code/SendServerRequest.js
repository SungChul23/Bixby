import http from 'http'; // Bixby에서 http 모듈 가져오기
import console from 'console'; // Bixby에서 log 모듈 가져오기

export default function sendServerRequest({
  requestType,
  applianceName
}) {
  let response;

  try {
    if (requestType === 'GET') {
      // GET 요청을 처리
      const timestamp = new Date().getTime();
      response = http.getUrl(`https://jkah.shop/getTest?timestamp=${timestamp}`, {
        format: 'json',
        headers: {
          'Cache-Control': 'no-cache' // 캐시 방지
        }
      });
      return {
        message: response.message ? response.message : "응답 메시지가 없습니다",
      };

    } else if (requestType === 'POST' && applianceName) {

      // POST 요청을 처리
      const timestamp = new Date().getTime();

      const body = {
        message: applianceName // 'applianceName' 값을 message로 전송
      };

      const options = {
        passAsJson: true, //기본적으로  json 형식 
        returnHeaders: true,
        format: 'json',
        headers: {
          'Authorization': 'Bearer <your-auth-token>', // 인증 헤더 추가 할거임

        }
      };

      response = http.postUrl(`https://jkah.shop/postTest?timestamp=${timestamp}`, body, options);

      console.log('서버 응답 전체: ', JSON.stringify(response)); // 서버 응답을 로그로 출력

      return {
        message: response.parsed.message ? response.parsed.message : "응답 메시지가 없습니다.",
        userMessage: response.parsed.userMessage ? response.parsed.userMessage : "유저 메시지가 없습니다."
      };

    } else {
      throw new Error("POST 요청에는 가전 기기 이름이 필요합니다 !!");
    }
  } catch (error) {
    console.error('서버 요청 중 오류가 발생했습니다: ', error); // 오류 로그 출력
    throw new Error("서버 요청 중 오류가 발생했습니다.");
  }
}
