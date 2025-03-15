import config from 'config';
import console from 'console';

export default function LoginOAuth({ accessToken, refreshToken }) {
    try {
        if (!accessToken || !refreshToken) {
            console.log("🚨 액세스 토큰 또는 리프레시 토큰이 없습니다. 로그인 실패.");
            return { message: "로그인에 실패했습니다. 다시 시도해주세요." };
        }

        // ✅ 기존 값이 있더라도 새로운 토큰으로 덮어씌움
        config.put("ACCESS_TOKEN", accessToken);
        config.put("REFRESH_TOKEN", refreshToken);

        console.log(`✅ 로그인 성공! 새 accessToken 및 refreshToken 저장 완료.`);
        console.log(`🟢 [새로운 accessToken]: ${accessToken}`);
        console.log(`🟢 [새로운 refreshToken]: ${refreshToken}`);

        return { message: "로그인이 성공되었습니다! 이제 자동 인증이 가능합니다." };
    } catch (error) {
        console.error("❌ [오류] 로그인 실패:", error);
        return { message: "서버 오류로 인해 로그인할 수 없습니다. 다시 시도해주세요." };
    }
}
