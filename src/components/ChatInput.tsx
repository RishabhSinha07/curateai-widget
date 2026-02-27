import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { useConfig } from '../hooks/useConfig';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const config = useConfig();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div class="cai-input-area">
      <div class="cai-input-wrap">
        <input
          ref={inputRef}
          class="cai-input"
          type="text"
          placeholder={config.placeholder}
          value={value}
          onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autocomplete="off"
        />
        <button
          class="cai-send-btn"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
