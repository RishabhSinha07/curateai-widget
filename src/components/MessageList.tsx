import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onQuickReply: (text: string) => void;
}

export function MessageList({ messages, isLoading, onQuickReply }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages / loading state
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i;
    }
    return -1;
  })();

  return (
    <div class="cai-messages">
      {messages.map((msg, idx) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isLastAssistant={idx === lastAssistantIdx}
          onQuickReply={onQuickReply}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
