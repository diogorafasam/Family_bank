import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          fontFamily: 'monospace',
          background: '#fff5f5',
          color: '#c0392b',
          minHeight: '100vh',
          fontSize: 13,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          <h1 style={{ fontSize: 18, marginBottom: 16 }}>⚠️ Erro na aplicação</h1>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>
            {this.state.error?.toString()}
          </div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>
            {this.state.error?.stack}
          </div>
          {this.state.info && (
            <div style={{ marginTop: 16, fontSize: 11, opacity: 0.7 }}>
              {this.state.info.componentStack}
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (root && !root.hasChildNodes()) {
    root.innerHTML =
      '<div style="padding:24px;font-family:monospace;background:#fff5f5;color:#c0392b;min-height:100vh;font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">' +
      '<h1 style="font-size:18px;margin-bottom:16px;">⚠️ Erro ao carregar (top-level)</h1>' +
      '<div style="font-weight:700;margin-bottom:12px;">' + e.message + '</div>' +
      '<div style="font-size:11px;opacity:0.8;">' + e.filename + ':' + e.lineno + ':' + e.colno + '</div>' +
      '<div style="font-size:11px;opacity:0.7;margin-top:12px;">' + (e.error && e.error.stack ? e.error.stack : '') + '</div>' +
      '</div>';
  }
});

window.addEventListener('unhandledrejection', (e) => {
  const root = document.getElementById('root');
  if (root && !root.hasChildNodes()) {
    root.innerHTML =
      '<div style="padding:24px;font-family:monospace;background:#fff5f5;color:#c0392b;min-height:100vh;font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">' +
      '<h1 style="font-size:18px;margin-bottom:16px;">⚠️ Erro de Promise não tratado</h1>' +
      '<div style="font-weight:700;margin-bottom:12px;">' + (e.reason && e.reason.message ? e.reason.message : e.reason) + '</div>' +
      '<div style="font-size:11px;opacity:0.7;margin-top:12px;">' + (e.reason && e.reason.stack ? e.reason.stack : '') + '</div>' +
      '</div>';
  }
});

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  document.getElementById('root').innerHTML =
    '<div style="padding:24px;font-family:monospace;background:#fff5f5;color:#c0392b;min-height:100vh;font-size:13px;">' +
    '<h1>⚠️ Erro fatal ao iniciar</h1>' +
    '<div>' + e.message + '</div>' +
    '<div style="font-size:11px;opacity:0.7;margin-top:12px;">' + e.stack + '</div>' +
    '</div>';
}
