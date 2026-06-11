import { h } from 'preact';
import { useState } from 'preact/hooks';

interface LeadCaptureFormProps {
  onSubmit: (name: string, email: string, phone: string) => void;
  isSubmitting: boolean;
}

export function LeadCaptureForm({ onSubmit, isSubmitting }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const canSubmit =
    !isSubmitting &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(name.trim(), email.trim(), phone.trim());
  };

  return (
    <form class="cai-lead-form" onSubmit={handleSubmit}>
      <div class="cai-lead-heading">Continue the conversation</div>
      <div class="cai-lead-sub">A few details so we can pick up where we left off.</div>

      <input
        class="cai-lead-input"
        type="text"
        placeholder="Name"
        value={name}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
        disabled={isSubmitting}
        autocomplete="name"
        required
      />
      <input
        class="cai-lead-input"
        type="email"
        placeholder="Email"
        value={email}
        onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        disabled={isSubmitting}
        autocomplete="email"
        required
      />
      <input
        class="cai-lead-input"
        type="tel"
        placeholder="Phone"
        value={phone}
        onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
        disabled={isSubmitting}
        autocomplete="tel"
        required
      />

      <button
        class="cai-lead-submit"
        type="submit"
        disabled={!canSubmit}
      >
        {isSubmitting ? 'Sending…' : 'Continue'}
      </button>
    </form>
  );
}
