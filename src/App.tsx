import { useState } from 'react';
import { getUserContext, parseJWT, UserContext } from './utils/jwt';
import Header from './components/Header';
import CatalogView from './components/CatalogView';
import DetailView from './components/DetailView';
import ExperimentalView from './components/ExperimentalView';
import { getSolutionById } from './data/catalog';

type NavView = 'all' | 'supported' | 'experimental';
type AppView = NavView | 'detail';

/** Grab raw JWT info for the debug banner — runs once on mount */
function getDebugInfo() {
  const params = new URLSearchParams(window.location.search);
  const rawJwt = params.get('jwt');
  const referrer = document.referrer || '(none)';
  if (!rawJwt) return { hasJwt: false, iss: null, rawIss: null, referrer };
  const payload = parseJWT(rawJwt);
  const iss = payload?.iss ?? null;
  return { hasJwt: true, iss, rawIss: typeof iss === 'string' ? iss : String(iss ?? ''), referrer };
}

export default function App() {
  const [user] = useState<UserContext>(() => getUserContext());
  const [view, setView] = useState<AppView>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(true);

  // DEBUG banner state — remove this block before final release
  const [debug] = useState(() => getDebugInfo());

  function handleNavigate(nextView: NavView) {
    setView(nextView);
    setDetailId(null);
  }

  function handleViewDetail(id: string) {
    setDetailId(id);
    setView('detail');
  }

  function handleBack() {
    setView('all');
    setDetailId(null);
  }

  const activeNavView: NavView = view === 'detail' ? 'all' : (view as NavView);
  const detailSolution = view === 'detail' && detailId ? getSolutionById(detailId) : null;

  return (
    <div className="app">
      <Header activeView={activeNavView} onNavigate={handleNavigate} />

      {/* DEBUG BANNER — remove before final release */}
      {showDebug && (
        <div style={{
          background: '#1e1e2e', color: '#cdd6f4', fontFamily: 'monospace',
          fontSize: '11px', padding: '8px 16px', lineHeight: 1.6,
          borderBottom: '1px solid #45475a', position: 'relative',
        }}>
          <button
            onClick={() => setShowDebug(false)}
            style={{ position: 'absolute', top: 6, right: 10, background: 'none',
              border: 'none', color: '#6c7086', cursor: 'pointer', fontSize: 14 }}
          >✕</button>
          <strong style={{ color: '#89b4fa' }}>🔍 DEBUG</strong>
          {' · '}
          <span style={{ color: debug.hasJwt ? '#a6e3a1' : '#f38ba8' }}>
            JWT: {debug.hasJwt ? 'present' : 'NOT FOUND'}
          </span>
          {' · '}
          <span>
            iss: <span style={{ color: '#fab387' }}>{debug.rawIss || '(none)'}</span>
          </span>
          {' · '}
          <span>
            referrer: <span style={{ color: debug.referrer !== '(none)' ? '#a6e3a1' : '#f38ba8' }}>{debug.referrer}</span>
          </span>
          {' · '}
          <span>
            instanceOrigin: <span style={{ color: user.instanceOrigin ? '#a6e3a1' : '#f38ba8' }}>
              {user.instanceOrigin ?? '(null — this causes the error)'}
            </span>
          </span>
        </div>
      )}

      {view === 'experimental' ? (
        <ExperimentalView />
      ) : view === 'detail' && detailSolution ? (
        <DetailView solution={detailSolution} user={user} onBack={handleBack} />
      ) : (
        <CatalogView
          mode={activeNavView}
          user={user}
          onViewDetail={handleViewDetail}
        />
      )}
    </div>
  );
}
