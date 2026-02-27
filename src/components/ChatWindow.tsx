import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useConfig } from '../hooks/useConfig';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { ErrorBanner } from './ErrorBanner';
import { PoweredBy } from './PoweredBy';

interface ChatWindowProps {
  isClosing: boolean;
  onClose: () => void;
  pendingMessage: string | null;
  onPendingConsumed: () => void;
}

export function ChatWindow({ isClosing, onClose, pendingMessage, onPendingConsumed }: ChatWindowProps) {
  const config = useConfig();
  const { messages, isLoading, error, sendMessage, clearChat } = useChat(config);

  // Handle programmatic sendMessage
  useEffect(() => {
    if (pendingMessage) {
      sendMessage(pendingMessage);
      onPendingConsumed();
    }
  }, [pendingMessage]);

  const hasMessages = messages.length > 0;

  return (
    <div class={`cai-window ${isClosing ? 'cai-closing' : ''}`}>
      <ChatHeader onClose={onClose} />

      {!hasMessages && !isLoading ? (
        <WelcomeScreen />
      ) : (
        <MessageList messages={messages} isLoading={isLoading} onQuickReply={sendMessage} />
      )}

      {error && <ErrorBanner message={error} />}

      <ChatInput onSend={sendMessage} isLoading={isLoading} />

      {config.showPoweredBy && <PoweredBy />}
    </div>
  );
}
