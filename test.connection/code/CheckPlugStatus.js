import http from 'http';
import console from 'console';

export default function CheckPlugStatus({ applianceName, userSession }) {
  const timestamp = new Date().getTime();

  // ✅ accessToken 유무 확인 (안전한 로그인 체크)
  if (!userSession || !userSession.accessToken || userSession.accessToken === '없음') {
    return {
      statusMessage: "로그인이 필요합니다. 먼저 로그인해 주세요."
    };
  }

  const accessToken = userSession.accessToken;

  if (!applianceName) {
    return {
      statusMessage: "😢앗! 기기 이름을 확인해 주세요.😢"
    };
  }

  const url = `https://jkah.shop:8443/check/plugState/${applianceName}?timestamp=${timestamp}`;

  try {
    const response = http.getUrl(url, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ 기기 상태 응답 ▶", JSON.stringify(response, null, 2));

    return {
      statusMessage: response.power
        ? `${response.name}이(가) 지금 켜져 있어요!`
        : `${response.name}이(가) 꺼져 있어요!`,
      name: response.name,
      power: response.power
    };

  } catch (error) {
    console.error("❌ 서버 요청 중 오류 ▶", error);

    if (error?.response?.status === 404) {
      const message = error.response.body?.message || "해당 기기를 찾을 수 없어요.";
      return { statusMessage: message };
    }

    return {
      statusMessage: "해당 기기가 존재하지 않아요."
    };
  }
}
