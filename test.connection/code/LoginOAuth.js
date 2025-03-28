import http from 'http';
import console from 'console';

export const authorization = "KakaoLogin";

export default function LoginOAuth(input) {
  const { $vivContext } = input;

  console.log("🧠 [DEBUG] $vivContext ▶", JSON.stringify($vivContext, null, 2));

  const kakaoToken = $vivContext?.accessToken;
  console.log("🪪 카카오 access_token ▶", kakaoToken);

  const timestamp = new Date().getTime();
  const kakaoUrl = `https://kapi.kakao.com/v2/user/me?timestamp=${timestamp}`;

  let nickname = '이름 없음';

  // 1️⃣ 카카오 사용자 정보 요청
  try {
    const kakaoResponse = http.oauthGetUrl(kakaoUrl, {
      format: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });

    nickname = kakaoResponse?.properties?.nickname || '이름 없음';
    console.log("👤 카카오 닉네임 ▶", nickname);
  } catch (error) {
    console.error("❌ 카카오 사용자 정보 가져오기 실패:", error);
    return {
      nickname: '카카오 사용자 정보 없음',
      accessToken: '없음'
    };
  }

  // 2️⃣ 내 서버에 토큰 전달
  try {
    const url = `https://jkah.shop:8443/kakao/login?accessToken=${encodeURIComponent(kakaoToken)}&timestamp=${timestamp}`;

    const serverResponse = http.getUrl(url, {
      format: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const accessToken = serverResponse?.accessToken || '없음';
    console.log("🎟️ 서버 accessToken ▶", accessToken);

    return {
      nickname: nickname,
      accessToken: accessToken
    };

  } catch (error) {
    console.error("⚠️ 내 서버 로그인 실패:", error);
    return {
      nickname: nickname,
      accessToken: '없음'
    };
  }
}
