import { useState } from 'react';
import { SOLUTIONS, Solution, Category } from '../data/catalog';
import { UserContext, buildZendeskUrl } from '../utils/jwt';
import SolutionCard from './SolutionCard';

type ViewMode = 'all' | 'supported' | 'experimental';
type FilterCategory = 'all' | Category;

interface CatalogViewProps {
  mode: ViewMode;
  user: UserContext;
  onViewDetail: (id: string) => void;
}

const FILTER_LABELS: { value: FilterCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Widget', label: 'Widgets' },
  { value: 'Plugin', label: 'Plugins' },
  { value: 'Integration', label: 'Integrations' },
];

export default function CatalogView({ mode, user, onViewDetail }: CatalogViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');

  const supported = SOLUTIONS.filter((s) => s.tier === 'Supported');
  const experimental = SOLUTIONS.filter((s) => s.tier === 'Experimental');

  function applyFilter(solutions: Solution[]): Solution[] {
    if (categoryFilter === 'all') return solutions;
    return solutions.filter((s) => s.category === categoryFilter);
  }

  function handleAddToInstance(solution: Solution) {
    const url = buildZendeskUrl(solution.title, user);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const heroTitles: Record<ViewMode, { label: string; title: string; subtitle: string }> = {
    all: {
      label: 'STAFFBASE LABS',
      title: 'Custom Solutions for Your Staffbase Platform',
      subtitle: 'Explore production-ready widgets, plugins, and integrations built by the Staffbase Customer Care team — plus community-built experimental tools.',
    },
    supported: {
      label: 'FULLY SUPPORTED',
      title: 'Supported Solutions',
      subtitle: 'Developed, tested, and maintained by the Staffbase Customer Care team. Each solution is backed by recurring maintenance and available for PSP / PSP+ customers.',
    },
    experimental: {
      label: 'EXPERIMENTAL',
      title: 'Community & Open Source',
      subtitle: 'Community-built and open source integrations. Not officially supported by Staffbase — use as starting points for your own custom builds.',
    },
  };

  const hero = heroTitles[mode];

  return (
    <div>
      {/* Hero */}
      <section className="catalog-hero">
        <div className="container">
          <span className="catalog-hero__label">{hero.label}</span>
          <h1 className="catalog-hero__title">{hero.title}</h1>
          <p className="catalog-hero__subtitle">{hero.subtitle}</p>
        </div>
      </section>

      <div className="catalog-body">
        <div className="container">

          {/* Supported section */}
          {(mode === 'all' || mode === 'supported') && (
            <section style={{ marginBottom: mode === 'all' ? 'var(--space-12)' : 0 }}>
              {mode === 'all' && (
                <div className="section-header">
                  <span className="section-label section-label--supported">FULLY SUPPORTED</span>
                  <h2 className="section-title">Built and maintained by Staffbase</h2>
                  <p className="section-body">
                    These custom solutions are developed, tested, and maintained by the Staffbase Customer Care team.
                    Available for PSP / PSP+ customers with recurring maintenance included.
                  </p>
                </div>
              )}

              <div className="filter-tabs">
                {FILTER_LABELS.map((f) => (
                  <button
                    key={f.value}
                    className={`filter-tab${categoryFilter === f.value ? ' filter-tab--active' : ''}`}
                    onClick={() => setCategoryFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="card-grid">
                {applyFilter(supported).map((s) => (
                  <SolutionCard
                    key={s.id}
                    solution={s}
                    onClick={() => onViewDetail(s.id)}
                    onAddToInstance={() => handleAddToInstance(s)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section divider */}
          {mode === 'all' && <div className="section-separator" />}

          {/* Experimental section */}
          {(mode === 'all' || mode === 'experimental') && (
            <section>
              {mode === 'all' && (
                <div className="section-header">
                  <span className="section-label section-label--experimental">EXPERIMENTAL</span>
                  <h2 className="section-title">Community &amp; Open Source</h2>
                  <p className="section-body">
                    These integrations are community-built, open source, and not officially supported by Staffbase.
                    Use them as starting points for your own custom builds.
                  </p>
                </div>
              )}

              <div className="card-grid">
                {experimental.map((s) => (
                  <SolutionCard
                    key={s.id}
                    solution={s}
                    onClick={() => onViewDetail(s.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* CTA strip */}
          <div style={{ marginTop: 'var(--space-12)' }}>
            <div className="cta-strip" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)' }}>
              <h2 className="cta-strip__title">Need something that doesn't exist yet?</h2>
              <p className="cta-strip__text">
                Our team can build custom integrations tailored to your organization's unique needs.
              </p>
              <div className="cta-strip__buttons">
                <a
                  href="mailto:custombuilds@staffbase.com"
                  className="btn btn--white btn--lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Request a Custom Build
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
