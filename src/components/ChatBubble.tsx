import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatBubble({ isOpen, onClick }: ChatBubbleProps) {
  const config = useConfig();

  return (
    <button
      class={`cai-bubble ${isOpen ? 'cai-open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {/* Chat icon */}
      <svg class="cai-chat-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {/* Close icon */}
      <svg class="cai-close-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
