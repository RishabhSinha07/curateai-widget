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
      {!isOpen && <div class="cai-bubble-tooltip">How may I help you?</div>}
      <span class="cai-bubble-online" />
      {/* AI sparkle icon */}
      <svg class="cai-chat-icon" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="spark-fab" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFFDF9"/>
            <stop offset="1" stop-color="#FBF7F0"/>
          </linearGradient>
        </defs>
        <path d="M12 2 L13.6 9.2 Q13.9 10.5 15 10.8 L22 12 L15 13.2 Q13.9 13.5 13.6 14.8 L12 22 L10.4 14.8 Q10.1 13.5 9 13.2 L2 12 L9 10.8 Q10.1 10.5 10.4 9.2 Z"
          fill="url(#spark-fab)"/>
        <path d="M19 4 L19.5 6 Q19.6 6.4 20 6.5 L22 7 L20 7.5 Q19.6 7.6 19.5 8 L19 10 L18.5 8 Q18.4 7.6 18 7.5 L16 7 L18 6.5 Q18.4 6.4 18.5 6 Z"
          fill="rgba(255,253,249,0.85)"/>
      </svg>
      {/* Close icon */}
      <svg class="cai-close-icon" viewBox="0 0 24 24" stroke="#FFFDF9" stroke-width="1.8" stroke-linecap="round" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
