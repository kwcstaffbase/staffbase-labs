type View = 'all' | 'supported' | 'experimental';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

export default function Header({ activeView, onNavigate }: HeaderProps) {
  return (
    <>
      <header className="plugin-header">
        <div className="container">
          <div className="plugin-header__inner">
            <button
              className="plugin-header__logo"
              onClick={() => onNavigate('all')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span className="plugin-header__logo-dot" />
              Staffbase Labs
            </button>

            <nav className="plugin-header__nav">
              <button
                className={`plugin-header__nav-link${activeView === 'all' ? ' plugin-header__nav-link--active' : ''}`}
                onClick={() => onNavigate('all')}
              >
                Browse All
              </button>
              <button
                className={`plugin-header__nav-link${activeView === 'supported' ? ' plugin-header__nav-link--active' : ''}`}
                onClick={() => onNavigate('supported')}
              >
                Supported
              </button>
              <button
                className={`plugin-header__nav-link${activeView === 'experimental' ? ' plugin-header__nav-link--active' : ''}`}
                onClick={() => onNavigate('experimental')}
              >
                Experimental
              </button>
            </nav>

            <a
              href="mailto:custombuilds@staffbase.com"
              className="plugin-header__cta"
              target="_blank"
              rel="noreferrer"
            >
              Request a Custom Build
            </a>
          </div>
        </div>
      </header>
      <div className="gradient-bar" />
    </>
  );
}
