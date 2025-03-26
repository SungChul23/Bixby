import http from 'http';
import console from 'console';
import fetchAccessToken from './fetchAccessToken';

export default function CheckPlugStatus({ applianceName }) {
    try {
        if (!applianceName) {
            return { statusMessage: "😢앗! 기기 이름을 확인해 주세요.😢" };
        }

        const accessToken = fetchAccessToken();

        if (!accessToken) {
            console.log("🚨 accessToken을 가져올 수 없습니다. 로그인 필요.");
            return { statusMessage: "로그인이 필요합니다. 다시 로그인해 주세요." };
        }

        const timestamp = new Date().getTime();
        const url = `https://jkah.shop:8443/check/plugState/${applianceName}?timestamp=${timestamp}`;

        const options = {
            format: 'json',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        };

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

        // 👉 404 응답에서 message 추출
        if (error?.response?.status === 404) {
            const errorBody = error.response.body; // JSON 그대로
            const message = errorBody?.message || "해당 기기가 존재하지 않아요.";
            return { statusMessage: message };
        }

        return { statusMessage: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요." };
    }
}
