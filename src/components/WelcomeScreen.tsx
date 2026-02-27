import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';

interface WelcomeScreenProps {
  onTopicClick?: (message: string) => void;
}

const TOPICS = [
  {
    title: 'Skin & Beauty',
    desc: 'Get personalized skincare recommendations',
    message: 'I need help with my skincare routine',
    icon: (
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
        <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2" />
      </svg>
    ),
  },
  {
    title: 'Health & Wellness',
    desc: 'Find supplements for your goals',
    message: 'I want to improve my overall health and wellness',
    icon: (
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
      </svg>
    ),
  },
  {
    title: 'Hair & Growth',
    desc: 'Solutions for healthier hair',
    message: 'I need help with hair growth and health',
    icon: (
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 6c0-1.7.7-3.2 1.8-4.2a5.8 5.8 0 00-3.6 0C11.3 2.8 12 4.3 12 6z" />
        <path d="M12 6c-3.3 0-6 2.7-6 6v1c0 3.3 2.7 6 6 6s6-2.7 6-6v-1c0-3.3-2.7-6-6-6z" />
        <path d="M12 19v3" />
      </svg>
    ),
  },
];

export function WelcomeScreen({ onTopicClick }: WelcomeScreenProps) {
  const config = useConfig();

  return (
    <div class="cai-welcome">
      <div class="cai-welcome-title">{config.welcomeMessage}</div>
      <div class="cai-welcome-msg">What can I help you with today?</div>
      <div class="cai-topic-cards">
        {TOPICS.map((topic) => (
          <button
            key={topic.title}
            class="cai-topic-card"
            onClick={() => onTopicClick?.(topic.message)}
          >
            <div class="cai-topic-icon">{topic.icon}</div>
            <div class="cai-topic-text">
              <div class="cai-topic-title">{topic.title}</div>
              <div class="cai-topic-desc">{topic.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
