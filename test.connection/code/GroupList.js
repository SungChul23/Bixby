import http from 'http';
import console from 'console';

export default function GroupList(input) {
  const { access_token } = input; // ✅ 서버 토큰 받음

  const url = `https://jkah.shop:8443/group/check/list`;

  try {
    const response = http.getUrl(url, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${access_token}`, // ✅ 서버 인증 토큰 붙이기
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
      messageTitle: "서버 오류",
      messages: ["❌ 다시 시도해 주세요"]
    };
  }
}
