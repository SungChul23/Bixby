import http from 'http';
import console from 'console';

export default function RunGroup(request) {
  try {
    console.log("✅ [RunGroup] 실행 시작");

    if (!request || !request.groupName) {
      console.error("🚨 [오류] groupName 값이 전달되지 않음");
      return "🚨 그룹 이름을 인식하지 못했습니다. 다시 한번 말씀 해 주세요 🚨";
    }

    const groupName = request.groupName.trim();
    console.log(`✅ 요청된 그룹 이름: ${groupName}`);

    const listUrl = `https://jkah.shop:8443/group/check/list`;
    const groupList = http.getUrl(listUrl, { format: 'json' });

    console.log("✅ 그룹 목록 불러오기 완료");

    if (!groupList || groupList.length === 0) {
      console.error("🚨 [오류] 등록된 그룹이 없습니다.");
      return "🚨 현재 등록된 그룹이 없습니다. 먼저 앱에서 그룹을 만들어 주세요. 🚨";
    }

    let groupMap = {};
    groupList.forEach(group => {
      groupMap[group.groupName] = group.groupId;
    });

    console.log("✅ 그룹 ID 매핑 완료");

    if (!groupMap[groupName]) {
      console.error(`🚨 [오류] 그룹을 찾을 수 없음: ${groupName}`);
      return `🚨 "${groupName}" 그룹을 찾을 수 없습니다. 올바른 그룹명을 말해주세요!`;
    }

    let groupId = groupMap[groupName];
    console.log(`✅ 실행할 그룹 ID: ${groupId}`);

    const timestamp = Date.now(); // ✅ 각 요청을 고유하게 만들기 위한 타임스탬프 추가
    const runUrl = `https://jkah.shop:8443/group/action/run/${groupId}?timestamp=${timestamp}`;
    
    console.log(`✅ 요청 URL: ${runUrl}`);

    const response = http.getUrl(runUrl, { format: 'text' });

    console.log(`✅ [실행 요청 완료] ${groupName} (${groupId}) → 응답: ${response}`);

    return `🚀 "${groupName}" 그룹 실행 결과: ${response}`;
  } catch (error) {
    console.error("❌ [오류] 그룹 실행 실패:", error);
    return "🚨 그룹 실행 중 오류가 발생했습니다. 다시 시도해 주세요.";
  }
}
