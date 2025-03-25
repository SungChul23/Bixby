import http from 'http';
import base64 from 'base64';
import console from 'console';

export function tokenEndpoint(input) {
  const {
    $grantType,
    $clientId,
    $clientSecret,
    $scope,
    $authCode,
    $redirectUri,
    $refreshToken,
    $codeVerifier,
  } = input
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      //Authorization: 'Basic {' + base64.encode($clientId + ':' + $clientSecret) + '}',
    },
    format: 'json',
  }
  const params = {
    grant_type: 'authorization_code',
    code: $authCode,
    redirect_uri: $redirectUri,
    client_id: $clientId
  }
  const response = http.postUrl('https://kauth.kakao.com/oauth/token', params, options)
  return {
    access_token: response.access_token,
    expires_in: response.expires_in,
    refresh_token: response.refresh_token,
  }

}
