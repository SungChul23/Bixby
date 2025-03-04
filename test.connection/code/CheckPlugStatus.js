import http from 'http';
import console from 'console';

export default function CheckPlugStatus({ applianceName }) {
  try {
    if (!applianceName) {
      return { statusMessage: "😢앗! 기기 이름을 확인해 주세요.😢" };
    }

    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/check/plugState/${applianceName}?timestamp=${timestamp}`;

    const response = http.getUrl(url, { format: 'json' });

    console.log(`✅ [로그] GET 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

    if (response.power === true) {
      return { statusMessage: `💡${response.name}이(가) 지금 켜져 있어요!💡` };
    } else if (response.power === false) {
      return { statusMessage: `🔴${response.name}이(가) 꺼져 있어요.🔴` };
    } else {
      return { statusMessage: "😢플러그 상태를 확인할 수 없어요! 다시 시도해 주세요.😢" };
    }
  } catch (error) {
    console.error("❌ 서버 요청 중 오류 발생:", error);
    return { statusMessage: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요." };
  }
}
