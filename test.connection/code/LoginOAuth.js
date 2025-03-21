import secret from 'secret'
import console from 'console';

export default function LoginOAuth() {
    try {
        // ✅ 서버에서 리다이렉트된 URL에서 accessToken, refreshToken 가져오기
        const accessToken = secret.get("accessToken");  
        const refreshToken = secret.get("refreshToken");

        console.log(`🔹 [Debug] 받은 accessToken: ${accessToken}`);
        console.log(`🔹 [Debug] 받은 refreshToken: ${refreshToken}`);

        if (!accessToken || !refreshToken) {
            console.log("🚨 액세스 토큰 또는 리프레시 토큰이 없습니다. 로그인 실패.");
            return { message: "로그인이 필요합니다. 아래 링크를 눌러 로그인해 주세요." };
        }

        // ✅ 기존 값을 덮어씌움
        secret.put("ACCESS_TOKEN", accessToken);
        secret.put("REFRESH_TOKEN", refreshToken);

        console.log(`✅ 로그인 성공! accessToken 및 refreshToken 저장 완료.`);

        return { message: "✅ 로그인 완료! 이제 자동으로 인증됩니다." };
    } catch (error) {
        console.error("❌ [오류] 로그인 처리 중 실패:", error);
        return { message: "서버 오류로 인해 로그인할 수 없습니다. 다시 시도해주세요." };
    }
}
