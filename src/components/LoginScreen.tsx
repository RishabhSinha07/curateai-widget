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

  const sparkIcon = (
    <svg viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="spark-login" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFFDF9"/>
          <stop offset="1" stop-color="#FBF7F0"/>
        </linearGradient>
      </defs>
      <path d="M12 2 L13.6 9.2 Q13.9 10.5 15 10.8 L22 12 L15 13.2 Q13.9 13.5 13.6 14.8 L12 22 L10.4 14.8 Q10.1 13.5 9 13.2 L2 12 L9 10.8 Q10.1 10.5 10.4 9.2 Z"
        fill="url(#spark-login)"/>
      <path d="M19 4 L19.5 6 Q19.6 6.4 20 6.5 L22 7 L20 7.5 Q19.6 7.6 19.5 8 L19 10 L18.5 8 Q18.4 7.6 18 7.5 L16 7 L18 6.5 Q18.4 6.4 18.5 6 Z"
        fill="rgba(255,253,249,0.85)"/>
    </svg>
  );

  if (needsConfirmation) {
    return (
      <div class="cai-login">
        <div class="cai-login-header">
          <div class="cai-login-icon">{sparkIcon}</div>
          <h2 class="cai-login-title">Check your email</h2>
          <p class="cai-login-subtitle">Enter the confirmation code we sent to verify your account</p>
        </div>

        {error && <div class="cai-login-error">{error}</div>}

        <form onSubmit={handleConfirm} class="cai-login-form">
          <div class="cai-login-field">
            <div class="cai-login-field-label">Confirmation Code</div>
            <input
              type="text"
              class="cai-login-input"
              placeholder="Enter code"
              value={confirmCode}
              onInput={(e) => setConfirmCode((e.target as HTMLInputElement).value)}
              autoFocus
            />
          </div>
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
        <div class="cai-login-icon">{sparkIcon}</div>
        <h2 class="cai-login-title">Welcome back</h2>
        <p class="cai-login-subtitle">Sign in for recommendations tailored to you.</p>
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
          <div class="cai-login-field">
            <div class="cai-login-field-label">Username</div>
            <input
              type="text"
              class="cai-login-input"
              placeholder="Enter username"
              value={username}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              autoFocus
            />
          </div>
          <div class="cai-login-field">
            <div class="cai-login-field-label">Password</div>
            <input
              type="password"
              class="cai-login-input"
              placeholder="Enter password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
          </div>
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
          <div class="cai-login-field">
            <div class="cai-login-field-label">Username</div>
            <input
              type="text"
              class="cai-login-input"
              placeholder="Choose username"
              value={username}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              autoFocus
            />
          </div>
          <div class="cai-login-field">
            <div class="cai-login-field-label">Email</div>
            <input
              type="email"
              class="cai-login-input"
              placeholder="Enter email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="cai-login-field">
            <div class="cai-login-field-label">Password</div>
            <input
              type="password"
              class="cai-login-input"
              placeholder="Choose password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
          </div>
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
