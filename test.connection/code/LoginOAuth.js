import http from 'http';
import console from 'console';

export const authorization = "KakaoLogin"; // ✅ 필수!

export default function LoginOAuth(input) {
  const { $vivContext } = input;
  const accessToken = $vivContext?.accessToken;

  console.log("🪪 access_token ▶", accessToken);

  // ✅ 현재 시각 기준 타임스탬프 추가
  const timestamp = new Date().getTime();
  const url = `https://kapi.kakao.com/v2/user/me?timestamp=${timestamp}`;

  const response = http.oauthGetUrl(url, {
    format: 'json',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });

  console.log("🔁 Kakao 응답 ▶", response);

  return {
    nickname: response.properties?.nickname || '이름 없음',
    access_token: accessToken || '토큰 없음'  // ✅ 함께 반환
  };
}
