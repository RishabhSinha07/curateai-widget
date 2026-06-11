import type { ChatResponse, CurateAIWidgetConfig } from '../types';

export class CurateAIClient {
  private config: CurateAIWidgetConfig;
  private getCognitoToken: (() => Promise<string | null>) | null;

  constructor(config: CurateAIWidgetConfig, getCognitoToken?: () => Promise<string | null>) {
    this.config = config;
    this.getCognitoToken = getCognitoToken || null;
  }

  private async buildAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    // Token priority: static authToken → getAuthToken callback → built-in Cognito token
    let token: string | null = this.config.authToken || null;
    if (!token && this.config.getAuthToken) {
      token = (await this.config.getAuthToken()) || null;
    }
    if (!token && this.getCognitoToken) {
      token = await this.getCognitoToken();
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async sendMessage(
    message: string,
    sessionId: string | null,
    anonymousId: string,
  ): Promise<ChatResponse> {
    const headers = await this.buildAuthHeaders();

    const response = await fetch(`${this.config.apiUrl}/chat`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers,
      body: JSON.stringify({
        message,
        session_id: sessionId,
        anonymous_id: anonymousId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  async register(
    anonymousId: string,
    name: string,
    email: string,
    phone: string,
  ): Promise<void> {
    const headers = await this.buildAuthHeaders();

    const response = await fetch(`${this.config.apiUrl}/chat/register`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers,
      body: JSON.stringify({
        anonymous_id: anonymousId,
        name,
        email,
        phone,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed (${response.status}): ${errorText}`);
    }
  }
}
