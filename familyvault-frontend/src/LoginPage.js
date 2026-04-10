import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // which tab is active
  const [activeTab, setActiveTab] = useState('login');

  // login form state
  const [familyCode, setFamilyCode] = useState('');
  const [pin, setPin] = useState('');

  // register form state
  const [regCode, setRegCode] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');

  // ui state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // LOGIN FUNCTION
  // Calls POST /family/login
  // If success → gives familyCode+pin to parent → goes to dashboard
  const handleLogin = async (code, p) => {
    setLoading(true);
    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_URL}/family/login?familyCode=${code}&pin=${p}`,
          { method: 'POST' }
      );
      if (res.ok) {
        // give the pass to AuthWrapper (parent)
        onLoginSuccess(code, p);
        // go to dashboard
        navigate('/dashboard');
      } else {
        showToast('error', 'Wrong family code or PIN. Try again.');
      }
    } catch {
      showToast('error', 'Cannot reach server. Is Spring Boot running?');
    }
    setLoading(false);
  };

  // REGISTER FUNCTION
  // Calls POST /family/register
  // If success → auto login → dashboard (no extra steps for user)
  const handleRegister = async () => {
    if (!regCode || !regPin || !regConfirmPin) {
      showToast('error', 'Please fill all fields.');
      return;
    }
    if (regPin !== regConfirmPin) {
      showToast('error', 'PINs do not match. Check and try again.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_URL}/family/register?familyCode=${regCode}&pin=${regPin}`,
          { method: 'POST' }
      );
      if (res.ok) {
        // register worked → auto login immediately
        // user does not need to re-enter anything
        await handleLogin(regCode, regPin);
      } else {
        const msg = await res.text();
        showToast('error', msg);
      }
    } catch {
      showToast('error', 'Cannot reach server. Is Spring Boot running?');
    }
    setLoading(false);
  };

  return (
    <div className="lp2-root">
      {/* background blobs — these create the glow effect */}
      <div className="lp2-blob1" />
      <div className="lp2-blob2" />
      <div className="lp2-blob3" />

      {/* glass card */}
      <div className="lp2-card">

        {/* logo */}
        <div className="lp2-logo">
          <div className="lp2-logo-icon">🔐</div>
          <span className="lp2-logo-text">FamilyVault</span>
        </div>

        <div className="lp2-title">
          {activeTab === 'login' ? 'Welcome back' : 'Create your vault'}
        </div>
        <div className="lp2-sub">
          {activeTab === 'login'
            ? 'Sign in to access your family documents'
            : 'Register your family and start securing documents'}
        </div>

        {/* tabs */}
        <div className="lp2-tabs">
          <button
            className={`lp2-tab ${activeTab === 'login' ? 'on' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`lp2-tab ${activeTab === 'register' ? 'on' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register Family
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <div className="lp2-form">
            <div className="lp2-info-box">
              Enter your family's <strong>unique code</strong> and <strong>PIN</strong>.
              e.g. <strong>SHARMA2024</strong>
            </div>
            <div className="lp2-form-group">
              <label className="lp2-label">Family Code</label>
              <input
                className="lp2-input"
                type="text"
                placeholder="e.g. SHARMA2024"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(familyCode, pin)}
              />
            </div>
            <div className="lp2-form-group">
              <label className="lp2-label">Family PIN</label>
              <input
                className="lp2-input"
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(familyCode, pin)}
              />
            </div>
            <button
              className="lp2-btn"
              onClick={() => handleLogin(familyCode, pin)}
              disabled={loading}
            >
              {loading ? 'Opening vault...' : 'Open Family Vault →'}
            </button>
            <div className="lp2-switch">
              New family?{' '}
              <span onClick={() => setActiveTab('register')}>
                Create a vault
              </span>
            </div>
          </div>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <div className="lp2-form">
            <div className="lp2-info-box">
              Choose a <strong>unique family code</strong> like your surname + year.
              Share it with family members so everyone can access the same vault.
            </div>
            <div className="lp2-form-group">
              <label className="lp2-label">Choose Family Code</label>
              <input
                className="lp2-input"
                type="text"
                placeholder="e.g. PATIL2024, MEHTA_FAM"
                value={regCode}
                onChange={(e) => setRegCode(e.target.value)}
              />
              <div className="lp2-hint">
                Unique — like an Instagram username for your family
              </div>
            </div>
            <div className="lp2-form-group">
              <label className="lp2-label">Set Family PIN</label>
              <input
                className="lp2-input"
                type="password"
                placeholder="4–6 digits"
                value={regPin}
                onChange={(e) => setRegPin(e.target.value)}
              />
            </div>
            <div className="lp2-form-group">
              <label className="lp2-label">Confirm PIN</label>
              <input
                className="lp2-input"
                type="password"
                placeholder="Re-enter your PIN"
                value={regConfirmPin}
                onChange={(e) => setRegConfirmPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
            <button
              className="lp2-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating vault...' : 'Create Family Vault →'}
            </button>
            <div className="lp2-switch">
              Already registered?{' '}
              <span onClick={() => setActiveTab('login')}>
                Sign in
              </span>
            </div>
          </div>
        )}

        {/* toast */}
        {toast && (
          <div className={`lp2-toast lp2-toast-${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </div>
        )}
      </div>

      <div className="lp2-footer">
        Built for Indian families · No app needed · Works on mobile
      </div>
    </div>
  );
}

export default LoginPage;