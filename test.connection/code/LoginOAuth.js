import console from 'console';

export default function LoginOAuth(userIntent) {
  try {
    const loginUrl = "https://jkah.shop:8443/bixby/login";

    console.log("🔗 로그인 URL:", loginUrl);
    
    return {
      url: loginUrl  // ✅ 올바른 문자열 형태로 URL 전달
    };
  } catch (error) {
    console.error("❌ [오류] 로그인 URL 반환 실패:", error);
    return {
      url: ""
    };
  }
}
