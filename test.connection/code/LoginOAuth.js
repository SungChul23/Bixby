import console from 'console';

export default function LoginOAuth(userIntent) {
  try {
    const loginUrl = "https://jkah.shop:8443/bixby/login";

    console.log("🔗 로그인 URL:", loginUrl);
    
    return {
      message: "로그인이 필요합니다.",
      url: loginUrl
    };
  } catch (error) {
    console.error("❌ [오류] 로그인 URL 반환 실패:", error);
    return {
      message: "🚨 로그인 페이지를 불러오는 중 문제가 발생했어요.",
      url: ""
    };
  }
}
