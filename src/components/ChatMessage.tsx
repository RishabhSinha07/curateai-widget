import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { renderMarkdown } from '../utils/markdown';
import { ProductCarousel } from './ProductCarousel';
import { SuggestedReplies } from './SuggestedReplies';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isLastAssistant: boolean;
  onQuickReply: (text: string) => void;
}

interface Section {
  heading: string;
  body: string;
}

/**
 * Parse markdown content into collapsible sections.
 * Splits on bold-colon headers (**Header:**) or ## headings.
 * Returns null if content is short or has <2 sections.
 */
function parseSections(content: string): Section[] | null {
  if (content.length < 400) return null;

  const sectionRegex = /^(?:\*\*(.+?):\*\*|##\s+(.+))$/gm;
  const matches = [...content.matchAll(sectionRegex)];

  if (matches.length < 2) return null;

  const sections: Section[] = [];

  // Preamble before first heading
  const preambleEnd = matches[0].index!;
  const preamble = content.slice(0, preambleEnd).trim();
  if (preamble) {
    sections.push({ heading: '', body: preamble });
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const heading = (match[1] || match[2]).trim();
    const start = match.index! + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : content.length;
    const body = content.slice(start, end).trim();
    sections.push({ heading, body });
  }

  return sections;
}

function CollapsibleSection({ section, defaultExpanded }: { section: Section; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Preamble sections (no heading) are always shown
  if (!section.heading) {
    return (
      <div class="cai-md" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body) }} />
    );
  }

  return (
    <div>
      <button
        class="cai-collapsible-btn"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        {section.heading}:
      </button>
      <div class={`cai-collapsible-body ${expanded ? 'cai-open' : 'cai-closed'}`}>
        <div class="cai-collapsible-content cai-md" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body) }} />
      </div>
    </div>
  );
}

export function ChatMessage({ message, isLastAssistant, onQuickReply }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasProducts = !!message.products?.length;
  const showBubble = message.content.trim().length > 0;

  const showReplies = !isUser && isLastAssistant && (message.suggested_replies?.length ?? 0) > 0;

  const sections = useMemo(() => {
    if (isUser) return null;
    return parseSections(message.content);
  }, [message.content, isUser]);

  const renderedHtml = useMemo(() => {
    if (sections) return null; // sections handle their own rendering
    return renderMarkdown(message.content);
  }, [message.content, sections]);

  return (
    <div class={`cai-msg ${isUser ? 'cai-msg-user' : 'cai-msg-assistant'}`}>
      <div class="cai-msg-label">{isUser ? 'You' : 'Noeticex'}</div>
      {showBubble && (
        <div class="cai-bubble-wrap">
          {sections && !isUser ? (
            sections.map((section, idx) => (
              <CollapsibleSection
                key={idx}
                section={section}
                defaultExpanded={idx <= 1}
              />
            ))
          ) : (
            <div class="cai-md" dangerouslySetInnerHTML={{ __html: renderedHtml! }} />
          )}
        </div>
      )}

      {hasProducts && (
        <ProductCarousel products={message.products!} />
      )}

      {showReplies && (
        <SuggestedReplies replies={message.suggested_replies!} onReply={onQuickReply} />
      )}
    </div>
  );
}
