import http from 'http';
import console from 'console';

export default function GroupList() {
  try {
    const timestamp = new Date().getTime(); // 현재 시간을 밀리초 단위로 가져오기
    const url = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;
    const response = http.getUrl(url, { format: 'json' });

    if (!response || response.length === 0) {
      console.log("🚨 현재 등록된 그룹이 없습니다. 먼저 앱에서 그룹을 만들어 주세요. 🚨");
      return ["🚨 현재 등록된 그룹이 없습니다. 먼저 앱에서 그룹을 만들어 주세요. 🚨"];
    }

    let groupNames = response.map(group => `📌 ${group.groupName}`);
    let groupCount = groupNames.length; // 그룹 개수 확인
    let message = `총 ${groupCount}개의 그룹이 있습니다.`; // 음성 출력 메시지

    console.log(message); // 빅스비가 음성으로 읽도록 로그 출력
    console.log(`✅ [출력될 그룹 리스트]`, groupNames);

    return [message, "📋 현재 등록된 그룹", ...groupNames];
  } catch (error) {
    console.error("❌ [오류] 그룹 목록 조회 실패:", error);
    return ["🚨 서버에서 그룹 목록을 불러오지 못했어요. 다시 시도해 주세요. 🚨"];
  }
}
