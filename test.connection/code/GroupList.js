import http from 'http';
import console from 'console';

export const authorization = "KakaoLogin"; // 🔐 이게 있어야 oauthGetUrl 사용 가능

export default function GroupList(input) {
  const timestamp = new Date().getTime();
  const url = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;

  try {
    const response = http.oauthGetUrl(url, {
      format: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response || response.length === 0) {
      return {
        success: false,
        messageTitle: "현재 등록된 그룹이 없습니다.",
        messages: ["📱 앱에서 그룹을 먼저 생성해 주세요 📱"]
      };
    }

    const groupNames = response.map(group => `📌 ${group.groupName}`);

    return {
      success: true,
      messageTitle: `총 ${response.length}개의 그룹이 있습니다.`,
      messages: groupNames
    };
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    return {
      success: false,
      messageTitle: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요.",
      messages: ["❌ 액세스 토큰이 만료되었거나 요청에 실패했습니다. ❌"]
    };
  }
}
