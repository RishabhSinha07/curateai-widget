/**
 * Lightweight markdown → HTML renderer.
 * Handles: bold, italic, links, inline code, headings, lists, paragraphs.
 * Escapes HTML entities for XSS safety.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
  return text
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function renderMarkdown(src: string): string {
  const lines = src.split('\n');
  const out: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let paraLines: string[] = [];

  function flushParagraph() {
    if (paraLines.length === 0) return;
    const text = paraLines.join(' ').trim();
    if (text) {
      out.push(`<p>${renderInline(escapeHtml(text))}</p>`);
    }
    paraLines = [];
  }

  function closeList() {
    if (inList) {
      out.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Empty line — flush paragraph
    if (line.trim() === '') {
      flushParagraph();
      closeList();
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      out.push(`<h${level}>${renderInline(escapeHtml(headingMatch[2]))}</h${level}>`);
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.*)/);
    if (ulMatch) {
      flushParagraph();
      if (inList !== 'ul') {
        closeList();
        out.push('<ul>');
        inList = 'ul';
      }
      out.push(`<li>${renderInline(escapeHtml(ulMatch[1]))}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+\.\s+(.*)/);
    if (olMatch) {
      flushParagraph();
      if (inList !== 'ol') {
        closeList();
        out.push('<ol>');
        inList = 'ol';
      }
      out.push(`<li>${renderInline(escapeHtml(olMatch[1]))}</li>`);
      continue;
    }

    // Regular text — accumulate for paragraph
    closeList();
    paraLines.push(line);
  }

  flushParagraph();
  closeList();

  return out.join('');
}

/**
 * Detect section-heading bold text: **Something:**
 * Renders as a special heading span instead of inline bold.
 */
export function renderMarkdownWithSections(src: string, isSectionHeading: boolean): string {
  if (!isSectionHeading) return renderMarkdown(src);

  // Replace bold-colon patterns at line start with section heading spans
  const processed = src.replace(
    /^\*\*(.+?):\*\*$/gm,
    '<span class="cai-section-heading">$1:</span>'
  );

  return renderMarkdown(processed);
}
