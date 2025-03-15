import console from 'console';

export default function LoginOAuth({ accessToken }) {
    try {
        if (!accessToken) {
            console.log("🚨 액세스 토큰이 없습니다. 로그인 실패.");
            return { message: "로그인에 실패했습니다. 다시 시도해주세요." };
        }

        console.log("✅ 로그인 성공! 액세스 토큰:", accessToken);

        return { message: "로그인이 성공되었습니다!" };
    } catch (error) {
        console.error("❌ [오류] 로그인 실패:", error);
        return { message: "서버 오류로 인해 로그인할 수 없습니다. 다시 시도해주세요." };
    }
}
