import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, CheckCircle, Shield, Zap, Check, ChevronLeft } from 'lucide-react'
import logoSc from '../../assets/logo-sc.svg'
import heroImg from '../../assets/hero.png'

function getRedirectPath(email) {
  return email.endsWith('@serviceclub.com') ? '/academy/admin' : '/'
}

function ImageSide() {
  return (
    <div className="login-image-side">
      <img src={heroImg} alt="" className="login-hero" />
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [screen, setScreen]             = useState('form')

  const signIn = (e) => {
    e.preventDefault()
    sessionStorage.setItem('sc_auth', 'true')
    navigate(getRedirectPath(email))
  }

  const handleContinue = (e) => {
    e.preventDefault()
    if (!email) return
    if (showPassword) {
      signIn(e)
    } else {
      setScreen('inbox')
    }
  }

  if (screen === 'inbox') {
    return (
      <div className="login-page">
        <ImageSide />
        <div className="login-form-side">
          <div className="login-form-container">
            <img src={logoSc} alt="Service Club" className="login-logo-img" />

            <div className="login-inbox-icon">
              <Mail size={30} color="var(--color-secondary)" strokeWidth={1.5} />
              <div className="login-inbox-badge">
                <Check size={11} strokeWidth={3} />
              </div>
            </div>

            <div className="login-inbox-headline">Check your inbox</div>
            <div className="login-inbox-body">We sent a magic link to</div>
            <div className="login-inbox-email">{email}</div>
            <div className="login-inbox-body">
              Click the link to sign in instantly — no password needed.
            </div>

            <button className="login-back" onClick={() => setScreen('form')}>
              <ChevronLeft size={15} /> Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <ImageSide />
      <div className="login-form-side">
        <div className="login-form-container">
          <img src={logoSc} alt="Service Club" className="login-logo-img" />

          <h1 className="login-headline">
            Welcome to<br />
            <span className="login-headline-accent">Service Club</span>
          </h1>
          <p className="login-subheadline">Enter your email to get started</p>

          <form onSubmit={handleContinue}>
            <div className="login-field-group">
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="search-wrapper">
                  <Mail size={15} />
                  <input
                    className="input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {showPassword && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="search-wrapper">
                    <Lock size={15} />
                    <input
                      className="input"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary login-cta">
              {showPassword ? 'Sign in' : 'Continue'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-trust">
            <div className="login-trust-item">
              <CheckCircle size={13} color="var(--color-success)" /> Free to join
            </div>
            <div className="login-trust-item">
              <Shield size={13} color="var(--color-secondary)" /> Secure
            </div>
            <div className="login-trust-item">
              <Zap size={13} color="var(--color-primary)" /> Instant
            </div>
          </div>

          <button className="login-toggle" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? 'Use magic link instead' : 'Or sign in with password'}
          </button>

          <div className="login-divider">Or sign in with</div>

          <div className="login-social-row">
            <button className="login-social-btn" type="button" onClick={() => {
              sessionStorage.setItem('sc_auth', 'true')
              navigate('/')
            }}>
              <span className="login-social-icon login-social-icon--google">G</span>
              Google
            </button>
            <button className="login-social-btn" type="button" onClick={() => {
              sessionStorage.setItem('sc_auth', 'true')
              navigate('/')
            }}>
              <span className="login-social-icon login-social-icon--facebook">f</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
