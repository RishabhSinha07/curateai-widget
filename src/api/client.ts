import type { ChatResponse, CurateAIWidgetConfig } from '../types';

export class CurateAIClient {
  private config: CurateAIWidgetConfig;
  private getCognitoToken: (() => Promise<string | null>) | null;

  constructor(config: CurateAIWidgetConfig, getCognitoToken?: () => Promise<string | null>) {
    this.config = config;
    this.getCognitoToken = getCognitoToken || null;
  }

  async sendMessage(message: string, sessionId: string | null): Promise<ChatResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

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

    const response = await fetch(`${this.config.apiUrl}/chat`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers,
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed (${response.status}): ${errorText}`);
    }

    return response.json();
  }
}
