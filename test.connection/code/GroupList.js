import http from 'http';
import console from 'console';
import fetchAccessToken from './fetchAccessToken'; // accessToken을 가져오는 함수

export default function GroupList() {
  try {
    const timestamp = new Date().getTime();
    const url = `https://jkah.shop:8443/group/check/list?timestamp=${timestamp}`;

    const accessToken = fetchAccessToken();
    if (!accessToken) {
      return {
        success: false,
        messageTitle: "🚨 로그인이 필요합니다.",
        messages: ["다시 로그인해 주세요."]
      };
    }

    const options = {
      format: 'json',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const response = http.getUrl(url, options);

    if (!response || response.length === 0) {
      return {
        success: false,
        messageTitle: "현재 등록된 그룹이 없습니다.",
        messages: ["📱 앱에서 그룹을 먼저 생성해 주세요 📱"]
      };
    }

    let groupNames = response.map(group => `📌 ${group.groupName}`);

    return {
      success: true,
      messageTitle: `총 ${response.length}개의 그룹이 있습니다.`,
      messages: groupNames
    };
  } catch (error) {
    return {
      success: false,
      messageTitle: "서버가 바쁜가 봐요! 다시 한 번만 시도해 주세요.",
      messages: ["서버에서 그룹 목록을 불러오지 못했어요.", "다시 시도해 주세요."]
    };
  }
}
