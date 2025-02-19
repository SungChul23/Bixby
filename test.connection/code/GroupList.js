import http from 'http';
import console from 'console';

export default function GroupList() {
  try {
    const url = `https://jkah.shop:8443/group/check/list`;
    const response = http.getUrl(url, { format: 'json' });

    if (!response || response.length === 0) {
      return ["🚨 현재 등록된 그룹이 없습니다. 먼저 앱에서 그룹을 만들어 주세요. 🚨"];
    }

    let groupNames = response.map(group => `📌 ${group.groupName}`);

    console.log(`✅ [출력될 그룹 리스트]`, groupNames);

    return ["📋 현재 등록된 그룹", ...groupNames];
  } catch (error) {
    console.error("❌ [오류] 그룹 목록 조회 실패:", error);
    return ["🚨 서버에서 그룹 목록을 불러오지 못했어요. 다시 시도해 주세요. 🚨"];
  }
}
