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
      <div class="cai-header-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="spark-hdr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#FFFDF9"/>
              <stop offset="1" stop-color="#FBF7F0"/>
            </linearGradient>
          </defs>
          <path d="M12 2 L13.6 9.2 Q13.9 10.5 15 10.8 L22 12 L15 13.2 Q13.9 13.5 13.6 14.8 L12 22 L10.4 14.8 Q10.1 13.5 9 13.2 L2 12 L9 10.8 Q10.1 10.5 10.4 9.2 Z"
            fill="url(#spark-hdr)"/>
          <path d="M19 4 L19.5 6 Q19.6 6.4 20 6.5 L22 7 L20 7.5 Q19.6 7.6 19.5 8 L19 10 L18.5 8 Q18.4 7.6 18 7.5 L16 7 L18 6.5 Q18.4 6.4 18.5 6 Z"
            fill="rgba(255,253,249,0.85)"/>
        </svg>
      </div>
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
        <svg viewBox="0 0 24 24" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
