import config from 'config';
import console from 'console';

export default function LoginOAuth({ accessToken, refreshToken }) {
    if (!accessToken || !refreshToken) {
        console.log("🚨 [LoginOAuth 실행 불가] 액세스 토큰 또는 리프레시 토큰이 없음.");
        return { 
            loginMessage: "로그인 진행",
            loginUrl: "https://jkah.shop:8443/bixby/login"
        };
    }

    // ✅ 토큰 저장
    config.put("ACCESS_TOKEN", accessToken);
    config.put("REFRESH_TOKEN", refreshToken);

    // ✅ 성공 로그 추가
    console.log("✅ [LoginOAuth 성공] 액세스 토큰 및 리프레시 토큰이 저장되었습니다.");
    console.log(`🔑 액세스 토큰: ${accessToken}`);
    console.log(`♻️ 리프레시 토큰: ${refreshToken}`);

    return { 
        loginMessage: "로그인이 성공되었습니다! 이제 자동 인증이 가능합니다."
    };
}
