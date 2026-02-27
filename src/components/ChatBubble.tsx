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
      {!isOpen && <div class="cai-bubble-tooltip">Can I help you?</div>}
      {/* Robot icon */}
      <svg class="cai-chat-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="9" width="14" height="10" rx="2" />
        <circle cx="9" cy="14" r="1.5" fill="#fff" stroke="none" />
        <circle cx="15" cy="14" r="1.5" fill="#fff" stroke="none" />
        <path d="M12 2v4" />
        <circle cx="12" cy="2" r="1" fill="#fff" stroke="none" />
        <path d="M2 13v2" />
        <path d="M22 13v2" />
      </svg>
      {/* Close icon */}
      <svg class="cai-close-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
