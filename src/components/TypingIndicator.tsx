import { h } from 'preact';

export function TypingIndicator() {
  return (
    <div class="cai-msg cai-msg-assistant">
      <div class="cai-typing">
        <div class="cai-typing-dot" />
        <div class="cai-typing-dot" />
        <div class="cai-typing-dot" />
      </div>
    </div>
  );
}
