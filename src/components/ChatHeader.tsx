import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const config = useConfig();

  return (
    <div class="cai-header">
      <div class="cai-header-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
          <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2" />
          <path d="M19 11h2m-1-1v2" />
        </svg>
      </div>
      <div class="cai-header-text">
        <div class="cai-header-title">{config.title}</div>
        <div class="cai-header-subtitle">{config.subtitle}</div>
      </div>
      <button class="cai-header-close" onClick={onClose} aria-label="Close chat">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
