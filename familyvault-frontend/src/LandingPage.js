import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">
      {/* ── NAVBAR ── */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <div className="lp-nav-logo-icon">🔐</div>
          <span className="lp-nav-logo-text">FamilyVault</span>
        </div>
        <button
          className="lp-nav-btn"
          onClick={() => navigate('/login')}
        >
          Go to Login →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <h1 className="lp-hero-title">
          From Lost Files to<br />
          <span className="lp-hero-accent">Secure Families</span>
        </h1>
        <p className="lp-hero-sub">
          FamilyVault is a secure digital document locker built for Indian families.<br />
          Upload, search, and access your important documents — no app install needed.
        </p>
        <div className="lp-hero-btns">
          <button
            className="lp-btn-primary"
            onClick={() => navigate('/login')}
          >
            Open Family Vault →
          </button>
          <a
            className="lp-btn-outline"
            href="https://github.com/diksha78dev/FamilyVault"
            target="_blank"
            rel="noreferrer"
          >
            ⭐ View on GitHub
          </a>
        </div>
        <div className="lp-hero-stack">
          <span>React.js</span>
          <span>Spring Boot 3.5</span>
          <span>MySQL</span>
          <span>REST API</span>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="lp-problem">
        <div className="lp-section-label">The Problem</div>
        <h2 className="lp-section-title">
          Important documents are everywhere —<br />
          except where you need them.
        </h2>
        <div className="lp-problem-grid">
          {[
            { icon: '📱', title: 'WhatsApp Groups', desc: 'Files get buried under memes, auto-deleted, impossible to find during emergencies.' },
            { icon: '📂', title: 'Phone Storage', desc: 'Lost or corrupted when phones break, reset, or get stolen.' },
            { icon: '📧', title: 'Email Inboxes', desc: 'Scattered attachments across threads. No search, no categories, no order.' },
            { icon: '👴', title: 'Elderly Members Left Out', desc: 'Complex apps frustrate elders. During medical emergencies, critical minutes are lost.' },
          ].map((item) => (
            <div key={item.title} className="lp-problem-card">
              <div className="lp-problem-icon">{item.icon}</div>
              <div className="lp-problem-title">{item.title}</div>
              <div className="lp-problem-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features">
        <div className="lp-section-label">What We Built</div>
        <h2 className="lp-section-title">Everything your family needs.<br />Nothing they don't.</h2>
        <div className="lp-features-grid">
          {[
            { icon: '📤', title: 'Upload Documents', desc: 'PDF, JPG, PNG, Word — all formats supported. Name it, pick a category, done.' },
            { icon: '🔍', title: 'Instant Search', desc: 'Find any document by name in real-time. No scrolling, no guessing.' },
            { icon: '📋', title: 'Category Filter', desc: 'Medical, Identity, Property, Financial — organized the way Indian families think.' },
            { icon: '⬇️', title: 'One-Click Download', desc: 'Access and download any document instantly from any device, any browser.' },
            { icon: '🗑️', title: 'Delete Documents', desc: 'Remove outdated files with a confirmation dialog. Clean vault, always.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive. Works on your phone without downloading any app.' },
          ].map((f) => (
            <div key={f.title} className="lp-feature-card">
              <div className="lp-feature-icon">{f.icon}</div>
              <div className="lp-feature-title">{f.title}</div>
              <div className="lp-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how">
        <div className="lp-section-label">How It Works</div>
        <h2 className="lp-section-title">Three steps. Zero confusion.</h2>
        <div className="lp-how-grid">
          {[
            { step: '01', icon: '🔑', title: 'Enter Family Code', desc: 'Your family shares one unique code — like SHARMA2024. No signup, no password reset emails.' },
            { step: '02', icon: '📤', title: 'Upload Your Documents', desc: 'Add Aadhaar cards, land papers, medical records. Pick a category and upload in seconds.' },
            { step: '03', icon: '🔍', title: 'Find Anything Instantly', desc: 'Search by name, filter by category. The right document in under 5 seconds.' },
          ].map((h) => (
            <div key={h.step} className="lp-how-card">
              <div className="lp-how-step">{h.step}</div>
              <div className="lp-how-icon">{h.icon}</div>
              <div className="lp-how-title">{h.title}</div>
              <div className="lp-how-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <h2 className="lp-cta-title">Your family's documents deserve a real home.</h2>
        <p className="lp-cta-sub">Not a WhatsApp group. Not a scattered folder. A vault.</p>
        <button
          className="lp-btn-primary lp-cta-btn"
          onClick={() => navigate('/login')}
        >
          Open FamilyVault →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">🔐 FamilyVault</div>
        <div className="lp-footer-sub">
          Built with ❤️ by Diksha Dabhole · 3rd Year CSE
        </div>
        <a
          className="lp-footer-link"
          href="https://github.com/diksha78dev/FamilyVault"
          target="_blank"
          rel="noreferrer"
        >
          github.com/diksha78dev/FamilyVault
        </a>
        <div className="lp-footer-tag">EliteHer Community Hackathon 2026</div>
      </footer>

    </div>
  );
}

export default LandingPage;