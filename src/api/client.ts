import type { ChatResponse, CurateAIWidgetConfig } from '../types';

export class CurateAIClient {
  private config: CurateAIWidgetConfig;

  constructor(config: CurateAIWidgetConfig) {
    this.config = config;
  }

  async sendMessage(message: string, sessionId: string | null): Promise<ChatResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Resolve auth token
    const token = this.config.authToken
      || (this.config.getAuthToken ? await this.config.getAuthToken() : null);
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
