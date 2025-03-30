import http from 'http';

export default function LogoutOAuth({ userSession }) {
  // ✅ userSession에서 카카오 access token 추출
  const kakaoAccessToken = userSession?.kakaoAccessToken;

  // ⚠️ 토큰이 없을 경우 안내 메시지 반환
  if (!kakaoAccessToken || kakaoAccessToken === '없음') {
    return {
      success: false,
      messages: "⚠️ 카카오 accessToken이 존재하지 않습니다. 다시 로그인 해주세요."
    };
  }

  const url = 'https://kapi.kakao.com/v1/user/logout';

  try {
    // ✅ 카카오 로그아웃 요청 (accessToken을 Bearer로 전달)
    const response = http.postUrl(url, null, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`
      }
    });

    // 🔓 로그아웃 성공
    return {
      success: true,
      messages: "깜빡 로그아웃이 완료되었습니다."
    };

  } catch (e) {
    // ❌ 로그아웃 실패 처리
    return {
      success: false,
      messages: "로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요."
    };
  }
}
