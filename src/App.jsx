import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckSquare,
  ChevronDown,
  Clipboard,
  Code2,
  FileText,
  Folder,
  Globe2,
  Library,
  Mic,
  Paperclip,
  Plus,
  Send,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';

const recentChats = [
  'Strategia lancio prodotto',
  'Analisi competitor',
  'Piano marketing Q1',
  'Idee campagne social',
  'Landing page copy',
  'Roadmap prodotto',
];

const launchItems = [
  'Definire il posizionamento e il messaggio chiave',
  'Creare la landing page e attivare la lista d’attesa',
  'Preparare i contenuti di lancio (email, social, demo)',
  'Coinvolgere i primi utenti beta e raccogliere feedback',
  'Lanciare ufficialmente il prodotto',
  'Monitorare le metriche e ottimizzare (acquisizione, attivazione, retention)',
];

const sources = [
  ['Playbook Go-to-Market', 'Notion · 12 feb 2024'],
  ['Indie SaaS Growth', 'Articolo · a16z · 3 gen 2024'],
  ['Strategie di pricing per SaaS', 'PDF · HubSpot · 18 nov 2023'],
];

const activities = [
  ['Analizzare competitor', 'Oggi'],
  ['Preparare bozza landing', 'Domani'],
  ['Definire piano contenuti', '5 mar 2024'],
];

function BrandOrb({ small = false }) {
  return <span className={small ? 'brand-orb brand-orb--small' : 'brand-orb'} aria-hidden="true" />;
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <button className={`nav-item ${active ? 'nav-item--active' : ''}`} type="button">
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}

function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

function App() {
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('Insight');

  const codeLines = useMemo(
    () => [
      'fasi = [',
      '  "1. Validazione e preparazione",',
      '  "2. Pre-lancio (awareness)",',
      '  "3. Lancio ufficiale",',
      '  "4. Crescita e ottimizzazione"',
      ']',
      '# Focus: semplicità, valore percepito, community',
    ],
    [],
  );

  const sendMessage = () => {
    const value = message.trim();
    if (!value) return;
    setSentMessages((items) => [...items, value]);
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="app-shell">
      <aside className="left-sidebar">
        <div className="brand-block">
          <div className="brand-row">
            <BrandOrb />
            <div>
              <div className="brand-name">Dark<span>GPT</span></div>
              <div className="brand-tagline">Pensiero più profondo.<br />Risultati più reali.</div>
            </div>
          </div>
        </div>

        <button className="new-session" type="button">
          <Plus size={22} />
          <span>Nuova sessione</span>
        </button>

        <nav className="primary-nav" aria-label="Navigazione principale">
          <NavItem icon={Sparkles} label="Chat" active />
          <NavItem icon={Folder} label="Progetti" />
          <NavItem icon={Library} label="Libreria" />
          <NavItem icon={Users} label="Assistenti" />
        </nav>

        <div className="recent-section">
          <div className="section-kicker">RECENTI</div>
          <div className="recent-list">
            {recentChats.map((chat, index) => (
              <button className={`recent-item ${index === 0 ? 'recent-item--active' : ''}`} key={chat} type="button">
                <FileText size={15} />
                <span>{chat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-spacer" />

        <div className="sidebar-art" aria-hidden="true">
          <div className="sidebar-planet" />
          <div className="mountain mountain-a" />
          <div className="mountain mountain-b" />
          <div className="mountain mountain-c" />
          <p>Ride beyond<br />the ordinary.</p>
        </div>

        <button className="workspace-switcher" type="button">
          <span className="workspace-avatar">S</span>
          <span className="workspace-copy">
            <small>Workspace</small>
            <strong>Studio Alpha</strong>
          </span>
          <ChevronDown size={16} />
        </button>

        <button className="settings-row" type="button">
          <Settings size={18} />
          <span>Impostazioni</span>
        </button>
      </aside>

      <section className="main-workspace">
        <header className="workspace-header">
          <div className="header-main">
            <div className="breadcrumb">
              <BriefcaseBusiness size={14} />
              <span>Studio Alpha</span><span>›</span><span>Progetti</span><span>›</span><span>Go-to-Market</span>
            </div>
            <div className="title-row">
              <div>
                <h1>Strategia lancio prodotto</h1>
                <p>Pianificazione, posizionamento e piano operativo per il lancio.</p>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="model-switcher" type="button">
              <BrainCircuit size={19} />
              <span>DarkGPT Pro</span>
              <ChevronDown size={16} />
            </button>
            <button className="icon-button" type="button" aria-label="Invita persona"><UserPlus size={18} /></button>
            <button className="profile-badge" type="button">S</button>
          </div>
        </header>

        <div className="topic-tags">
          <Tag>Prodotto</Tag>
          <Tag>Marketing</Tag>
          <Tag>Lancio</Tag>
          <button className="tag tag-button" type="button">···</button>
        </div>

        <section className="conversation" aria-label="Conversazione">
          <div className="user-message-row">
            <div className="user-message">
              <p>Vorrei una strategia di lancio per un prodotto SaaS rivolto a freelance e piccoli team. Puoi darmi un piano sintetico con le fasi principali?</p>
              <span className="message-time">10:24</span>
            </div>
            <span className="user-mini">S</span>
          </div>

          <div className="assistant-row">
            <BrandOrb small />
            <article className="assistant-card">
              <div className="assistant-meta"><strong>DarkGPT</strong><span>10:24</span></div>
              <p className="assistant-copy">Certo! Ecco una strategia di lancio sintetica, strutturata in fasi, pensata per un prodotto SaaS rivolto a freelance e piccoli team. L’obiettivo è massimizzare l’adozione iniziale con un approccio snello ma mirato.</p>

              <div className="code-card">
                <div className="code-card-header">
                  <div><Code2 size={16} /> <span>Strategia di lancio (overview)</span></div>
                  <button type="button"><Clipboard size={15} /> Copia</button>
                </div>
                <div className="code-lines">
                  {codeLines.map((line, index) => (
                    <div className="code-line" key={`${line}-${index}`}>
                      <span className="line-no">{index + 1}</span>
                      <code className={line.startsWith('#') ? 'comment-line' : ''}>{line}</code>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="assistant-row">
            <BrandOrb small />
            <article className="assistant-card checklist-response">
              <div className="assistant-meta"><strong>DarkGPT</strong><span>10:26</span></div>
              <p className="assistant-copy">Ecco una checklist operativa per aiutarti a passare all’azione. Puoi usarla come riferimento e spuntare le attività man mano che procedi.</p>

              <div className="checklist-card">
                <div className="checklist-header">
                  <div><CheckSquare size={18} /> <strong>Checklist di lancio</strong></div>
                  <span>0 / 6 completate</span>
                </div>
                <div className="checklist-items">
                  {launchItems.map((item) => (
                    <label className="check-item" key={item}>
                      <input type="checkbox" />
                      <span className="fake-check" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <div className="tip-line"><Sparkles size={15} /> <span>Suggerimento: mantieni il focus su un singolo problema ben definito.</span></div>
              </div>
            </article>
          </div>

          {sentMessages.map((text, index) => (
            <div className="user-message-row sent-message" key={`${text}-${index}`}>
              <div className="user-message"><p>{text}</p><span className="message-time">ora</span></div>
              <span className="user-mini">S</span>
            </div>
          ))}
        </section>

        <div className="composer-wrap">
          <div className="composer">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scrivi un messaggio a DarkGPT..."
              rows={2}
            />
            <div className="composer-bottom">
              <div className="composer-tools">
                <button type="button" className="tool-icon" aria-label="Allega"><Paperclip size={19} /></button>
                <button type="button" className="tool-chip"><Globe2 size={16} />Web</button>
                <button type="button" className="tool-chip"><FileText size={16} />Documenti</button>
                <button type="button" className="tool-chip"><BarChart3 size={16} />Analisi</button>
              </div>
              <div className="composer-actions">
                <button type="button" className="tool-icon" aria-label="Microfono"><Mic size={19} /></button>
                <button className="send-button" type="button" onClick={sendMessage}><span>Invia</span><Send size={18} /></button>
              </div>
            </div>
          </div>
          <div className="composer-hint">Shift + Invio per andare a capo</div>
        </div>
      </section>

      <aside className="right-sidebar">
        <div className="right-tabs">
          {['Insight', 'File', 'Attività'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''} type="button">{tab}</button>
          ))}
        </div>

        <div className="right-content">
          <section className="side-card context-card">
            <div className="side-card-title"><span><Activity size={18} />Contesto</span><button type="button">Modifica</button></div>
            <p>Strategia di lancio per un SaaS rivolto a freelance e piccoli team. Focus su go-to-market, marketing e crescita iniziale.</p>
          </section>

          <section className="side-card">
            <div className="side-card-title"><span><BookOpen size={18} />Fonti</span><button type="button">Vedi tutte (3) ›</button></div>
            <div className="source-list">
              {sources.map(([title, meta], index) => (
                <div className="source-item" key={title}>
                  <span className={`source-number source-number-${index + 1}`}>{index + 1}</span>
                  <div><strong>{title}</strong><small>{meta}</small></div>
                </div>
              ))}
            </div>
          </section>

          <section className="side-card">
            <div className="side-card-title"><span><CheckSquare size={18} />Attività</span><button type="button">+ Nuova</button></div>
            <div className="activity-list">
              {activities.map(([title, meta]) => (
                <label className="activity-item" key={title}>
                  <input type="checkbox" />
                  <span className="activity-box" />
                  <div><strong>{title}</strong><small>{meta}</small></div>
                </label>
              ))}
            </div>
          </section>

          <div className="right-quote"><Sparkles size={17} /><span>Idee più oscure.<br />Orizzonti più ampi.</span></div>
        </div>
      </aside>
    </main>
  );
}

export default App;
