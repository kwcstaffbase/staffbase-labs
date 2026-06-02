import { Solution } from '../data/catalog';
import Icon from './Icon';

interface SolutionCardProps {
  solution: Solution;
  onClick: () => void;
  onAddToInstance?: () => void;
}

const CATEGORY_CLASS: Record<string, string> = {
  Widget: 'badge--widget',
  Plugin: 'badge--plugin',
  Integration: 'badge--integration',
};

export default function SolutionCard({ solution, onClick, onAddToInstance }: SolutionCardProps) {
  const isExperimental = solution.tier === 'Experimental';

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
        <button
          className="btn btn--ghost btn--sm"
          onClick={onClick}
        >
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
          <button
            className="btn btn--primary btn--sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToInstance?.();
            }}
          >
            Add to Instance
          </button>
        )}
      </div>
    </article>
  );
}
