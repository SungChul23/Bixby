import secret from 'secret';
import console from 'console';

export default function fetchAccessToken() {
    const accessToken = secret.get('accessToken'); // Bixby Secrets에서 가져오기
    if (!accessToken) {
        console.error("🚨 Secrets에서 accessToken을 가져올 수 없습니다.");
        return null;
    }
    console.log("✅ Secrets에서 accessToken을 성공적으로 가져왔습니다.");
    return accessToken;
}
