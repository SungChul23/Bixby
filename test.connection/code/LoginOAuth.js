import http from 'http';
import console from 'console';

// ✅ authorization 설정: capsule.bxb의 oauth-authorization과 연결됨
export const authorization = "KakaoLogin";

export default function LoginOAuth(input) {
  const { $vivContext } = input; // Bixby에서 자동으로 넘겨주는 OAuth 관련 context

  console.log("🧠 [DEBUG] $vivContext ▶", JSON.stringify($vivContext, null, 2));

  // ✅ 카카오 access_token 추출
  const kakaoToken = $vivContext?.accessToken;
  console.log("🪪 카카오 access_token ▶", kakaoToken);

  const timestamp = new Date().getTime();
  const kakaoUrl = `https://kapi.kakao.com/v2/user/me?timestamp=${timestamp}`;

  let nickname = '이름 없음';

  // ✅ 1단계: 카카오 사용자 정보 요청 (닉네임 가져오기)
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
    // ⚠️ 카카오 사용자 정보 요청 실패
    console.error("❌ 카카오 사용자 정보 가져오기 실패:", error);
    return {
      nickname: '카카오 사용자 정보 없음',
      accessToken: '없음',               // 서버 accessToken은 없다고 처리
      kakaoAccessToken: kakaoToken      // 카카오 토큰은 유지 (추후 로그아웃 시 필요할 수 있음)
    };
  }

  // ✅ 2단계: 내 서버에 카카오 토큰 전달 → 자체 로그인 처리
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
      accessToken: accessToken,         // 👉 서버에서 발급한 나만의 JWT 또는 세션 토큰
      kakaoAccessToken: kakaoToken      // 👉 원본 카카오 토큰 (로그아웃에 필요)
    };

  } catch (error) {
    // ⚠️ 내 서버 로그인 실패
    console.error("⚠️ 내 서버 로그인 실패:", error);
    return {
      nickname: nickname,
      accessToken: '없음',
      kakaoAccessToken: kakaoToken
    };
  }
}
