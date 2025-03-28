import http from 'http';
import console from 'console';

export default function GroupList({ userSession }) {
  const accessToken = userSession.accessToken;
  const timestamp = new Date().getTime();

  const url = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;

  console.log("🔐 accessToken ▶", accessToken);
  console.log("🕒 timestamp ▶", timestamp);

  try {
    const response = http.getUrl(url, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
  } catch (e) {
    console.error("❌ 그룹 리스트 조회 실패:", e);
    return {
      success: false,
      messageTitle: "서버 오류",
      messages: ["❌ 다시 시도해 주세요"]
    };
  }
}
