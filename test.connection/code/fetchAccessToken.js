import http from 'http';
import console from 'console';
import config from 'config';

export default function fetchAccessToken() {
    let accessToken = config.get("ACCESS_TOKEN");

    if (accessToken) {
        console.log("✅ 기존 accessToken 사용:", accessToken);
        return accessToken;
    }

    console.log("🚨 accessToken이 없습니다. refreshToken을 사용하여 새 토큰을 요청합니다.");
    const refreshToken = config.get("REFRESH_TOKEN");

    if (!refreshToken) {
        console.log("🚨 refreshToken도 없습니다. 로그인 필요.");
        return null;
    }

    // ✅ `refreshToken`을 사용하여 새로운 `accessToken` 요청
    const refreshUrl = "https://jkah.shop:8443/api/refresh-access-token"; // 추후 수정
    const options = {
        format: 'json',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            "refreshToken": refreshToken
        }
    };

    try {
        const response = http.postUrl(refreshUrl, options);

        if (!response || !response.accessToken) {
            console.log("🚨 새 accessToken을 가져오지 못함.");
            return null;
        }

        // ✅ 새로운 accessToken을 기존 값 위에 덮어쓰기
        config.put("ACCESS_TOKEN", response.accessToken);
        console.log("✅ 새 accessToken 저장 완료:", response.accessToken);

        return response.accessToken;
    } catch (error) {
        console.error("❌ [오류] accessToken 갱신 실패:", error);
        return null;
    }
}
