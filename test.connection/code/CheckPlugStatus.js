import http from 'http';
import console from 'console';
import fetchAccessToken from './fetchAccessToken'; // accessToken을 가져오는 함수

export default function CheckPlugStatus({ applianceName }) {
    try {
        if (!applianceName) {
            return { statusMessage: "😢앗! 기기 이름을 확인해 주세요.😢" };
        }

        // ✅ Secrets에서 accessToken 가져오기
        const accessToken = fetchAccessToken();

        if (!accessToken) {
            console.log("🚨 accessToken을 가져올 수 없습니다. 로그인 필요.");
            return { statusMessage: "로그인이 필요합니다. 다시 로그인해 주세요." };
        }

        const timestamp = new Date().getTime();
        const url = `https://jkah.shop:8443/check/plugState/${applianceName}?timestamp=${timestamp}`;

        // ✅ `Authorization` 헤더 포함
        const options = {
            format: 'json',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        };

        // 서버 요청
        const response = http.getUrl(url, options);

        console.log(`✅ [로그] GET 요청 서버 응답: ${JSON.stringify(response, null, 2)}`);

        return {
            statusMessage: response.power 
                ? `${response.name}이(가) 지금 켜져 있어요!`
                : `${response.name}이(가) 꺼져 있어요!`,
            name: response.name,
            power: response.power
        };

    } catch (error) {
        console.error("❌ 서버 요청 중 오류 발생:", error);
        return { statusMessage: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요." };
    }
}
