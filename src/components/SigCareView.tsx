import { useMemo, useState } from 'react';
import { CARE_PLAN_DATA } from '../data/sigCare';
import {
  aggregateSigCareRows,
  availableYears,
  getSigCareStats,
  getTaskDetail,
  type CapacityTotals,
  type SigCareRow,
  type SigCareTaskDetail,
} from '../lib/sigCare';

type PackageFilter = 'all' | 'sc' | 'psp';
type SortKey = 'name' | 'pct' | 'remaining';

const data = CARE_PLAN_DATA;

// ── small presentational helpers ────────────────────────────────────────────

function usageLevel(pct: number): 'high' | 'mid' | 'low' {
  return pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeCsv(v: string | number | null): string {
  if (v == null) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function KpiCard({ label, value, accent }: { label: string; value: number; accent: 'blue' | 'purple' }) {
  return (
    <div className={`sc-kpi sc-kpi--${accent}`}>
      <span className="sc-kpi__value">{value}</span>
      <span className="sc-kpi__label">{label}</span>
      <span className="sc-kpi__sub">customers</span>
    </div>
  );
}

function CapacityCard({ label, totals, accent }: { label: string; totals: CapacityTotals; accent: 'purple' | 'blue' }) {
  const { allotted, used, committed, available, pctUsed } = totals;
  const level = usageLevel(pctUsed);
  const usedPct = Math.min(pctUsed, 100);
  const committedPct =
    allotted > 0 ? Math.min(Math.max(0, 100 - usedPct), (committed / allotted) * 100) : 0;
  return (
    <div className={`sc-cap sc-cap--${accent}`}>
      <div className="sc-cap__head">
        <span className="sc-cap__label">{label}</span>
        <span className="sc-cap__pct">{pctUsed}% used</span>
      </div>
      <div className="sc-cap__figure">
        <span className="sc-cap__used">{used}</span>
        <span className="sc-cap__allotted">/ {allotted}h purchased</span>
      </div>
      <div className="sc-cap__track">
        <span className={`sc-cap__bar sc-cap__bar--${accent} sc-cap__bar--${level}`} style={{ width: `${usedPct}%` }} />
        {committedPct > 0 && <span className="sc-cap__bar sc-cap__bar--committed" style={{ width: `${committedPct}%` }} />}
      </div>
      <div className="sc-cap__foot">
        <span className={available < 0 ? 'sc-neg' : 'sc-muted'}>
          {available >= 0 ? `${available}h available` : `${Math.abs(available)}h over`}
        </span>
        {committed > 0 && <span className="sc-warn">+{committed}h committed</span>}
      </div>
    </div>
  );
}

function PackageBadges({ row }: { row: SigCareRow }) {
  return (
    <div className="sc-badges">
      {row.scAllotted > 0 && (
        <span className="sc-badge sc-badge--sc">
          SC{row.scProductName ? ` ${row.scProductName.replace(/^Signature Care\s*/i, '')}` : ''}
        </span>
      )}
      {row.pspPackage && <span className="sc-badge sc-badge--psp">{row.pspPackage}</span>}
    </div>
  );
}

function HoursCell({ used, allotted, committed, available }: { used: number; allotted: number; committed: number; available: number }) {
  if (!allotted) return <span className="sc-dash">—</span>;
  return (
    <div className="sc-hours">
      <div>
        <span className="sc-hours__used">{used}h</span>
        <span className="sc-muted"> / {allotted}h</span>
        <span className={available < 0 ? 'sc-neg' : 'sc-muted'}>
          {' '}({available >= 0 ? available : Math.abs(available)}h {available >= 0 ? 'left' : 'over'})
        </span>
      </div>
      {committed > 0 && <div className="sc-hours__committed">+{committed}h committed</div>}
    </div>
  );
}

function UsageBar({ pct }: { pct: number }) {
  return (
    <div className="sc-usage">
      <span className="sc-usage__track">
        <span className={`sc-usage__bar sc-usage__bar--${usageLevel(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </span>
      <span className="sc-usage__pct">{pct}%</span>
    </div>
  );
}

function Summary({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'ok' | 'danger' | 'warn' }) {
  return (
    <div className="sc-summary">
      <span className="sc-summary__label">{label}</span>
      <span className={`sc-summary__value sc-summary__value--${tone}`}>{value}</span>
    </div>
  );
}

function TaskRow({ t }: { t: SigCareTaskDetail }) {
  return (
    <div className="sc-task">
      <div className="sc-task__main">
        <p className="sc-task__name">{t.taskName}</p>
        <p className="sc-task__meta">
          {t.engagementType} · {formatDate(t.closedAt)} · <span className="sc-cap-text">{t.status.replace('_', ' ')}</span>
        </p>
      </div>
      <span className="sc-task__hours">{t.hours}h</span>
    </div>
  );
}

function DetailPanel({ row, tasks, onClose }: { row: SigCareRow; tasks: SigCareTaskDetail[]; onClose: () => void }) {
  const drawn = tasks.filter((t) => t.bucket === 'drawn');
  const committed = tasks.filter((t) => t.bucket === 'committed');
  const drawnTotal = Math.round(drawn.reduce((s, t) => s + t.hours, 0) * 10) / 10;
  const committedTotal = Math.round(committed.reduce((s, t) => s + t.hours, 0) * 10) / 10;
  return (
    <div className="sc-drawer" onClick={onClose}>
      <div className="sc-drawer__scrim" />
      <div className="sc-drawer__panel" onClick={(e) => e.stopPropagation()}>
        <div className="sc-drawer__head">
          <div>
            <h3 className="sc-drawer__title">{row.accountName}</h3>
            <div className="sc-drawer__subtitle">
              <PackageBadges row={row} />
              <span className="sc-muted">Task Detail</span>
            </div>
          </div>
          <button className="sc-drawer__close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="sc-drawer__summary">
          <Summary label="Allotted" value={`${row.totalAllotted}h`} />
          <Summary label="Used" value={`${row.totalUsed}h`} />
          <Summary label="Committed" value={`${row.totalCommitted}h`} tone="warn" />
          <Summary label="Available" value={`${row.totalAvailable}h`} tone={row.totalAvailable < 0 ? 'danger' : 'ok'} />
        </div>

        <div className="sc-drawer__body">
          {drawn.length === 0 && committed.length === 0 ? (
            <div className="sc-drawer__empty">
              <p>No task detail in this year.</p>
              <p className="sc-muted">Unscoped time entries (no task) still count toward Used totals.</p>
            </div>
          ) : (
            <>
              {drawn.length > 0 && (
                <section className="sc-drawer__section">
                  <div className="sc-drawer__section-head">
                    <span className="sc-drawer__section-label">Drawn · {drawn.length} task{drawn.length !== 1 ? 's' : ''}</span>
                    <span className="sc-muted">{drawnTotal}h</span>
                  </div>
                  {drawn.map((t) => <TaskRow key={t.taskId} t={t} />)}
                </section>
              )}
              {committed.length > 0 && (
                <section className="sc-drawer__section">
                  <div className="sc-drawer__section-head">
                    <span className="sc-drawer__section-label sc-warn">Committed · {committed.length} task{committed.length !== 1 ? 's' : ''}</span>
                    <span className="sc-warn">{committedTotal}h</span>
                  </div>
                  {committed.map((t) => <TaskRow key={t.taskId} t={t} />)}
                  <p className="sc-drawer__note">
                    Committed work is in-flight — its hours aren&apos;t deducted yet, but they reduce Available capacity.
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── main view ────────────────────────────────────────────────────────────────

export default function SigCareView() {
  const years = useMemo(() => availableYears(data), []);
  const [selectedYear, setSelectedYear] = useState<number>(() => years[0] ?? new Date().getFullYear());
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [search, setSearch] = useState('');
  const [csmFilter, setCsmFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [territoryFilter, setTerritoryFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState<PackageFilter>('all');
  const [selected, setSelected] = useState<SigCareRow | null>(null);

  const stats = useMemo(() => getSigCareStats(data, selectedYear), [selectedYear]);

  const csmOptions = useMemo(() => {
    const s = new Set<string>();
    for (const r of stats.rows) if (r.csmName) s.add(r.csmName);
    return Array.from(s).sort();
  }, [stats.rows]);

  const tierOptions = useMemo(() => {
    const s = new Set<string>();
    for (const r of stats.rows) if (r.touchModelTier) s.add(r.touchModelTier);
    return Array.from(s).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [stats.rows]);

  const territoryOptions = useMemo(() => {
    const s = new Set<string>();
    for (const r of stats.rows) if (r.territory) s.add(r.territory);
    return Array.from(s).sort();
  }, [stats.rows]);

  const filteredRows = useMemo(() => {
    let rows = stats.rows;
    const q = search.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.accountName.toLowerCase().includes(q));
    if (csmFilter !== 'all') rows = rows.filter((r) => r.csmName === csmFilter);
    if (tierFilter !== 'all') rows = rows.filter((r) => (r.touchModelTier ?? '') === tierFilter);
    if (territoryFilter !== 'all') rows = rows.filter((r) => (r.territory ?? '') === territoryFilter);
    if (packageFilter === 'sc') rows = rows.filter((r) => r.scAllotted > 0);
    else if (packageFilter === 'psp') rows = rows.filter((r) => r.pspPackage === 'PSP' || r.pspPackage === 'PSP+');
    return rows;
  }, [stats.rows, search, csmFilter, tierFilter, territoryFilter, packageFilter]);

  const view = useMemo(() => aggregateSigCareRows(filteredRows), [filteredRows]);

  const sortedRows = useMemo(() => {
    const rows = filteredRows;
    if (sortBy === 'pct') return [...rows].sort((a, b) => b.pctUsed - a.pctUsed);
    if (sortBy === 'remaining') return [...rows].sort((a, b) => a.totalAvailable - b.totalAvailable);
    return [...rows].sort((a, b) => a.accountName.localeCompare(b.accountName));
  }, [filteredRows, sortBy]);

  const drawerTasks = useMemo(
    () => (selected ? getTaskDetail(data, selected, selectedYear, 'all') : []),
    [selected, selectedYear],
  );

  function handleExport() {
    const header = [
      'Account', 'CSM', 'Touch Model Tier', 'Territory', 'Sig Care Tier',
      'SC Allotted (h)', 'SC Used (h)', 'SC Committed (h)', 'SC Available (h)',
      'PSP Package', 'PSP Allotted (h)', 'PSP Used (h)', 'PSP Committed (h)', 'PSP Available (h)',
      'Total Allotted (h)', 'Total Used (h)', 'Total Committed (h)', 'Total Available (h)', '% Used', 'Year',
    ];
    const rows = sortedRows.map((r) => [
      r.accountName, r.csmName, r.touchModelTier, r.territory, r.scProductName,
      r.scAllotted, r.scUsed, r.scCommitted, r.scAvailable,
      r.pspPackage, r.pspAllotted, r.pspUsed, r.pspCommitted, r.pspAvailable,
      r.totalAllotted, r.totalUsed, r.totalCommitted, r.totalAvailable, r.pctUsed, selectedYear,
    ]);
    const scope = packageFilter === 'sc' ? 'sig-care' : packageFilter === 'psp' ? 'psp' : 'all';
    const body = [header, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sig-care-psp-${scope}-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasData = stats.totalCustomers > 0;

  return (
    <div className="sc-page">
      <div className="container">
        <div className="sc-hero">
          <p className="sc-hero__label">Reporting · Signature Care</p>
          <h1 className="sc-hero__title">Care-Plan Hours Tracker</h1>
          <p className="sc-hero__subtitle">
            Contract burn across active Signature Care, PSP, and PSP+ engagements.
          </p>
        </div>

        {!hasData ? (
          <div className="sc-empty">No active Signature Care or PSP engagements.</div>
        ) : (
          <>
            <div className="sc-kpis">
              <KpiCard label="Total Enrolled" value={view.totalCustomers} accent="blue" />
              <KpiCard label="Signature Care" value={view.scCount} accent="purple" />
              <KpiCard label="PSP" value={view.pspCount} accent="blue" />
              <KpiCard label="PSP+" value={view.pspPlusCount} accent="blue" />
              <KpiCard label="Both Packages" value={view.bothCount} accent="purple" />
            </div>

            <div className="sc-section">
              <div className="sc-section__head">
                <h3>Capacity Overview</h3>
                <span className="sc-muted">{selectedYear}</span>
              </div>
              <div className="sc-caps">
                <CapacityCard label="Signature Care (all tiers)" totals={view.totals.sigCare} accent="purple" />
                <CapacityCard label="PSP" totals={view.totals.psp} accent="blue" />
                <CapacityCard label="PSP+" totals={view.totals.pspPlus} accent="blue" />
              </div>
            </div>

            <div className="sc-card">
              <div className="sc-toolbar">
                <div className="sc-toolbar__left">
                  <div>
                    <h3 className="sc-toolbar__title">Customer Hours Tracker</h3>
                    <p className="sc-muted">Click a customer to view task-level detail</p>
                  </div>
                  <div className="sc-yeartoggle">
                    {years.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        className={`sc-yeartoggle__btn${selectedYear === yr ? ' is-active' : ''}`}
                        onClick={() => setSelectedYear(yr)}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sc-toolbar__right">
                  <input
                    type="text"
                    className="sc-input"
                    placeholder="Search accounts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select className="sc-select" value={packageFilter} onChange={(e) => setPackageFilter(e.target.value as PackageFilter)}>
                    <option value="all">All packages</option>
                    <option value="sc">Sig Care only</option>
                    <option value="psp">PSP / PSP+ only</option>
                  </select>
                  {csmOptions.length > 0 && (
                    <select className="sc-select" value={csmFilter} onChange={(e) => setCsmFilter(e.target.value)}>
                      <option value="all">All CSMs</option>
                      {csmOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  )}
                  {tierOptions.length > 0 && (
                    <select className="sc-select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} title="Touch Model Tier">
                      <option value="all">All Tiers</option>
                      {tierOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                  {territoryOptions.length > 0 && (
                    <select className="sc-select" value={territoryFilter} onChange={(e) => setTerritoryFilter(e.target.value)}>
                      <option value="all">All Territories</option>
                      {territoryOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                  <select className="sc-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
                    <option value="name">Account Name</option>
                    <option value="pct">% Used</option>
                    <option value="remaining">Hours Remaining</option>
                  </select>
                  <button type="button" className="sc-export" onClick={handleExport} disabled={sortedRows.length === 0}>
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="sc-table-wrap">
                <table className="sc-table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>CSM</th>
                      <th>Packages</th>
                      <th>Sig Care Hours</th>
                      <th>PSP Hours</th>
                      <th className="sc-table__usage-col">Overall Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((r) => (
                      <tr key={r.accountId}>
                        <td>
                          <button type="button" className="sc-account" onClick={() => setSelected(r)}>{r.accountName}</button>
                        </td>
                        <td className="sc-muted">{r.csmName ?? <span className="sc-dash">—</span>}</td>
                        <td><PackageBadges row={r} /></td>
                        <td><HoursCell used={r.scUsed} allotted={r.scAllotted} committed={r.scCommitted} available={r.scAvailable} /></td>
                        <td><HoursCell used={r.pspUsed} allotted={r.pspAllotted} committed={r.pspCommitted} available={r.pspAvailable} /></td>
                        <td><UsageBar pct={r.pctUsed} /></td>
                      </tr>
                    ))}
                    {sortedRows.length === 0 && (
                      <tr><td colSpan={6} className="sc-table__empty">No accounts match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {selected && <DetailPanel row={selected} tasks={drawerTasks} onClose={() => setSelected(null)} />}
    </div>
  );
}
