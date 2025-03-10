import http from 'http';
import console from 'console';

export default function CheckToken() {
    try {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNzQxNTg0ODk4LCJleHAiOjE3NDA4MDc2NDV9.X-uaRebid5HVeTeYDfditPmbVzIF34Ef3BEcYK1nDBY";
        const url = "https://jkah.shop:8443/check/token";
        const response = http.getUrl(url, {
            format: 'json',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response) {
            console.log("🚨 토큰 확인 실패: 응답이 없습니다.");
            return [" 토큰을 확인할 수 없습니다. 다시 시도해 주세요."];
        }

        console.log("✅ 토큰 확인 성공: 상태코드 200");
        return [" 토큰이 유효합니다."];
    } catch (error) {
        console.error("❌ [오류] 토큰 확인 실패:", error);
        return [" 서버에서 토큰을 확인할 수 없습니다. 다시 시도해 주세요."];
    }
}
