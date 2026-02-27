import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import {
  signIn as cognitoSignIn,
  signUp as cognitoSignUp,
  confirmSignUp as cognitoConfirmSignUp,
  loadTokens,
  clearTokens,
  getValidToken,
} from '../api/auth';
import type { CurateAIWidgetConfig } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  error: string | null;
  /** Set when sign-up needs confirmation */
  needsConfirmation: boolean;
  pendingUsername: string | null;
}

function getCognitoConfig(config: CurateAIWidgetConfig) {
  return {
    region: config.cognitoRegion!,
    clientId: config.cognitoClientId!,
  };
}

export function useAuth(config: CurateAIWidgetConfig) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    username: null,
    error: null,
    needsConfirmation: false,
    pendingUsername: null,
  });

  const cognitoRef = useRef(getCognitoConfig(config));
  useEffect(() => {
    cognitoRef.current = getCognitoConfig(config);
  }, [config.cognitoRegion, config.cognitoClientId]);

  // Check for existing session on mount
  useEffect(() => {
    (async () => {
      const token = await getValidToken(cognitoRef.current);
      setState((s) => ({
        ...s,
        isAuthenticated: !!token,
        isLoading: false,
      }));
    })();
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await cognitoSignIn(cognitoRef.current, username, password);
      setState((s) => ({
        ...s,
        isAuthenticated: true,
        isLoading: false,
        username,
        error: null,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Sign in failed',
      }));
    }
  }, []);

  const signUp = useCallback(async (username: string, password: string, email: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await cognitoSignUp(cognitoRef.current, username, password, email);
      if (result.userConfirmed) {
        // Auto-confirmed — sign in directly
        await cognitoSignIn(cognitoRef.current, username, password);
        setState((s) => ({
          ...s,
          isAuthenticated: true,
          isLoading: false,
          username,
          error: null,
        }));
      } else {
        setState((s) => ({
          ...s,
          isLoading: false,
          needsConfirmation: true,
          pendingUsername: username,
          error: null,
        }));
      }
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Sign up failed',
      }));
    }
  }, []);

  const confirmSignUp = useCallback(async (code: string, password: string) => {
    const username = state.pendingUsername;
    if (!username) return;

    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await cognitoConfirmSignUp(cognitoRef.current, username, code);
      // Auto sign-in after confirmation
      await cognitoSignIn(cognitoRef.current, username, password);
      setState((s) => ({
        ...s,
        isAuthenticated: true,
        isLoading: false,
        username,
        needsConfirmation: false,
        pendingUsername: null,
        error: null,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Confirmation failed',
      }));
    }
  }, [state.pendingUsername]);

  const signOut = useCallback(() => {
    clearTokens();
    setState({
      isAuthenticated: false,
      isLoading: false,
      username: null,
      error: null,
      needsConfirmation: false,
      pendingUsername: null,
    });
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    return getValidToken(cognitoRef.current);
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    getToken,
    clearError,
  };
}
