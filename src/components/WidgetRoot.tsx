import { h } from 'preact';
import { useState, useCallback, useEffect, useMemo } from 'preact/hooks';
import { ConfigContext } from '../hooks/useConfig';
import { useAuth } from '../hooks/useAuth';
import { useDraggable, DragPosition } from '../hooks/useDraggable';
import { ChatBubble } from './ChatBubble';
import { ChatWindow } from './ChatWindow';
import { LoginScreen } from './LoginScreen';
import { ChatHeader } from './ChatHeader';
import type { CurateAIWidgetConfig, CurateAIPublicAPI } from '../types';

function computeWindowStyle(pos: DragPosition, bubbleSize: number): h.JSX.CSSProperties {
  const gap = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centerY = pos.top + bubbleSize / 2;
  const centerX = pos.left + bubbleSize / 2;
  const openUp = centerY > vh / 2;
  const alignLeft = centerX < vw / 2;
  const style: h.JSX.CSSProperties = { position: 'fixed' };
  if (openUp) {
    style.bottom = `${vh - pos.top + gap}px`;
    style.top = 'auto';
  } else {
    style.top = `${pos.top + bubbleSize + gap}px`;
    style.bottom = 'auto';
  }
  if (alignLeft) {
    style.left = `${pos.left}px`;
    style.right = 'auto';
  } else {
    style.right = `${vw - pos.left - bubbleSize}px`;
    style.left = 'auto';
  }
  return style;
}

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

  const { position: dragPos, isDragging, onPointerDown } = useDraggable({
    size: config.bubbleSize,
    onClick: toggle,
  });

  const bubbleStyle = useMemo<h.JSX.CSSProperties | undefined>(() => {
    if (!dragPos) return undefined;
    return {
      position: 'fixed',
      top: `${dragPos.top}px`,
      left: `${dragPos.left}px`,
      bottom: 'auto',
      right: 'auto',
    };
  }, [dragPos]);

  const windowStyle = useMemo<h.JSX.CSSProperties | undefined>(() => {
    if (!dragPos) return undefined;
    return computeWindowStyle(dragPos, config.bubbleSize);
  }, [dragPos, config.bubbleSize]);

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
            <div class={`cai-window ${isClosing ? 'cai-closing' : ''}`} style={windowStyle}>
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
              style={windowStyle}
            />
          )
        )}
        <ChatBubble
          isOpen={isOpen}
          isDragging={isDragging}
          style={bubbleStyle}
          onPointerDown={onPointerDown}
          onKeyActivate={toggle}
        />
      </div>
    </ConfigContext.Provider>
  );
}
