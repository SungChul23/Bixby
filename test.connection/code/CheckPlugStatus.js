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

    return {
      statusMessage: response.power 
        ? `${response.name}이(가) 지금 켜져 있어요!`
        : `${response.name}이(가) 꺼져 있어요!`,
      name: response.name, // deviceName 모델 사용
      power: response.power // Boolean 값 그대로 유지
    };

  } catch (error) {
    console.error("❌ 서버 요청 중 오류 발생:", error);
    return { statusMessage: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요." };
  }
}
