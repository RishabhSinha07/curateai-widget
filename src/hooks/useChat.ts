import { useState, useCallback, useRef, useEffect } from 'preact/hooks';
import { CurateAIClient } from '../api/client';
import { loadSession, saveSession, clearSession } from '../api/session';
import type { Message, CurateAIWidgetConfig } from '../types';

export function useChat(config: CurateAIWidgetConfig, getCognitoToken?: () => Promise<string | null>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(() =>
    config.persistSession ? loadSession(config.apiUrl) : null
  );

  const clientRef = useRef<CurateAIClient>(new CurateAIClient(config, getCognitoToken));

  // Keep client in sync if config changes
  useEffect(() => {
    clientRef.current = new CurateAIClient(config, getCognitoToken);
  }, [config, getCognitoToken]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    config.onMessage?.(userMessage);

    try {
      const data = await clientRef.current.sendMessage(content, sessionId);

      setSessionId(data.session_id);
      if (config.persistSession) {
        saveSession(config.apiUrl, data.session_id);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        products: data.products,
        suggested_replies: data.suggested_replies,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      config.onMessage?.(assistantMessage);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      config.onError?.(msg);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, config]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    clearSession(config.apiUrl);
  }, [config.apiUrl]);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearChat,
  };
}
