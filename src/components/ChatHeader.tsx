import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

interface ChatHeaderProps {
  onClose: () => void;
  onSignOut?: () => void;
}

export function ChatHeader({ onClose, onSignOut }: ChatHeaderProps) {
  const config = useConfig();

  return (
    <div class="cai-header">
      <div class="cai-header-dot" />
      <div class="cai-header-text">
        <div class="cai-header-title">{config.title}</div>
        <div class="cai-header-subtitle">{config.subtitle}</div>
      </div>
      {onSignOut && (
        <button class="cai-header-signout" onClick={onSignOut} aria-label="Sign out" title="Sign out">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}
      <button class="cai-header-close" onClick={onClose} aria-label="Close chat">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
