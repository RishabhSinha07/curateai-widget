import { h } from 'preact';

interface SuggestedRepliesProps {
  replies: string[];
  onReply: (text: string) => void;
}

export function SuggestedReplies({ replies, onReply }: SuggestedRepliesProps) {
  return (
    <div class="cai-replies">
      {replies.map((reply) => (
        <button
          key={reply}
          class="cai-reply-btn"
          onClick={() => onReply(reply)}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
