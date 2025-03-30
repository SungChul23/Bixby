import http from 'http';
import console from 'console';

export default function RunGroup({ groupName, userSession }) {
  console.log("✅ [RunGroup] 실행 시작");

  const accessToken = userSession?.accessToken;

  // ✅ accessToken이 없을 경우 로그인 유도
  if (!accessToken || accessToken === '없음') {
    return {
      success: false,
      messages: ["로그인이 필요합니다. 다시 로그인해 주세요."]
    };
  }

  try {
    // ✅ 그룹 이름 누락 시 예외 처리
    if (!groupName) {
      return {
        success: false,
        messages: ["그룹 이름을 인식하지 못했습니다.", "다시 말씀해 주세요!"]
      };
    }

    const trimmedGroupName = groupName.trim().replace(/\s+/g, '');
    const timestamp = Date.now();

    // ✅ 1단계: 그룹 리스트 조회
    const listUrl = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;
    const listOptions = {
      format: 'json',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const groupList = http.getUrl(listUrl, listOptions);

    // ✅ 그룹 이름 → 그룹 ID 매핑
    let groupMap = {};
    groupList.forEach(group => {
      groupMap[group.groupName.replace(/\s+/g, '')] = group.groupId;
    });

    // ✅ 그룹명이 존재하지 않으면 예외 처리
    if (!groupMap[trimmedGroupName]) {
      return {
        success: false,
        messages: [`"${groupName}"을(를) 찾을 수 없습니다.`, "정확한 그룹명을 말해주세요!"]
      };
    }

    // ✅ 2단계: 그룹 실행 요청
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

    // ✅ 결과 메시지 반환
    return {
      success: true,
      groupName: groupName,
      messages: messages.length > 0 ? messages : ["ℹ️ 실행 결과가 없습니다."]
    };

  } catch (error) {
    console.error("❌ RunGroup 오류:", error);

    // ✅ 서버 예외 처리
    return {
      success: false,
      messages: ["🚨 그룹 실행 중 오류가 발생했습니다.", "잠시 후 다시 시도해 주세요! 🔄"]
    };
  }
}
