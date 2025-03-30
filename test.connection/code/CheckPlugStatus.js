import http from 'http';
import console from 'console';

export default function CheckPlugStatus({
  applianceName,
  userSession
}) {
  const timestamp = new Date().getTime();

  // ✅ 로그인 체크 (토큰 없으면 로그인 유도)
  if (!userSession || !userSession.accessToken || userSession.accessToken === '없음') {
    return {
      statusMessage: "로그인이 필요합니다. 먼저 로그인해 주세요."
    };
  }

  const accessToken = userSession.accessToken;

  // ✅ 기기 이름 없을 경우 예외 처리
  if (!applianceName) {
    return {
      statusMessage: "앗! 기기 이름을 확인해 주세요."
    };
  }

  const url = `https://jkah.shop:8443/check/plugState/${applianceName}?timestamp=${timestamp}`;

  try {
    // ✅ 서버로 기기 상태 조회 요청
    const response = http.getUrl(url, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // ✅ 기기 상태 정상 반환
    return {
      statusMessage: response.power ?
        `${response.name}이(가) 지금 켜져 있어요!` :
        `${response.name}이(가) 꺼져 있어요!`,
      name: response.name,
      power: response.power
    };

  } catch (error) {
    console.error("❌ 서버 요청 중 오류 ▶", error);

    // ✅ 404일 경우 서버 메시지 파싱 or 기본 메시지 사용
    if (error?.response?.status === 404) {
      try {
        const errorBody = JSON.parse(error.response.body);
        const message = errorBody?.message || "해당 기기가 존재하지 않아요.";
        return {
          statusMessage: message
        };
      } catch (e2) {
        return {
          statusMessage: "해당 기기가 존재하지 않아요."
        };
      }
    }

    // ✅ 기타 서버 오류
    return {
      statusMessage: "서버가 바쁜가 봐요! 다시 시도해 주세요."
    };
  }
}
