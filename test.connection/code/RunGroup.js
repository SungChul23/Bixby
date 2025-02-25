import http from 'http';
import console from 'console';

export default function RunGroup(request) {
  try {
    console.log("✅ [RunGroup] 실행 시작");

    if (!request || !request.groupName) {
      console.error("🚨 [오류] groupName 값이 전달되지 않음");
      return ["⚠️ 그룹 이름을 인식하지 못했습니다.", "다시 말씀해 주세요! 😊"];
    }

    // 공백 제거
    const groupName = request.groupName.trim().replace(/\s+/g, '');
    console.log(`✅ 요청된 그룹 이름 (공백 제거 후): ${groupName}`);

    // 그룹 목록 가져오기
    const timestamp = Date.now();
    const listUrl = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;
    const groupList = http.getUrl(listUrl, { format: 'json' });

    if (!groupList || groupList.length === 0) {
      return ["⚠️ 현재 등록된 그룹이 없습니다.", "앱에서 먼저 그룹을 만들어 주세요! 🏠"];
    }

    let groupMap = {};
    groupList.forEach(group => {
      const normalizedGroupName = group.groupName.replace(/\s+/g, '');
      groupMap[normalizedGroupName] = group.groupId;
    });

    if (!groupMap[groupName]) {
      return [`⚠️ "${request.groupName}" 그룹을 찾을 수 없습니다.`, "정확한 그룹명을 말해주세요! 📢"];
    }

    const groupId = groupMap[groupName];
    const runUrl = `https://jkah.shop:8443/group/action/run/${groupId}?timestamp=${timestamp}`;
    const response = http.getUrl(runUrl, { format: 'json' });

    // 응답 데이터 정리
    const successArray = response.successArray || [];
    const errorArray = response.errorArray || [];

    let resultMessage = [`🔌 "${request.groupName}" 실행 결과`];

    if (successArray.length > 0) {
      resultMessage.push("✅ 성공한 플러그", ...successArray.map(device => `- ${device}`));
    }

    if (errorArray.length > 0) {
      resultMessage.push("❌ 실패한 플러그", ...errorArray.map(device => `- ${device}`));
    }

    console.log("✅ [출력될 실행 결과]", resultMessage);

    return resultMessage;
  } catch (error) {
    console.error("❌ [오류] 그룹 실행 실패:", error);
    return ["🚨 그룹 실행 중 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요! 🔄"];
  }
}
