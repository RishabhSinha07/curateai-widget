import { h } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { ConfigContext } from '../hooks/useConfig';
import { useAuth } from '../hooks/useAuth';
import { ChatBubble } from './ChatBubble';
import { ChatWindow } from './ChatWindow';
import { LoginScreen } from './LoginScreen';
import { ChatHeader } from './ChatHeader';
import type { CurateAIWidgetConfig, CurateAIPublicAPI } from '../types';

interface WidgetRootProps {
  config: CurateAIWidgetConfig;
  onApiReady: (api: CurateAIPublicAPI) => void;
}

export function WidgetRoot({ config, onApiReady }: WidgetRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const hasCognitoAuth = !!(config.cognitoUserPoolId && config.cognitoClientId && config.cognitoRegion);
  const auth = useAuth(config);

  const needsLogin = hasCognitoAuth && config.requireAuth && !auth.isAuthenticated && !auth.isLoading;

  const open = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
    config.onOpen?.();
  }, [config]);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      config.onClose?.();
    }, 200);
  }, [config]);

  const toggle = useCallback(() => {
    if (isOpen && !isClosing) close();
    else if (!isOpen) open();
  }, [isOpen, isClosing, open, close]);

  // Expose public API
  useEffect(() => {
    onApiReady({
      open,
      close,
      toggle,
      sendMessage: (text: string) => {
        if (!isOpen) open();
        setPendingMessage(text);
      },
      destroy: () => {
        const host = document.getElementById('curateai-widget-host');
        if (host) host.remove();
        delete (window as any).CurateAI;
      },
    });
  }, [open, close, toggle, isOpen, onApiReady]);

  const positionClass = config.position === 'bottom-left' ? 'cai-bottom-left' : 'cai-bottom-right';

  return (
    <ConfigContext.Provider value={config}>
      <div class={`cai-container ${positionClass}`}>
        {isOpen && (
          needsLogin ? (
            <div class={`cai-window ${isClosing ? 'cai-closing' : ''}`}>
              <ChatHeader onClose={close} />
              <LoginScreen
                isLoading={auth.isLoading}
                error={auth.error}
                needsConfirmation={auth.needsConfirmation}
                onSignIn={auth.signIn}
                onSignUp={auth.signUp}
                onConfirm={auth.confirmSignUp}
                onClearError={auth.clearError}
              />
            </div>
          ) : (
            <ChatWindow
              isClosing={isClosing}
              onClose={close}
              pendingMessage={pendingMessage}
              onPendingConsumed={() => setPendingMessage(null)}
              onSignOut={hasCognitoAuth ? auth.signOut : undefined}
              getCognitoToken={hasCognitoAuth ? auth.getToken : undefined}
            />
          )
        )}
        <ChatBubble isOpen={isOpen} onClick={toggle} />
      </div>
    </ConfigContext.Provider>
  );
}
