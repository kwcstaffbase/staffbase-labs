import { useEffect, useState } from 'react';
import { Solution } from '../data/catalog';
import { WIDGET_BUNDLES } from '../data/bundles';
import { UserContext } from '../utils/jwt';
import { installWidget, fetchInstalledWidgets, isWidgetInstalled, InstallState } from '../utils/api';
import Icon from './Icon';

interface DetailViewProps {
  solution: Solution;
  user: UserContext;
  onBack: () => void;
}

const CATEGORY_CLASS: Record<string, string> = {
  Widget: 'badge--widget',
  Plugin: 'badge--plugin',
  Integration: 'badge--integration',
};

export default function DetailView({ solution, user, onBack }: DetailViewProps) {
  const isExperimental = solution.tier === 'Experimental';
  const bundle = WIDGET_BUNDLES[solution.id];

  const [installState, setInstallState] = useState<InstallState>('idle');
  const [installError, setInstallError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [alreadyInstalled, setAlreadyInstalled] = useState(false);

  // On open, check whether this widget is already registered on the instance.
  // Fails open: if the check can't complete, the install button stays usable.
  useEffect(() => {
    if (!bundle || isExperimental) return;
    let cancelled = false;
    setChecking(true);
    fetchInstalledWidgets(user.instanceOrigin).then((lookup) => {
      if (cancelled) return;
      if (lookup.ok) {
        setAlreadyInstalled(isWidgetInstalled(lookup, bundle.bundleUrl, bundle.elementName));
      }
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, [bundle, isExperimental, user.instanceOrigin]);

  async function handleInstall() {
    if (!bundle || installState === 'loading' || alreadyInstalled || checking) return;
    setInstallState('loading');
    setInstallError(null);
    const result = await installWidget(user.instanceOrigin, bundle.bundleUrl, bundle.elementName);
    if (result.success) {
      setInstallState('success');
      setAlreadyInstalled(true);
      setTimeout(() => setInstallState('idle'), 4000);
    } else {
      setInstallError(result.error ?? 'Unknown error');
      setInstallState('error');
      setTimeout(() => { setInstallState('idle'); setInstallError(null); }, 8000);
    }
  }

  function renderHeroInstallButton() {
    if (!bundle) return null;
    if (checking) {
      return (
        <button className="btn btn--primary btn--lg" disabled>
          <span className="btn-spinner" />
          Checking…
        </button>
      );
    }
    if (installState === 'loading') {
      return (
        <button className="btn btn--primary btn--lg" disabled>
          <span className="btn-spinner" />
          Installing…
        </button>
      );
    }
    if (installState === 'success') {
      return (
        <button className="btn btn--success btn--lg" disabled>
          <Icon name="check-circle" size={18} />
          Added to Instance!
        </button>
      );
    }
    if (alreadyInstalled) {
      return (
        <button className="btn btn--success btn--lg" disabled>
          <Icon name="check-circle" size={18} />
          Already Installed
        </button>
      );
    }
    return (
      <button className="btn btn--primary btn--lg" onClick={handleInstall}>
        Add to Instance
      </button>
    );
  }

  return (
    <div className="detail-layout">

      {/* Experimental disclaimer */}
      {isExperimental && (
        <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
          <div className="disclaimer-banner">
            <Icon name="triangle-alert" size={18} />
            <span>
              This is an experimental integration. It is not maintained or supported by Staffbase.
              Community-built and provided "as is."
            </span>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="detail-hero">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <button className="breadcrumb__link" onClick={onBack}>Hub</button>
            <span className="breadcrumb__sep">/</span>
            <button
              className="breadcrumb__link"
              onClick={onBack}
            >
              {isExperimental ? 'Experimental' : 'Supported Solutions'}
            </button>
            <span className="breadcrumb__sep">/</span>
            <span className="breadcrumb__current">{solution.title}</span>
          </nav>

          <div className="detail-hero__inner">
            <div>
              <div className="detail-hero__badges">
                <span className={`badge ${isExperimental ? 'badge--experimental' : 'badge--supported'}`}>
                  {solution.tier}
                </span>
                <span className={`badge ${CATEGORY_CLASS[solution.category] ?? 'badge--widget'}`}>
                  {solution.category}
                </span>
                {!isExperimental && (
                  <span className="badge badge--psp">PSP / PSP+</span>
                )}
                {isExperimental && (
                  <span className="badge badge--open-source">Open Source</span>
                )}
              </div>

              <h1 className="detail-hero__title">{solution.title}</h1>
              <p className="detail-hero__desc">{solution.short_description}</p>

              <div className="detail-hero__buttons">
                {isExperimental ? (
                  <a
                    href={solution.github_url ?? '#'}
                    className="btn btn--github btn--lg"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="github" size={18} />
                    View on GitHub
                  </a>
                ) : (
                  renderHeroInstallButton()
                )}
                {solution.has_live_demo && (
                  <a
                    href={solution.live_demo_url}
                    className="btn btn--ghost btn--lg"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    <Icon name="external-link" size={16} />
                    View Live Demo
                  </a>
                )}
              </div>
              {installState === 'error' && installError && (
                <div className="detail-install-error">
                  <Icon name="triangle-alert" size={14} />
                  {installError}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-bar" />

      {/* Info strip — supported only */}
      {!isExperimental && (
        <div className="info-strip">
          <div className="container">
            <div className="info-strip__grid">
              <div className="info-item">
                <Icon name="shield-check" size={18} className="info-item__icon" />
                <span>Maintained by Staffbase CC</span>
              </div>
              <div className="info-item">
                <Icon name="lock" size={18} className="info-item__icon" />
                <span>PSP / PSP+ Required</span>
              </div>
              <div className="info-item">
                <Icon name="refresh-cw" size={18} className="info-item__icon" />
                <span>Recurring maintenance included</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      <section className="content-section content-section--white">
        <div className="container">
          <h2 className="content-section__title">Overview</h2>
          <div className="prose">
            {solution.overview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      {solution.use_cases.length > 0 && (
        <section className="content-section content-section--gray">
          <div className="container">
            <h2 className="content-section__title">Use Cases</h2>
            <div className="usecase-grid">
              {solution.use_cases.map((uc) => (
                <div key={uc.title} className="usecase-card">
                  <div className="usecase-card__icon">
                    <Icon name={uc.icon} size={18} />
                  </div>
                  <h3 className="usecase-card__title">{uc.title}</h3>
                  <p className="usecase-card__desc">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Screenshots */}
      {solution.screenshots.length > 0 && (
        <section className="content-section content-section--white">
          <div className="container">
            <h2 className="content-section__title">See it in action</h2>
            <div className="gallery">
              {solution.screenshots.map((sc) => (
                <div key={sc.label} className="gallery__item">
                  <div className="gallery__placeholder" aria-label={sc.alt}>
                    {sc.label}
                  </div>
                  <div className="gallery__label">{sc.label}</div>
                </div>
              ))}
            </div>
            {solution.has_live_demo && (
              <a
                href={solution.live_demo_url}
                className="btn btn--ghost"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="external-link" size={14} />
                View Live Demo
              </a>
            )}
          </div>
        </section>
      )}

      {/* Configuration */}
      {solution.config_options.length > 0 && (
        <section className="content-section content-section--gray">
          <div className="container">
            <h2 className="content-section__title">Key Settings</h2>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
              <table className="config-table">
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Setting</th>
                    <th style={{ width: '10%' }}>Type</th>
                    <th>Description</th>
                    <th style={{ width: '18%' }}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {solution.config_options.map((opt) => (
                    <tr key={opt.label}>
                      <td>
                        <span className="config-table__label">{opt.label}</span>
                        {opt.required && (
                          <span className="config-required" style={{ marginLeft: '6px' }}>required</span>
                        )}
                      </td>
                      <td>
                        <span className="config-type">{opt.type}</span>
                      </td>
                      <td className="config-table__desc">{opt.description}</td>
                      <td>
                        {opt.example && (
                          <code className="config-table__example">{opt.example}</code>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Prerequisites / Getting Started */}
      {solution.prerequisites.length > 0 && (
        <section className="content-section content-section--white">
          <div className="container">
            <h2 className="content-section__title">
              {isExperimental ? 'Getting Started' : 'Prerequisites'}
            </h2>
            <div className="prereq-list">
              {solution.prerequisites.map((p, i) => (
                <div key={i} className="prereq-item">
                  <div className="prereq-item__number">{i + 1}</div>
                  <div>
                    <div className="prereq-item__title">{p.title}</div>
                    <p className="prereq-item__desc">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {isExperimental && (
              <div className="notice-box" style={{ marginTop: 'var(--space-6)' }}>
                <Icon name="info" size={18} />
                <span>
                  Staffbase Customer Care cannot provide implementation support for experimental integrations.
                  Community contributions are welcome via the GitHub repository.
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="cta-strip">
        <div className="container">
          {isExperimental ? (
            <>
              <h2 className="cta-strip__title">Want to contribute or report a bug?</h2>
              <p className="cta-strip__text">
                This project is open source and community-maintained. Issues, pull requests, and feedback are all welcome on GitHub.
              </p>
              <div className="cta-strip__buttons">
                <a
                  href={solution.github_url ?? '#'}
                  className="btn btn--white btn--lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="github" size={18} />
                  View on GitHub
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="cta-strip__title">Ready to add this to your platform?</h2>
              <p className="cta-strip__text">
                Get the {solution.title} running on your Staffbase instance today.
              </p>
              <div className="cta-strip__buttons">
                {bundle && (
                  <button
                    className={`btn btn--lg ${(installState === 'success' || alreadyInstalled) ? 'btn--success' : 'btn--white'}`}
                    onClick={handleInstall}
                    disabled={checking || alreadyInstalled || installState === 'loading' || installState === 'success'}
                  >
                    {checking && <span className="btn-spinner btn-spinner--dark" />}
                    {installState === 'loading' && <span className="btn-spinner btn-spinner--dark" />}
                    {(installState === 'success' || alreadyInstalled) && <Icon name="check-circle" size={18} />}
                    {checking
                      ? 'Checking…'
                      : installState === 'loading'
                        ? 'Installing…'
                        : installState === 'success'
                          ? 'Added to Instance!'
                          : alreadyInstalled
                            ? 'Already Installed'
                            : 'Add to Instance'}
                  </button>
                )}
                <a
                  href="mailto:support@staffbase.com"
                  className="btn btn--white-outline btn--lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact Customer Care
                </a>
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
