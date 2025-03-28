import console from 'console';
let token = '';

export function saveAccessToken(newToken) {
  console.log("💾 [DEBUG] 저장할 토큰 ▶", newToken); // 디버깅 추가
  token = newToken;
}

export function fetchAccessToken() {
  console.log("📤 [DEBUG] 가져온 토큰 ▶", token); // 디버깅 추가
  return token;
}
