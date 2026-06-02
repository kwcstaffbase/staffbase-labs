const EXPERIMENTAL_URL = 'https://staffbase.github.io/solutions-monorepo/';

export default function ExperimentalView() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 57px)' }}>
      <iframe
        src={EXPERIMENTAL_URL}
        title="Experimental Solutions"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        allow="fullscreen"
      />
    </div>
  );
}
