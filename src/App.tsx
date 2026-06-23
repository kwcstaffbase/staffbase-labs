import { useState } from 'react';
import { getUserContext, UserContext } from './utils/jwt';
import Header from './components/Header';
import CatalogView from './components/CatalogView';
import DetailView from './components/DetailView';
import ExperimentalView from './components/ExperimentalView';
import SigCareView from './components/SigCareView';
import { getSolutionById } from './data/catalog';

type NavView = 'all' | 'supported' | 'experimental' | 'carehours';
type AppView = NavView | 'detail';

export default function App() {
  const [user] = useState<UserContext>(() => getUserContext());
  const [view, setView] = useState<AppView>('all');
  const [detailId, setDetailId] = useState<string | null>(null);

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
  const catalogMode = activeNavView === 'carehours' ? 'all' : activeNavView;

  return (
    <div className="app">
      <Header activeView={activeNavView} onNavigate={handleNavigate} />

      {view === 'carehours' ? (
        <SigCareView />
      ) : view === 'experimental' ? (
        <ExperimentalView />
      ) : view === 'detail' && detailSolution ? (
        <DetailView solution={detailSolution} user={user} onBack={handleBack} />
      ) : (
        <CatalogView
          mode={catalogMode}
          user={user}
          onViewDetail={handleViewDetail}
        />
      )}
    </div>
  );
}
