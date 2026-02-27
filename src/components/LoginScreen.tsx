import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useConfig } from '../hooks/useConfig';

type Tab = 'signin' | 'signup';

interface LoginScreenProps {
  isLoading: boolean;
  error: string | null;
  needsConfirmation: boolean;
  onSignIn: (username: string, password: string) => void;
  onSignUp: (username: string, password: string, email: string) => void;
  onConfirm: (code: string, password: string) => void;
  onClearError: () => void;
}

export function LoginScreen({
  isLoading,
  error,
  needsConfirmation,
  onSignIn,
  onSignUp,
  onConfirm,
  onClearError,
}: LoginScreenProps) {
  const config = useConfig();
  const [tab, setTab] = useState<Tab>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  const switchTab = (t: Tab) => {
    setTab(t);
    setUsername('');
    setEmail('');
    setPassword('');
    onClearError();
  };

  const handleSignIn = (e: Event) => {
    e.preventDefault();
    if (username.trim() && password) onSignIn(username.trim(), password);
  };

  const handleSignUp = (e: Event) => {
    e.preventDefault();
    if (username.trim() && password && email.trim()) {
      onSignUp(username.trim(), password, email.trim());
    }
  };

  const handleConfirm = (e: Event) => {
    e.preventDefault();
    if (confirmCode.trim()) onConfirm(confirmCode.trim(), password);
  };

  if (needsConfirmation) {
    return (
      <div class="cai-login">
        <div class="cai-login-header">
          <div class="cai-login-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
            </svg>
          </div>
          <h2 class="cai-login-title">Check your email</h2>
          <p class="cai-login-subtitle">Enter the confirmation code we sent to verify your account</p>
        </div>

        {error && <div class="cai-login-error">{error}</div>}

        <form onSubmit={handleConfirm} class="cai-login-form">
          <input
            type="text"
            class="cai-login-input"
            placeholder="Confirmation code"
            value={confirmCode}
            onInput={(e) => setConfirmCode((e.target as HTMLInputElement).value)}
            autoFocus
          />
          <button type="submit" class="cai-login-btn" disabled={isLoading || !confirmCode.trim()}>
            {isLoading ? 'Verifying...' : 'Verify account'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div class="cai-login">
      <div class="cai-login-header">
        <div class="cai-login-icon">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
            <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2" />
            <path d="M19 11h2m-1-1v2" />
          </svg>
        </div>
        <h2 class="cai-login-title">{config.title}</h2>
        <p class="cai-login-subtitle">Sign in to get personalized recommendations</p>
      </div>

      <div class="cai-login-tabs">
        <button
          class={`cai-login-tab ${tab === 'signin' ? 'cai-active' : ''}`}
          onClick={() => switchTab('signin')}
        >
          Sign In
        </button>
        <button
          class={`cai-login-tab ${tab === 'signup' ? 'cai-active' : ''}`}
          onClick={() => switchTab('signup')}
        >
          Sign Up
        </button>
      </div>

      {error && <div class="cai-login-error">{error}</div>}

      {tab === 'signin' ? (
        <form onSubmit={handleSignIn} class="cai-login-form">
          <input
            type="text"
            class="cai-login-input"
            placeholder="Username"
            value={username}
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            autoFocus
          />
          <input
            type="password"
            class="cai-login-input"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <button
            type="submit"
            class="cai-login-btn"
            disabled={isLoading || !username.trim() || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignUp} class="cai-login-form">
          <input
            type="text"
            class="cai-login-input"
            placeholder="Username"
            value={username}
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            autoFocus
          />
          <input
            type="email"
            class="cai-login-input"
            placeholder="Email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
          <input
            type="password"
            class="cai-login-input"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <button
            type="submit"
            class="cai-login-btn"
            disabled={isLoading || !username.trim() || !email.trim() || !password}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
}
