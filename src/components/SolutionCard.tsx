import { useState } from 'react';
import { Solution } from '../data/catalog';
import { WIDGET_BUNDLES } from '../data/bundles';
import { UserContext } from '../utils/jwt';
import { installWidget, InstallState } from '../utils/api';
import Icon from './Icon';

interface SolutionCardProps {
  solution: Solution;
  user: UserContext;
  onClick: () => void;
}

const CATEGORY_CLASS: Record<string, string> = {
  Widget: 'badge--widget',
  Plugin: 'badge--plugin',
  Integration: 'badge--integration',
};

export default function SolutionCard({ solution, user, onClick }: SolutionCardProps) {
  const isExperimental = solution.tier === 'Experimental';
  const bundle = WIDGET_BUNDLES[solution.id];

  const [installState, setInstallState] = useState<InstallState>('idle');
  const [installError, setInstallError] = useState<string | null>(null);

  async function handleInstall(e: React.MouseEvent) {
    e.stopPropagation();
    if (!bundle || installState === 'loading') return;
    setInstallState('loading');
    setInstallError(null);
    const result = await installWidget(user.tenant, bundle.bundleUrl, bundle.elementName);
    if (result.success) {
      setInstallState('success');
      setTimeout(() => setInstallState('idle'), 3500);
    } else {
      setInstallError(result.error ?? 'Unknown error');
      setInstallState('error');
      setTimeout(() => { setInstallState('idle'); setInstallError(null); }, 6000);
    }
  }

  function renderInstallButton() {
    if (installState === 'loading') {
      return (
        <button className="btn btn--primary btn--sm" disabled>
          <span className="btn-spinner" />
          Installing…
        </button>
      );
    }
    if (installState === 'success') {
      return (
        <button className="btn btn--success btn--sm" disabled>
          <Icon name="check-circle" size={13} />
          Added!
        </button>
      );
    }
    if (bundle) {
      return (
        <button className="btn btn--primary btn--sm" onClick={handleInstall}>
          Add to Instance
        </button>
      );
    }
    // No bundle (e.g. Digital Business Card) — no install button
    return null;
  }

  return (
    <article
      className={`solution-card${isExperimental ? ' solution-card--experimental' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`View details for ${solution.title}`}
    >
      <div className="solution-card__top">
        <div className="solution-card__icon">
          <Icon name={solution.icon} size={20} />
        </div>
        <span className={`badge ${isExperimental ? 'badge--experimental' : 'badge--supported'}`}>
          {solution.tier}
        </span>
      </div>

      <h3 className="solution-card__title">{solution.title}</h3>
      <p className="solution-card__desc">{solution.short_description}</p>

      <div className="solution-card__footer">
        <span className={`badge ${CATEGORY_CLASS[solution.category] ?? 'badge--widget'}`}>
          {solution.category}
        </span>
        {isExperimental && (
          <span className="badge badge--open-source">Open Source</span>
        )}
      </div>

      <div
        className="solution-card__actions"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn btn--ghost btn--sm" onClick={onClick}>
          View Details
        </button>
        {isExperimental ? (
          <a
            href={solution.github_url ?? '#'}
            className="btn btn--github btn--sm"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="github" size={13} />
            GitHub
          </a>
        ) : (
          renderInstallButton()
        )}
      </div>

      {installState === 'error' && installError && (
        <div className="card-install-error">
          <Icon name="triangle-alert" size={12} />
          {installError}
        </div>
      )}
    </article>
  );
}
