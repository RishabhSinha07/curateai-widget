import { h } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { ConfigContext } from '../hooks/useConfig';
import { ChatBubble } from './ChatBubble';
import { ChatWindow } from './ChatWindow';
import type { CurateAIWidgetConfig, CurateAIPublicAPI } from '../types';

interface WidgetRootProps {
  config: CurateAIWidgetConfig;
  onApiReady: (api: CurateAIPublicAPI) => void;
}

export function WidgetRoot({ config, onApiReady }: WidgetRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

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
          <ChatWindow
            isClosing={isClosing}
            onClose={close}
            pendingMessage={pendingMessage}
            onPendingConsumed={() => setPendingMessage(null)}
          />
        )}
        <ChatBubble isOpen={isOpen} onClick={toggle} />
      </div>
    </ConfigContext.Provider>
  );
}
