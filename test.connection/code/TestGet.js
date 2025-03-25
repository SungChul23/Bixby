import http from 'http';
import fetchAccessToken from './fetchAccessToken'; // accessToken을 가져오는 함수

export default function () {
  // 필요 시 input에서 값을 가져올 수 있음
  // const { arg1, arg2 } = input;

  const accessToken = fetchAccessToken();

  const response = http.getUrl('https://jkah.shop:8443/bixby/test', {
    format: 'text',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return {
    messages: response.message  // 서버에서 { "message": "테스트 성공" } 형태로 응답해야 함
  };
}
