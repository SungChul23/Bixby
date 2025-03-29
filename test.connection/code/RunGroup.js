import http from 'http';
import console from 'console';

export default function RunGroup({ groupName, userSession }) {
  console.log("✅ [RunGroup] 실행 시작");

  const accessToken = userSession?.accessToken;

  if (!accessToken || accessToken === '없음') {
    return {
      success: false,
      messages: [" 로그인이 필요합니다. 다시 로그인해 주세요."]
    };
  }

  try {
    if (!groupName) {
      return {
        success: false,
        messages: ["⚠️ 그룹 이름을 인식하지 못했습니다.", "다시 말씀해 주세요! 😊"]
      };
    }

    const trimmedGroupName = groupName.trim().replace(/\s+/g, '');
    const timestamp = Date.now();

    // 1️⃣ 그룹 목록 조회
    const listUrl = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;
    const listOptions = {
      format: 'json',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const groupList = http.getUrl(listUrl, listOptions);
    let groupMap = {};
    groupList.forEach(group => {
      groupMap[group.groupName.replace(/\s+/g, '')] = group.groupId;
    });

    if (!groupMap[trimmedGroupName]) {
      return {
        success: false,
        messages: [` "${groupName}" 을 찾을 수 없습니다` , "정확한 그룹명을 말해주세요! "]
      };
    }

    // 2️⃣ 그룹 실행
    const groupId = groupMap[trimmedGroupName];
    const runUrl = `https://jkah.shop:8443/group/action/run/${groupId}?timestamp=${timestamp}`;
    const runOptions = {
      format: 'json',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const response = http.getUrl(runUrl, runOptions);
    const successArray = response.successArray || [];
    const errorArray = response.errorArray || [];

    let messages = [];

    if (successArray.length > 0) {
      messages.push("✅ 성공한 플러그");
      messages.push(...successArray.map(device => `🔹 ${device}`));
    }

    if (errorArray.length > 0) {
      messages.push("❌ 실패한 플러그");
      messages.push(...errorArray.map(device => `🔹 ${device}`));
    }

    return {
      success: true,
      groupName: groupName,
      messages: messages.length > 0 ? messages : ["ℹ️ 실행 결과가 없습니다."]
    };

  } catch (error) {
    console.error("❌ RunGroup 오류:", error);
    return {
      success: false,
      messages: ["🚨 그룹 실행 중 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요! 🔄"]
    };
  }
}
