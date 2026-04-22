import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

interface WelcomeScreenProps {
  onTopicClick?: (message: string) => void;
}

const TOPICS = [
  {
    title: 'Skin & Beauty',
    desc: 'Tailored routines for luminous skin',
    message: 'I need help with my skincare routine',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Health & Wellness',
    desc: 'Supplements matched to your goals',
    message: 'I want to improve my overall health and wellness',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 20c0-8 7-14 16-14-1 9-7 15-16 14z" />
        <path d="M4 20c4-4 8-8 14-12" />
      </svg>
    ),
  },
  {
    title: 'Hair & Growth',
    desc: 'Solutions for strength and shine',
    message: 'I need help with hair growth and health',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3c2 3 5 5 5 9a5 5 0 01-10 0c0-2 1-3 2-4-1 4 3 4 3 1 0-3-2-4 0-6z" />
      </svg>
    ),
  },
];

export function WelcomeScreen({ onTopicClick }: WelcomeScreenProps) {
  const config = useConfig();

  return (
    <div class="cai-welcome">
      <div class="cai-welcome-header">
        <div class="cai-welcome-kicker">— Welcome —</div>
        <div class="cai-welcome-title">
          Hello. How may I<br/>
          <em>guide you</em> today?
        </div>
      </div>

    </div>
  );
}
