import http from 'http';
import console from 'console';

export const authorization = "KakaoLogin"; // 필수!

export default function LoginOAuth(input) {
  const {
    $vivContext
  } = input;

  console.log("🧠 [DEBUG] $vivContext ▶", JSON.stringify($vivContext, null, 2));

  const kakaoToken = $vivContext?.accessToken;

  console.log("🪪 [DEBUG] kakaoToken ▶", kakaoToken);

  console.log("🪪 카카오 access_token ▶", kakaoToken);

  const timestamp = new Date().getTime();
  const kakaoUrl = `https://kapi.kakao.com/v2/user/me?timestamp=${timestamp}`;

  try {
    // 1️⃣ 카카오 사용자 정보 조회
    const kakaoResponse = http.oauthGetUrl(kakaoUrl, {
      format: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });

    const nickname = kakaoResponse?.properties?.nickname || '이름 없음';
    console.log("👤 카카오 닉네임 ▶", nickname);

    // 2️⃣ 내 서버에 카카오 토큰 전달 (쿼리 파라미터 방식)
    const url = `https://jkah.shop:8443/kakao/flutter?accessToken=${encodeURIComponent(kakaoToken)}&timestamp=${timestamp}`;

    const serverResponse = http.getUrl(url, {
      format: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 3️⃣ 서버에서 받은 access token (주의: 카멜케이스!)
    const myAccessToken = serverResponse?.accessToken || '없음';
    console.log("🎟️ 서버 accessToken ▶", myAccessToken);

    return {
      nickname: nickname,
      access_token: myAccessToken
    };
  } catch (error) {
    console.error("❌ 로그인 처리 중 오류:", error);
    return {
      nickname: '로그인 실패',
      access_token: '없음'
    };
  }
}
