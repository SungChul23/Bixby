import http from 'http';
import console from 'console';

export default function TestTokenEndpoint() {
  const tokenUrl = 'https://kauth.kakao.com/oauth/token';

  const params = {
    grant_type: 'authorization_code',
    code: 'xpz6YvTslRistF9rVTRkn2fEKeiybbv-Vrm5PHy5N9eCvr0TagLuRQAAAAQKFxAvAAABlc224K-YFzyUYZmfhQ',
    client_id: '7fd6112fa7ebf21d960c2f2a64f6d690',
    redirect_uri: 'https://smarthomecontrolusingbixby-kim.oauth.aibixby.com/auth/external/cb'
  };

  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    format: 'json'
  };

  const response = http.postUrl(tokenUrl, params, options);
  console.log("🔐 Kakao access_token 응답:", response);

  return {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_in: response.expires_in
  };
}
