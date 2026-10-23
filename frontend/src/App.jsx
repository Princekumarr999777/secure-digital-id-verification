import { useRef, useState } from 'react';
import { Activity, ArrowDownToLine, BadgeCheck, Check, ChevronDown, CircleHelp, Clock3, Fingerprint, IdCard, LockKeyhole, QrCode, ScanLine, ShieldCheck, ShieldX, UploadCloud, UserRound, UsersRound } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function App() {
  const [tab, setTab] = useState('issue');
  const [form, setForm] = useState({ holderName: '', dateOfBirth: '', role: 'Student' });
  const [issued, setIssued] = useState(null);
  const [token, setToken] = useState('');
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef(null);

  async function issueCredential(event) {
    event.preventDefault(); setLoading(true); setError(''); setIssued(null);
    try {
      const response = await fetch(`${API}/api/v1/credentials/issue`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not issue credential.');
      setIssued(data);
    } catch (e) { setError(e.message || 'Unable to reach the API. Check that the backend is running.'); }
    finally { setLoading(false); }
  }

  async function verifyCredential(event) {
    event.preventDefault(); setLoading(true); setError(''); setVerification(null);
    try {
      const response = await fetch(`${API}/api/v1/credentials/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token.trim() }),
      });
      const data = await response.json(); setVerification(data);
    } catch { setError('Unable to reach the API. Check that the backend is running.'); }
    finally { setLoading(false); }
  }

  async function readFile(file) {
    if (!file) return;
    setFileName(file.name); setVerification(null); setError('');
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) setToken((await file.text()).trim());
    else setError('This demo accepts a text file containing the scanned token. QR image decoding can be added to a camera workflow.');
  }

  const valid = verification?.valid;
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#home"><span className="brand-mark"><Fingerprint size={22} /></span><span>verity<span className="brand-dot">.</span><small>IDENTITY PLATFORM</small></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch"><span className="workspace-icon">N</span><span>Northstar University<small>Education · 2,408 IDs</small></span><ChevronDown size={15} /></button>
      <div className="nav-label">MANAGE</div>
      <button className="nav-item"><Activity size={17} /> Overview</button>
      <button className="nav-item active"><IdCard size={17} /> Credentials <span className="nav-count">2</span></button>
      <button className="nav-item"><UsersRound size={17} /> Holders</button>
      <button className="nav-item"><ScanLine size={17} /> Verification logs</button>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><p>Visit the docs to learn more about Verity.</p><a href="https://github.com" target="_blank" rel="noreferrer">Explore documentation ↗</a></div><div className="profile"><div className="avatar">PK</div><div><strong>Prince Kumar</strong><small>Administrator</small></div><ChevronDown size={15} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <strong>Credentials</strong></div><div className="top-actions"><span className="secure-indicator"><span /> All systems secure</span><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><div className="avatar mini">PK</div></div></header>
      <div className="page-wrap">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-icon"><ShieldCheck size={14} /></span> IDENTITY MANAGEMENT</div><h1>Credentials</h1><p>Issue and verify trusted digital identities across your organization.</p></div><button className="outline-button" onClick={() => setTab('verify')}><ScanLine size={16} /> Verify a credential</button></div>
        <section className="stats-grid">
          <article className="stat-card"><div className="stat-label">TOTAL ISSUED <span className="stat-icon blue"><IdCard size={17} /></span></div><div className="stat-value">2,408</div><div className="stat-foot"><span className="trend">↗ 12.8%</span> <span>vs. last month</span></div><div className="sparkline blue-line"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
          <article className="stat-card"><div className="stat-label">ACTIVE CREDENTIALS <span className="stat-icon green"><BadgeCheck size={17} /></span></div><div className="stat-value">2,391</div><div className="stat-foot"><span className="muted-dot"/>99.3% of total issued</div><div className="sparkline green-line"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
          <article className="stat-card"><div className="stat-label">VERIFICATIONS TODAY <span className="stat-icon violet"><ScanLine size={17} /></span></div><div className="stat-value">184</div><div className="stat-foot"><span className="trend">↗ 8.2%</span> <span>vs. yesterday</span></div><div className="sparkline violet-line"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
        </section>
        <div className="section-title"><div><h2>Credential tools</h2><p>Manage the lifecycle of your digital IDs.</p></div><div className="updated"><span/> LIVE DATA</div></div>
        <div className="tool-layout">
          <section className="panel work-panel">
            <div className="tabs"><button className={tab === 'issue' ? 'tab selected' : 'tab'} onClick={() => { setTab('issue'); setError(''); }}><span className="tab-icon"><IdCard size={15} /></span> Issue credential</button><button className={tab === 'verify' ? 'tab selected' : 'tab'} onClick={() => { setTab('verify'); setError(''); }}><span className="tab-icon"><ScanLine size={15} /></span> Verify identity</button></div>
            {tab === 'issue' ? <div className="panel-body"><div className="panel-intro"><div className="intro-icon mint"><IdCard size={18} /></div><div><h3>Issue a new credential</h3><p>Create a secure, verifiable digital ID for a holder.</p></div></div><form onSubmit={issueCredential} className="credential-form"><label>Full name <span>REQUIRED</span><div className="input-wrap"><UserRound size={16}/><input required maxLength="160" placeholder="e.g. Alex Morgan" value={form.holderName} onChange={e => setForm({ ...form, holderName: e.target.value })}/></div></label><div className="form-row"><label>Date of birth <span>REQUIRED</span><div className="input-wrap"><Clock3 size={16}/><input required type="date" max={new Date().toISOString().slice(0, 10)} value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}/></div></label><label>Role <span>REQUIRED</span><div className="input-wrap select-wrap"><UsersRound size={16}/><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Student</option><option>Faculty</option><option>Staff</option><option>Visitor</option><option>Administrator</option></select><ChevronDown size={15}/></div></label></div><div className="security-note"><LockKeyhole size={16}/><span><strong>Privacy by design</strong> — Personal details are protected and never stored in the QR code.</span></div>{error && <p className="error-text">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Creating credential…' : <><span>Generate digital ID</span><span>→</span></>}</button></form>
            {issued && <div className="issued-card"><div className="issued-heading"><div><div className="success-label"><Check size={13}/> CREDENTIAL CREATED</div><strong>{issued.holderName}</strong><p>{issued.role} · ID {issued.id.slice(0, 8).toUpperCase()}</p></div><img src={issued.qrCodeDataUri} alt="Credential QR code"/></div><div className="issued-actions"><button onClick={() => { const a = document.createElement('a'); a.href = issued.qrCodeDataUri; a.download = `verity-${issued.id}.png`; a.click(); }}><ArrowDownToLine size={15}/> Download QR code</button><button onClick={() => { setToken(issued.token); setTab('verify'); }}>Verify this ID</button></div></div>}
            </div> : <div className="panel-body"><div className="panel-intro"><div className="intro-icon lavender"><ScanLine size={18} /></div><div><h3>Inspect a credential</h3><p>Scan a QR code or paste its signed token to check authenticity.</p></div></div><div className="upload-box" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); readFile(e.dataTransfer.files?.[0]); }}><input ref={fileRef} hidden type="file" accept=".txt,text/plain,image/*" onChange={e => readFile(e.target.files?.[0])}/><div className="upload-icon"><UploadCloud size={21}/></div><strong>Drop a token file or click to browse</strong><span>{fileName || 'Text file containing a token · QR camera scanner can be connected'}</span></div><div className="or-divider"><span/> OR PASTE TOKEN <span/></div><form onSubmit={verifyCredential} className="credential-form"><label>Credential token <span>JWT</span><textarea required rows="3" placeholder="Paste the signed credential token here…" value={token} onChange={e => setToken(e.target.value)}/></label>{error && <p className="error-text">{error}</p>}<button className="primary-button verify-button" disabled={loading}>{loading ? 'Verifying…' : <><span>Verify credential</span><span>→</span></>}</button></form>{verification && <div className={`verification-result ${valid ? 'valid' : 'invalid'}`}><span className="result-icon">{valid ? <ShieldCheck size={21}/> : <ShieldX size={21}/>}</span><div><strong>{valid ? 'VALID CREDENTIAL' : 'TAMPERED / INVALID'}</strong><p>{verification.message}</p>{valid && <div className="verified-details">{verification.holderName} · {verification.role}</div>}</div><span className="result-pill">{valid ? 'AUTHENTIC' : 'REJECTED'}</span></div>}</div>}
          </section>
          <aside className="side-column"><section className="panel activity-panel"><div className="side-panel-head"><div><h3>Recent activity</h3><p>Latest credential events</p></div><button className="more-button">•••</button></div><div className="activity-list"><div className="activity-item"><span className="activity-icon issued"><IdCard size={15}/></span><div><strong>Credential issued</strong><p>Jordan Lee · Student ID</p></div><time>2m ago</time></div><div className="activity-item"><span className="activity-icon verified"><Check size={15}/></span><div><strong>Identity verified</strong><p>Campus Library · Entrance</p></div><time>18m ago</time></div><div className="activity-item"><span className="activity-icon revoked"><ShieldX size={15}/></span><div><strong>Credential revoked</strong><p>Sam Taylor · Alumni ID</p></div><time>1h ago</time></div><div className="activity-item"><span className="activity-icon verified"><Check size={15}/></span><div><strong>Identity verified</strong><p>Science Building · Access</p></div><time>2h ago</time></div></div><button className="view-all">View all activity <span>→</span></button></section><section className="trust-card"><div className="trust-emblem"><ShieldCheck size={19}/></div><div><strong>Trust, built in.</strong><p>Every credential is cryptographically signed and tamper-evident.</p><a href="#security">Learn about security <span>→</span></a></div><div className="trust-orbit"/></section></aside>
        </div>
        <footer className="footer"><span>© 2025 Verity Identity, Inc.</span><div><a href="#privacy">Privacy</a><a href="#docs">Documentation</a><span className="footer-status"><i/> API Operational</span></div></footer>
      </div>
    </main>
  </div>;
}

export default App;
