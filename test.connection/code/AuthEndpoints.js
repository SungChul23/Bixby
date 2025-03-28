import http from 'http';
import console from 'console';

export function tokenEndpoint(input) {
  const { $authCode, $clientId, $redirectUri } = input;

  const tokenUrl = 'https://kauth.kakao.com/oauth/token';
  const params = {
    grant_type: 'authorization_code',
    code: $authCode,
    client_id: $clientId,
    redirect_uri: $redirectUri
  };

  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    format: 'json'
  };

  const response = http.postUrl(tokenUrl, params, options);
  console.log("🔐 Kakao access_token 응답 ▶", response);

  return {
    access_token: response.access_token,
    expires_in: response.expires_in,
    refresh_token: response.refresh_token
  };
}
