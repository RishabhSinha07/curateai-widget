const STORAGE_KEY = 'cai_auth_tokens';

export interface AuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}

interface CognitoConfig {
  region: string;
  clientId: string;
}

function cognitoEndpoint(region: string): string {
  return `https://cognito-idp.${region}.amazonaws.com/`;
}

async function cognitoRequest(region: string, action: string, body: Record<string, unknown>): Promise<any> {
  const res = await fetch(cognitoEndpoint(region), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data.message || data.__type || 'Authentication failed';
    throw new Error(message);
  }
  return data;
}

export async function signIn(
  config: CognitoConfig,
  username: string,
  password: string,
): Promise<AuthTokens> {
  const data = await cognitoRequest(config.region, 'InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const result = data.AuthenticationResult;
  const tokens: AuthTokens = {
    idToken: result.IdToken,
    accessToken: result.AccessToken,
    refreshToken: result.RefreshToken,
    expiresAt: Date.now() + result.ExpiresIn * 1000,
  };
  saveTokens(tokens);
  return tokens;
}

export async function signUp(
  config: CognitoConfig,
  username: string,
  password: string,
  email: string,
): Promise<{ userConfirmed: boolean }> {
  const data = await cognitoRequest(config.region, 'SignUp', {
    ClientId: config.clientId,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  });
  return { userConfirmed: data.UserConfirmed };
}

export async function confirmSignUp(
  config: CognitoConfig,
  username: string,
  code: string,
): Promise<void> {
  await cognitoRequest(config.region, 'ConfirmSignUp', {
    ClientId: config.clientId,
    Username: username,
    ConfirmationCode: code,
  });
}

export async function refreshTokens(
  config: CognitoConfig,
  refreshToken: string,
): Promise<AuthTokens> {
  const data = await cognitoRequest(config.region, 'InitiateAuth', {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: config.clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  const result = data.AuthenticationResult;
  const stored = loadTokens();
  const tokens: AuthTokens = {
    idToken: result.IdToken,
    accessToken: result.AccessToken,
    // Refresh token is not returned on refresh — keep the existing one
    refreshToken: result.RefreshToken || stored?.refreshToken || refreshToken,
    expiresAt: Date.now() + result.ExpiresIn * 1000,
  };
  saveTokens(tokens);
  return tokens;
}

export function saveTokens(tokens: AuthTokens): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // localStorage unavailable
  }
}

export function loadTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

/** Returns a valid ID token, refreshing if needed. Returns null if no session. */
export async function getValidToken(config: CognitoConfig): Promise<string | null> {
  const tokens = loadTokens();
  if (!tokens) return null;

  // Refresh if within 60s of expiry
  if (Date.now() > tokens.expiresAt - 60_000) {
    try {
      const refreshed = await refreshTokens(config, tokens.refreshToken);
      return refreshed.idToken;
    } catch {
      clearTokens();
      return null;
    }
  }

  return tokens.idToken;
}
