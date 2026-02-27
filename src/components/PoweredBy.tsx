import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

export function PoweredBy() {
  const config = useConfig();

  return (
    <div class="cai-powered">
      <a href={config.poweredByUrl} target="_blank" rel="noopener noreferrer">
        {config.poweredByText}
      </a>
    </div>
  );
}
