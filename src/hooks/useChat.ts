import { useState, useCallback, useRef, useEffect } from 'preact/hooks';
import { CurateAIClient } from '../api/client';
import { loadSession, saveSession, clearSession } from '../api/session';
import { getOrCreateAnonymousId } from '../utils/anonymousId';
import type { Message, CurateAIWidgetConfig } from '../types';

export function useChat(config: CurateAIWidgetConfig, getCognitoToken?: () => Promise<string | null>) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(() =>
    config.persistSession ? loadSession(config.apiUrl) : null
  );
  // Lead-capture gate state: when the backend returns status="auth_required",
  // we stash the message the visitor was trying to send and switch the input
  // area to a registration form. After register() succeeds we replay that
  // buffered message without echoing a duplicate user bubble.
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const clientRef = useRef<CurateAIClient>(new CurateAIClient(config, getCognitoToken));
  const anonymousIdRef = useRef<string>(getOrCreateAnonymousId(config.apiUrl));

  // Keep client + anonymous_id in sync if config changes
  useEffect(() => {
    clientRef.current = new CurateAIClient(config, getCognitoToken);
    anonymousIdRef.current = getOrCreateAnonymousId(config.apiUrl);
  }, [config, getCognitoToken]);

  const appendAssistantMessage = useCallback((data: {
    response: string;
    products: Message['products'];
    suggested_replies?: string[];
  }) => {
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.response,
      products: data.products,
      suggested_replies: data.suggested_replies,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    config.onMessage?.(assistantMessage);
  }, [config]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || pendingMessage) return;

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
      const data = await clientRef.current.sendMessage(
        content,
        sessionId,
        anonymousIdRef.current,
      );

      setSessionId(data.session_id);
      if (config.persistSession) {
        saveSession(config.apiUrl, data.session_id);
      }

      appendAssistantMessage(data);

      // Gate fired: backend rejected the message and asked for registration.
      // Buffer the content so register() can replay it post-submission.
      if (data.status === 'auth_required') {
        setPendingMessage(content);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      config.onError?.(msg);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, pendingMessage, config, appendAssistantMessage]);

  const register = useCallback(async (name: string, email: string, phone: string) => {
    if (isRegistering || !pendingMessage) return;

    setIsRegistering(true);
    setError(null);

    try {
      await clientRef.current.register(
        anonymousIdRef.current,
        name,
        email,
        phone,
      );

      // Replay the buffered message — don't add another user bubble; the
      // original one is still in the message list from the first attempt.
      const replayContent = pendingMessage;
      setPendingMessage(null);
      setIsLoading(true);

      const data = await clientRef.current.sendMessage(
        replayContent,
        sessionId,
        anonymousIdRef.current,
      );
      setSessionId(data.session_id);
      if (config.persistSession) {
        saveSession(config.apiUrl, data.session_id);
      }
      appendAssistantMessage(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      config.onError?.(msg);
    } finally {
      setIsRegistering(false);
      setIsLoading(false);
    }
  }, [isRegistering, pendingMessage, sessionId, config, appendAssistantMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setPendingMessage(null);
    clearSession(config.apiUrl);
  }, [config.apiUrl]);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearChat,
    awaitingRegistration: pendingMessage !== null,
    register,
    isRegistering,
  };
}
