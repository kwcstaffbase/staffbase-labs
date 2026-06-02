import { useState, useEffect } from 'react';
import Icon from './Icon';

// Storage key for the API token
const TOKEN_KEY = 'sblabs_api_token';

// In Phase 1 the token is stored in localStorage.
// TODO: Replace with a proper server-side config endpoint when the API is defined.
function loadToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? '';
}

function saveToken(token: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

type SaveState = 'idle' | 'saved' | 'cleared';

export default function AdminApp() {
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    const stored = loadToken();
    setSavedToken(stored);
    setToken(stored);
  }, []);

  const isTokenSet = savedToken.length > 0;
  const isDirty = token !== savedToken;

  function handleSave() {
    saveToken(token);
    setSavedToken(token);
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 3000);
  }

  function handleClear() {
    if (!window.confirm('Remove the saved API token? This cannot be undone.')) return;
    saveToken('');
    setSavedToken('');
    setToken('');
    setSaveState('cleared');
    setTimeout(() => setSaveState('idle'), 3000);
  }

  function maskedToken(t: string): string {
    if (t.length <= 8) return '•'.repeat(t.length);
    return t.slice(0, 4) + '•'.repeat(Math.min(t.length - 8, 24)) + t.slice(-4);
  }

  return (
    <div className="admin-layout">

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__logo">
            <span className="admin-header__logo-dot" />
            Staffbase Labs
          </div>
          <span className="admin-header__sep">/</span>
          <span className="admin-header__title">Admin Configuration</span>
        </div>
      </header>

      <main className="admin-main">
        <h1 className="admin-page-title">Plugin Configuration</h1>
        <p className="admin-page-subtitle">
          Manage API credentials and settings for the Staffbase Labs plugin.
          Changes apply to all users of this plugin instance.
        </p>

        {/* API Token card */}
        <div className="admin-card">
          <div className="admin-card__header">
            <div className="admin-card__header-icon">
              <Icon name="lock" size={16} />
            </div>
            <div className="admin-card__header-text">
              <h2>API Token</h2>
              <p>Used to authenticate requests to the Labs API</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`admin-status ${isTokenSet ? 'admin-status--set' : 'admin-status--not-set'}`}>
                <span className="admin-status__dot" />
                {isTokenSet ? 'Token saved' : 'Not configured'}
              </span>
            </div>
          </div>

          <div className="admin-card__body">
            <div className="admin-form">

              <div className="admin-field">
                <label className="admin-field__label" htmlFor="api-token">
                  API Token
                </label>
                <div className="admin-field__input-wrap">
                  <input
                    id="api-token"
                    type={showToken ? 'text' : 'password'}
                    className={`admin-field__input${isTokenSet && !isDirty ? ' admin-field__input--saved' : ''}`}
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setSaveState('idle');
                    }}
                    placeholder="Paste your API token here"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="admin-field__toggle-vis"
                    onClick={() => setShowToken((v) => !v)}
                    aria-label={showToken ? 'Hide token' : 'Show token'}
                  >
                    <Icon name={showToken ? 'lock' : 'info'} size={15} />
                  </button>
                </div>
                {isTokenSet && !isDirty && (
                  <span className="admin-field__hint">
                    Saved token: <code style={{ fontFamily: 'monospace' }}>{maskedToken(savedToken)}</code>
                  </span>
                )}
              </div>

              {/* Feedback */}
              {saveState === 'saved' && (
                <div className="admin-feedback admin-feedback--success">
                  <Icon name="check-circle" size={15} />
                  Token saved successfully
                </div>
              )}
              {saveState === 'cleared' && (
                <div className="admin-feedback admin-feedback--error">
                  <Icon name="triangle-alert" size={15} />
                  Token removed
                </div>
              )}

              <div className="admin-actions">
                <button
                  className="btn btn--primary"
                  onClick={handleSave}
                  disabled={!token || !isDirty}
                  style={{ opacity: (!token || !isDirty) ? 0.5 : 1 }}
                >
                  Save Token
                </button>
                {isDirty && token !== '' && (
                  <button
                    className="btn btn--ghost"
                    onClick={() => { setToken(savedToken); setSaveState('idle'); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="admin-info" style={{ marginBottom: 'var(--space-8)' }}>
          <Icon name="info" size={16} />
          <span>
            The token is currently stored in browser localStorage on this device.
            When the API endpoints are defined, this will be migrated to a secure server-side configuration store.
          </span>
        </div>

        {/* Danger zone */}
        {isTokenSet && (
          <div className="admin-danger-zone">
            <div className="admin-danger-zone__header">Danger Zone</div>
            <div className="admin-danger-zone__body">
              <p className="admin-danger-zone__desc">
                Permanently remove the saved API token. The plugin will stop making authenticated API calls until a new token is saved.
              </p>
              <button className="btn btn--danger btn--sm" onClick={handleClear}>
                Remove Token
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
