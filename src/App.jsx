import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Folder,
  Globe2,
  Library,
  LogOut,
  Mic,
  Paperclip,
  Plus,
  Send,
  Settings,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';

const STORAGE_ACCOUNTS = 'darkgpt_accounts_v1';
const STORAGE_SESSION = 'darkgpt_session_v1';

function BrandOrb({ small = false }) {
  return <span className={small ? 'brand-orb brand-orb--small' : 'brand-orb'} aria-hidden="true" />;
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';
}

function nowTime() {
  return new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? 'nav-item--active' : ''}`} type="button" onClick={onClick}>
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Chiudi"><X size={18} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !password || (mode === 'register' && !cleanName)) {
      setError('Compila tutti i campi richiesti.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri.');
      return;
    }

    setLoading(true);
    try {
      const accounts = safeParse(localStorage.getItem(STORAGE_ACCOUNTS), []);
      const passwordHash = await hashPassword(password);

      if (mode === 'register') {
        if (accounts.some((account) => account.email === cleanEmail)) {
          setError('Esiste già un account con questa email.');
          return;
        }
        const account = { name: cleanName, email: cleanEmail, passwordHash };
        localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify([...accounts, account]));
        localStorage.setItem(STORAGE_SESSION, JSON.stringify({ email: cleanEmail }));
        onAuthenticated({ name: cleanName, email: cleanEmail });
      } else {
        const account = accounts.find((item) => item.email === cleanEmail && item.passwordHash === passwordHash);
        if (!account) {
          setError('Email o password non corretti.');
          return;
        }
        localStorage.setItem(STORAGE_SESSION, JSON.stringify({ email: cleanEmail }));
        onAuthenticated({ name: account.name, email: account.email });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-aurora auth-aurora--one" />
      <div className="auth-aurora auth-aurora--two" />
      <section className="auth-brand-panel">
        <div className="auth-brand-row"><BrandOrb /><div className="brand-name">Dark<span>GPT</span></div></div>
        <div className="auth-hero-copy">
          <span className="auth-kicker">IL TUO SPAZIO AI</span>
          <h1>Pensiero più profondo.<br /><span>Risultati più reali.</span></h1>
          <p>Entra nel tuo spazio personale DarkGPT. Ogni nuova esperienza parte vuota: le conversazioni e i contenuti li crei tu.</p>
        </div>
        <div className="auth-landscape" aria-hidden="true"><div className="auth-moon" /><div className="auth-ridge auth-ridge--a" /><div className="auth-ridge auth-ridge--b" /></div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand"><BrandOrb small /><div className="brand-name">Dark<span>GPT</span></div></div>
          <div className="auth-tabs" role="tablist">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Accedi</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Registrati</button>
          </div>
          <div className="auth-heading">
            <h2>{mode === 'login' ? 'Bentornato' : 'Crea il tuo account'}</h2>
            <p>{mode === 'login' ? 'Accedi per continuare nel tuo spazio.' : 'Inizia con un ambiente completamente nuovo.'}</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === 'register' && (
              <label className="field-label">
                <span>Nome</span>
                <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Il tuo nome" />
              </label>
            )}
            <label className="field-label">
              <span>Email</span>
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@email.it" />
            </label>
            <label className="field-label">
              <span>Password</span>
              <div className="password-field">
                <input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Almeno 6 caratteri" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? 'Attendi...' : mode === 'login' ? 'Accedi a DarkGPT' : 'Crea account'}</span>
              <span className="auth-submit-arrow">→</span>
            </button>
          </form>
          <p className="auth-switch-copy">
            {mode === 'login' ? 'Non hai ancora un account?' : 'Hai già un account?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Registrati' : 'Accedi'}</button>
          </p>
        </div>
      </section>
    </main>
  );
}

function EmptySection({ icon: Icon, title, copy }) {
  return (
    <div className="section-empty">
      <div className="section-empty-icon"><Icon size={26} /></div>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

function Workspace({ user, onLogout }) {
  const storageKey = `darkgpt_sessions_${user.email}`;
  const [sessions, setSessions] = useState(() => safeParse(localStorage.getItem(storageKey), []));
  const [currentId, setCurrentId] = useState(() => safeParse(localStorage.getItem(storageKey), [])[0]?.id ?? null);
  const [message, setMessage] = useState('');
  const [activeNav, setActiveNav] = useState('Chat');
  const [activeTab, setActiveTab] = useState('Insight');
  const [activeTool, setActiveTool] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [taskDraft, setTaskDraft] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [toast, setToast] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const micStream = useRef(null);
  const fileInputRef = useRef(null);
  const conversationRef = useRef(null);

  const currentSession = useMemo(() => sessions.find((session) => session.id === currentId) ?? null, [sessions, currentId]);
  const sessionMessages = currentSession?.messages ?? [];
  const sessionFiles = currentSession?.files ?? [];
  const sessionTasks = currentSession?.tasks ?? [];

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sessions));
  }, [sessions, storageKey]);

  useEffect(() => () => {
    micStream.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const element = conversationRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  }, [sessionMessages]);

  const updateCurrent = (updater) => {
    if (!currentId) return;
    setSessions((items) => items.map((session) => session.id === currentId ? updater(session) : session));
  };

  const createSession = () => {
    const id = `session-${Date.now()}`;
    const session = { id, title: 'Nuova chat', messages: [], files: [], tasks: [], createdAt: Date.now() };
    setSessions((items) => [session, ...items]);
    setCurrentId(id);
    setActiveNav('Chat');
    setMessage('');
    setToast('Nuova sessione creata');
  };

  const ensureSessionId = () => currentSession?.id ?? `session-${Date.now()}`;

  const sendMessage = async () => {
    const value = message.trim();
    if (!value || isGenerating) return;

    const id = ensureSessionId();
    const assistantId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text: value, time: nowTime() };
    const assistantMessage = { id: assistantId, role: 'assistant', text: '', time: nowTime() };
    const previousMessages = currentSession?.messages ?? [];
    const firstMessage = previousMessages.length === 0;

    setSessions((items) => {
      const existing = items.find((session) => session.id === id);
      if (!existing) {
        return [{
          id,
          title: value.slice(0, 38) + (value.length > 38 ? '…' : ''),
          messages: [userMessage, assistantMessage],
          files: [],
          tasks: [],
          createdAt: Date.now(),
        }, ...items];
      }
      return items.map((session) => session.id === id ? {
        ...session,
        title: firstMessage ? value.slice(0, 38) + (value.length > 38 ? '…' : '') : session.title,
        messages: [...session.messages, userMessage, assistantMessage],
      } : session);
    });

    setCurrentId(id);
    setMessage('');
    setIsGenerating(true);

    const apiMessages = [...previousMessages, userMessage]
      .filter((entry) => entry.role === 'user' || entry.role === 'assistant')
      .map((entry) => ({ role: entry.role, content: entry.text }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok || !response.body) {
        const details = await response.text().catch(() => '');
        throw new Error(details || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        answer += decoder.decode(chunk, { stream: true });
        setSessions((items) => items.map((session) => session.id === id ? {
          ...session,
          messages: session.messages.map((entry) => entry.id === assistantId ? { ...entry, text: answer } : entry),
        } : session));
      }

      answer += decoder.decode();
      if (!answer.trim()) throw new Error('Risposta vuota dal modello');
    } catch (error) {
      console.error('DarkGPT/Qwen error:', error);
      setSessions((items) => items.map((session) => session.id === id ? {
        ...session,
        messages: session.messages.map((entry) => entry.id === assistantId ? {
          ...entry,
          text: 'Non riesco a contattare il motore Qwen3.8-27B. Verifica che il backend DarkGPT e il server del modello siano avviati.',
          error: true,
        } : entry),
      } : session));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const attachFiles = (files) => {
    if (!files?.length) return;
    const id = currentSession?.id ?? `session-${Date.now()}`;
    const mapped = Array.from(files).map((file) => ({ id: `${file.name}-${file.lastModified}`, name: file.name, size: file.size, type: file.type || 'file' }));
    setSessions((items) => {
      const existing = items.find((session) => session.id === id);
      if (!existing) return [{ id, title: 'Nuova chat', messages: [], files: mapped, tasks: [], createdAt: Date.now() }, ...items];
      return items.map((session) => session.id === id ? { ...session, files: [...session.files, ...mapped.filter((file) => !session.files.some((saved) => saved.id === file.id))] } : session);
    });
    setCurrentId(id);
    setToast(mapped.length === 1 ? 'File allegato' : `${mapped.length} file allegati`);
  };

  const toggleMic = async () => {
    if (micActive) {
      micStream.current?.getTracks().forEach((track) => track.stop());
      micStream.current = null;
      setMicActive(false);
      setToast('Microfono disattivato');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.current = stream;
      setMicActive(true);
      setToast('Microfono attivo');
    } catch {
      setToast('Permesso microfono non disponibile');
    }
  };

  const addTask = () => {
    const value = taskDraft.trim();
    if (!value || !currentId) return;
    updateCurrent((session) => ({ ...session, tasks: [...session.tasks, { id: `task-${Date.now()}`, title: value, done: false }] }));
    setTaskDraft('');
    setShowTaskInput(false);
  };

  const toggleTask = (taskId) => updateCurrent((session) => ({ ...session, tasks: session.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task) }));

  const deleteCurrentSession = () => {
    if (!currentId || isGenerating) return;
    const next = sessions.filter((session) => session.id !== currentId);
    setSessions(next);
    setCurrentId(next[0]?.id ?? null);
    setShowSessionMenu(false);
    setToast('Sessione eliminata');
  };

  const renameCurrentSession = () => {
    if (!currentSession) return;
    const value = window.prompt('Nuovo nome della sessione', currentSession.title)?.trim();
    if (!value) return;
    updateCurrent((session) => ({ ...session, title: value }));
    setShowSessionMenu(false);
  };

  const handleNav = (label) => {
    setActiveNav(label);
    setShowProfile(false);
  };

  const renderMessage = (entry) => {
    if (entry.role === 'assistant') {
      return (
        <div className="assistant-row" key={entry.id}>
          <BrandOrb small />
          <article className={`assistant-card ${entry.error ? 'assistant-card--error' : ''}`}>
            <div className="assistant-meta"><strong>DarkGPT</strong><span>{entry.time}</span></div>
            {entry.text ? <p className="assistant-message-text">{entry.text}</p> : <div className="typing-dots" aria-label="DarkGPT sta rispondendo"><span /><span /><span /></div>}
          </article>
        </div>
      );
    }
    return (
      <div className="user-message-row sent-message" key={entry.id}>
        <div className="user-message"><p>{entry.text}</p><span className="message-time">{entry.time}</span></div>
        <span className="user-mini">{initials(user.name)}</span>
      </div>
    );
  };

  const renderChat = () => (
    <>
      <header className="workspace-header">
        <div className="header-main">
          <div className="breadcrumb"><Sparkles size={14} /><span>DarkGPT</span><span>›</span><span>Chat</span></div>
          <div className="title-row">
            <div>
              <h1>{currentSession?.title || 'Nuova conversazione'}</h1>
              <p>{currentSession ? 'La tua sessione personale.' : 'Inizia scrivendo il tuo primo messaggio.'}</p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="popover-anchor">
            <button className="model-switcher" type="button" onClick={() => setShowModel((value) => !value)}><BrainCircuit size={19} /><span>DarkGPT Pro</span><ChevronDown size={16} /></button>
            {showModel && <div className="small-popover model-popover"><strong>DarkGPT Pro</strong><small>Qwen3.8-27B</small></div>}
          </div>
          <button className="icon-button" type="button" aria-label="Invita persona" onClick={() => setShowInvite(true)}><UserPlus size={18} /></button>
          <div className="popover-anchor">
            <button className="profile-badge" type="button" onClick={() => setShowProfile((value) => !value)}>{initials(user.name)}</button>
            {showProfile && (
              <div className="profile-popover small-popover">
                <strong>{user.name}</strong><small>{user.email}</small>
                <button type="button" onClick={onLogout}><LogOut size={15} />Esci</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="topic-tags">
        {currentSession && <span className="tag">Sessione personale</span>}
        {currentSession && (
          <div className="popover-anchor">
            <button className="tag tag-button" type="button" onClick={() => setShowSessionMenu((value) => !value)}>···</button>
            {showSessionMenu && <div className="small-popover session-popover"><button onClick={renameCurrentSession} type="button">Rinomina</button><button onClick={deleteCurrentSession} type="button" className="danger"><Trash2 size={14} />Elimina</button></div>}
          </div>
        )}
      </div>

      <section ref={conversationRef} className={`conversation ${sessionMessages.length === 0 ? 'conversation--empty' : ''}`} aria-label="Conversazione">
        {sessionMessages.length === 0 ? (
          <div className="chat-empty">
            <BrandOrb />
            <h2>Come posso aiutarti?</h2>
            <p>Questa conversazione è vuota. Scrivi tu il primo messaggio.</p>
          </div>
        ) : sessionMessages.map(renderMessage)}
      </section>

      <div className="composer-wrap">
        <div className={`composer ${micActive ? 'composer--mic' : ''}`}>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={handleKeyDown} placeholder="Scrivi un messaggio a DarkGPT..." rows={2} disabled={isGenerating} />
          <div className="composer-bottom">
            <div className="composer-tools">
              <button type="button" className="tool-icon" aria-label="Allega" onClick={() => fileInputRef.current?.click()}><Paperclip size={19} /></button>
              <input ref={fileInputRef} className="hidden-file" type="file" multiple onChange={(event) => { attachFiles(event.target.files); event.target.value = ''; }} />
              <button type="button" className={`tool-chip ${activeTool === 'Web' ? 'active' : ''}`} onClick={() => setActiveTool(activeTool === 'Web' ? null : 'Web')}><Globe2 size={16} />Web</button>
              <button type="button" className={`tool-chip ${activeTool === 'Documenti' ? 'active' : ''}`} onClick={() => { setActiveTool(activeTool === 'Documenti' ? null : 'Documenti'); if (activeTool !== 'Documenti') fileInputRef.current?.click(); }}><FileText size={16} />Documenti</button>
              <button type="button" className={`tool-chip ${activeTool === 'Analisi' ? 'active' : ''}`} onClick={() => setActiveTool(activeTool === 'Analisi' ? null : 'Analisi')}><BarChart3 size={16} />Analisi</button>
            </div>
            <div className="composer-actions">
              <button type="button" className={`tool-icon ${micActive ? 'active mic-pulse' : ''}`} aria-label="Microfono" onClick={toggleMic}><Mic size={19} /></button>
              <button className="send-button" type="button" onClick={sendMessage} disabled={!message.trim() || isGenerating}><span>{isGenerating ? 'Risponde…' : 'Invia'}</span><Send size={18} /></button>
            </div>
          </div>
        </div>
        <div className="composer-hint">Shift + Invio per andare a capo</div>
      </div>
    </>
  );

  return (
    <main className="app-shell">
      <aside className="left-sidebar">
        <div className="brand-block"><div className="brand-row"><BrandOrb /><div><div className="brand-name">Dark<span>GPT</span></div><div className="brand-tagline">Pensiero più profondo.<br />Risultati più reali.</div></div></div></div>
        <button className="new-session" type="button" onClick={createSession} disabled={isGenerating}><Plus size={22} /><span>Nuova sessione</span></button>

        <nav className="primary-nav" aria-label="Navigazione principale">
          <NavItem icon={Sparkles} label="Chat" active={activeNav === 'Chat'} onClick={() => handleNav('Chat')} />
          <NavItem icon={Folder} label="Progetti" active={activeNav === 'Progetti'} onClick={() => handleNav('Progetti')} />
          <NavItem icon={Library} label="Libreria" active={activeNav === 'Libreria'} onClick={() => handleNav('Libreria')} />
          <NavItem icon={Users} label="Assistenti" active={activeNav === 'Assistenti'} onClick={() => handleNav('Assistenti')} />
        </nav>

        <div className="recent-section">
          <div className="section-kicker">RECENTI</div>
          <div className="recent-list">
            {sessions.length === 0 ? <div className="recent-empty">Nessuna conversazione</div> : sessions.map((session) => (
              <button className={`recent-item ${session.id === currentId ? 'recent-item--active' : ''}`} key={session.id} type="button" disabled={isGenerating} onClick={() => { setCurrentId(session.id); setActiveNav('Chat'); }}>
                <FileText size={15} /><span>{session.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-art" aria-hidden="true"><div className="sidebar-planet" /><p>Ride beyond<br />the ordinary.</p></div>

        <button className="workspace-switcher" type="button" onClick={() => setToast('Workspace personale selezionato')}>
          <span className="workspace-avatar">{initials(user.name)}</span>
          <span className="workspace-copy"><small>Workspace</small><strong>Personale</strong></span>
          <ChevronDown size={16} />
        </button>
        <button className="settings-row" type="button" onClick={() => setShowSettings(true)}><Settings size={18} /><span>Impostazioni</span></button>
      </aside>

      <section className="main-workspace">
        {activeNav === 'Chat' && renderChat()}
        {activeNav === 'Progetti' && <EmptySection icon={Folder} title="Progetti" copy="Non hai ancora creato progetti." />}
        {activeNav === 'Libreria' && <EmptySection icon={Library} title="Libreria" copy="La tua libreria è vuota." />}
        {activeNav === 'Assistenti' && <EmptySection icon={Users} title="Assistenti" copy="Non hai ancora configurato assistenti." />}
      </section>

      <aside className="right-sidebar">
        <div className="right-tabs">{['Insight', 'File', 'Attività'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''} type="button">{tab}</button>)}</div>
        <div className="right-content">
          {activeTab === 'Insight' && (
            <>
              <section className="side-card context-card">
                <div className="side-card-title"><span><Activity size={18} />Contesto</span></div>
                {sessionMessages.length ? <p>{sessionMessages.find((entry) => entry.role === 'user')?.text || ''}</p> : <div className="side-empty">Il contesto apparirà dopo il tuo primo messaggio.</div>}
              </section>
              <section className="side-card">
                <div className="side-card-title"><span><BookOpen size={18} />Fonti</span><button type="button" onClick={() => fileInputRef.current?.click()}>+ Aggiungi</button></div>
                {sessionFiles.length ? <div className="source-list">{sessionFiles.map((file, index) => <div className="source-item" key={file.id}><span className="source-number">{index + 1}</span><div><strong>{file.name}</strong><small>{Math.max(1, Math.round(file.size / 1024))} KB</small></div></div>)}</div> : <div className="side-empty">Nessun file o fonte collegata.</div>}
              </section>
              <section className="side-card">
                <div className="side-card-title"><span><CheckSquare size={18} />Attività</span><button type="button" onClick={() => setShowTaskInput(true)}>+ Nuova</button></div>
                {showTaskInput && <div className="task-add"><input autoFocus value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addTask(); if (event.key === 'Escape') setShowTaskInput(false); }} placeholder="Scrivi attività" /><button type="button" onClick={addTask}>Aggiungi</button></div>}
                {sessionTasks.length ? <div className="activity-list">{sessionTasks.map((task) => <label className={`activity-item ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><span className="activity-box" /><div><strong>{task.title}</strong><small>{task.done ? 'Completata' : 'Da fare'}</small></div></label>)}</div> : !showTaskInput && <div className="side-empty">Nessuna attività creata.</div>}
              </section>
            </>
          )}
          {activeTab === 'File' && <section className="side-card side-card--fill"><div className="side-card-title"><span><FileText size={18} />File</span><button type="button" onClick={() => fileInputRef.current?.click()}>+ Aggiungi</button></div>{sessionFiles.length ? <div className="source-list">{sessionFiles.map((file, index) => <div className="source-item" key={file.id}><span className="source-number">{index + 1}</span><div><strong>{file.name}</strong><small>{Math.max(1, Math.round(file.size / 1024))} KB</small></div></div>)}</div> : <div className="side-empty side-empty--large">Nessun file collegato a questa conversazione.</div>}</section>}
          {activeTab === 'Attività' && <section className="side-card side-card--fill"><div className="side-card-title"><span><CheckSquare size={18} />Attività</span><button type="button" onClick={() => setShowTaskInput(true)}>+ Nuova</button></div>{showTaskInput && <div className="task-add"><input autoFocus value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addTask()} placeholder="Scrivi attività" /><button type="button" onClick={addTask}>Aggiungi</button></div>}{sessionTasks.length ? <div className="activity-list">{sessionTasks.map((task) => <label className={`activity-item ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><span className="activity-box" /><div><strong>{task.title}</strong><small>{task.done ? 'Completata' : 'Da fare'}</small></div></label>)}</div> : !showTaskInput && <div className="side-empty side-empty--large">Nessuna attività creata.</div>}</section>}
          <div className="right-quote"><Sparkles size={17} /><span>Idee più oscure.<br />Orizzonti più ampi.</span></div>
        </div>
      </aside>

      {toast && <div className="toast"><Sparkles size={16} />{toast}</div>}

      {showSettings && <Modal title="Impostazioni" onClose={() => setShowSettings(false)}><div className="settings-content"><div className="settings-avatar">{initials(user.name)}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div><button className="modal-action danger" type="button" onClick={onLogout}><LogOut size={16} />Esci dall’account</button></Modal>}
      {showInvite && <Modal title="Invita" onClose={() => setShowInvite(false)}><p className="modal-copy">Condividi l’accesso alla sessione quando il backend collaborativo sarà collegato. L’interfaccia è già pronta.</p><button className="modal-action" type="button" onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowInvite(false); setToast('Link copiato'); }}>Copia link</button></Modal>}
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const session = safeParse(localStorage.getItem(STORAGE_SESSION), null);
    if (!session?.email) return null;
    const accounts = safeParse(localStorage.getItem(STORAGE_ACCOUNTS), []);
    const account = accounts.find((item) => item.email === session.email);
    return account ? { name: account.name, email: account.email } : null;
  });

  const logout = () => {
    localStorage.removeItem(STORAGE_SESSION);
    setUser(null);
  };

  return user ? <Workspace user={user} onLogout={logout} /> : <AuthScreen onAuthenticated={setUser} />;
}
