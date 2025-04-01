// ✅ CheckPlugStatus.js (JavaScript)
import http from 'http';
import console from 'console';

export default function CheckPlugStatus({
  applianceName,
  userSession
}) {
  const timestamp = new Date().getTime();

  // ✅ 로그인 체크
  if (!userSession || !userSession.accessToken || userSession.accessToken === '없음') {
    return {
      statusMessage: "로그인이 필요합니다.",
      messages: "🔒 먼저 로그인을 해주세요 🙏"
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
    const response = http.getUrl(url, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const name = response?.name ?? null;
    const power = typeof response?.power === 'boolean' ? response.power : null;

    if (name === null || power === null) {
      return {
        statusMessage: "해당 기기가 존재하지 않아요."
      };
    }

    return {
      statusMessage: power ?
        `${name}이(가) 지금 켜져 있어요!` :
        `${name}이(가) 꺼져 있어요!`,
      name: name,
      power: power
    };

  } catch (error) {
    console.error("❌ 서버 요청 중 오류 ▶", error);

    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      let message = "해당 기기가 존재하지 않아요.";
      try {
        const body = error?.response?.body;

        if (typeof body === 'string') {
          const parsed = JSON.parse(body);
          if (parsed && typeof parsed === 'object' && parsed.message) {
            message = parsed.message;
          }
        } else if (typeof body === 'object' && body !== null && body.message) {
          message = body.message;
        }
      } catch (e2) {
        console.error("❗ 메시지 파싱 실패:", e2);
      }

      return {
        statusMessage: message
      };
    }

    return {
      statusMessage: "해당 플러그가 존재 하지 않아요. 앱에서 플러그를 등록해 주세요.",
      messages: "📱 앱에서 플러그를 등록해 주세요 📱"
    };
  }
}
