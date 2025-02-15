import http from 'http';
import console from 'console';

export default function GroupList() {
  try {
    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;  
    const response = http.getUrl(url, { format: 'json' });

    console.log(`✅ [서버 응답 확인] ${JSON.stringify(response, null, 2)}`);

    if (!response || response.length === 0) {
      return ["🙏 현재 등록된 그룹이 없어요! 먼저 그룹을 만들어 주세요. 🙏"];
    }

    
    let groupNames = response.map(group => `📌 ${group.groupName}`);
    
    console.log(`✅ [출력될 값]\n📋 현재 등록된 그룹`, groupNames);

    return ["📋 현재 등록된 그룹", ...groupNames]; // 리스트로 반환하여 개행 유도
  } catch (error) {
    console.error("❌ [오류] 그룹 리스트 조회 실패:", error);
    return ["🚨 서버에서 그룹 목록을 불러오지 못했어요. 다시 시도해 주세요. 🚨"];
  }
}
