import http from 'http';
import console from 'console';

export default function GroupList({ userSession }) {
  const timestamp = new Date().getTime();

  // ✅ 로그인 여부 확인
  if (!userSession || !userSession.accessToken || userSession.accessToken === '없음') {
    return {
      success: false,
      messageTitle: "로그인이 필요합니다.",
      messages: ["🔒 먼저 로그인을 해주세요 🙏"]
    };
  }

  const accessToken = userSession.accessToken;
  const url = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;

  console.log("🔐 accessToken ▶", accessToken);
  console.log("🕒 timestamp ▶", timestamp);

  try {
    // ✅ 그룹 목록 요청
    const response = http.getUrl(url, {
      format: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // ✅ 등록된 그룹이 없는 경우
    if (!response || response.length === 0) {
      return {
        success: false,
        messageTitle: "현재 등록된 그룹이 없습니다.",
        messages: ["📱 앱에서 그룹을 먼저 생성해 주세요 📱"]
      };
    }

    // ✅ 그룹 이름만 추출
    const groupNames = response.map(group => `📌 ${group.groupName}`);

    return {
      success: true,
      messageTitle: `총 ${response.length}개의 그룹이 있습니다.`,
      messages: groupNames
    };
  } catch (e) {
    // ✅ 서버 오류 처리
    console.error("❌ 그룹 리스트 조회 실패:", e);
    return {
      success: false,
      messageTitle: "서버가 바쁜가봐요 다시 한 번 시도해주세요.",
      messages: ["❌ 다시 시도해 주세요 ❌"]
    };
  }
}
