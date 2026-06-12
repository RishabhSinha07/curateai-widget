import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

export function PoweredBy() {
  const config = useConfig();
  const text = config.poweredByText || 'Powered by Noeticex';
  const url = config.poweredByUrl;

  // Render the brand portion (everything after the last "by ") in the brand
  // span so it picks up the brand-link color. Falls back to plain text when
  // the prefix isn't present.
  const match = /^(.*?\bby\s+)(.+)$/i.exec(text);
  const prefix = match ? match[1] : '';
  const brand  = match ? match[2] : text;

  const brandEl = url
    ? <a class="cai-powered-brand" href={url} target="_blank" rel="noopener noreferrer">{brand}</a>
    : <span class="cai-powered-brand">{brand}</span>;

  return (
    <div class="cai-powered">
      {prefix}{brandEl}
    </div>
  );
}
