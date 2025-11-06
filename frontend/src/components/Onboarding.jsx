// src/components/Onboarding.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Onboarding.module.css';

// --- SVG ICONS (no external dependencies) ---
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4F46E5" />
    <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" />
    <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" />
  </svg>
);

const BrainIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 15C7 14.11 7.39 13.27 8.06 12.7C8.34 12.46 8.4 12.05 8.2 11.79C7.58 11 7.2 10.03 7.2 9C7.2 6.24 9.44 4 12.2 4C14.96 4 17.2 6.24 17.2 9C17.2 10.03 16.82 11 16.2 11.79C16 12.05 16.06 12.46 16.34 12.7C17.01 13.27 17.4 14.11 17.4 15C17.4 17.21 15.61 19 13.4 19H10.6C8.39 19 6.6 17.21 6.6 15Z" />
    <path d="M12 20V19" />
  </svg>
);

const TargetIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="6" height="14" rx="1" />
    <rect x="11" y="7" width="6" height="10" rx="1" />
    <rect x="19" y="12" width="6" height="5" rx="1" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 12C3 11.1716 3.32894 10.3771 3.91421 9.81066C4.49949 9.24421 5.2929 8.95262 6.12132 9C7.5 9 9 10 12 10C15 10 16.5 9 17.8787 9C18.7071 8.95262 19.5005 9.24421 20.0858 9.81066C20.6711 10.3771 21 11.1716 21 12V19C21 19.8284 20.6711 20.6229 20.0858 21.1893C19.5005 21.7558 18.7071 22.0474 17.8787 22H6.12132C5.2929 22.0474 4.49949 21.7558 3.91421 21.1893C3.32894 20.6229 3 19.8284 3 19V12Z" />
  </svg>
);

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M15 2V6" />
    <path d="M9 2V6" />
    <path d="M15 22V18" />
    <path d="M9 22V18" />
    <path d="M2 9H6" />
    <path d="M2 15H6" />
    <path d="M18 9H22" />
    <path d="M18 15H22" />
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M12 16L12 12" />
    <path d="M12 8H12.01" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- COMPONENTS ---
const OnboardingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logoLink}>
          <LogoIcon />
          AdaptiveLearn
        </Link>

        <nav className={styles.navLinks}>
          <div className={styles.navItem}>
            <Link to="/features">Features</Link>
          </div>
          <div className={styles.navItem}>
            <Link to="/how-it-works">How It Works</Link>
          </div>
          <div className={styles.navItem}>
            <Link to="/technology">Technology</Link>
          </div>
          <div className={styles.navItem}>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>

        <div className={styles.navButtons}>
          <Link to="/login" className={`${styles.btn} ${styles.btnOutline}`}>Log In</Link>
          <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>Sign Up</Link>
        </div>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && (
        <div className={`${styles.mobileMenu} ${styles.open}`}>
          <Link to="/features" className={styles.mobileLink}>Features</Link>
          <Link to="/how-it-works" className={styles.mobileLink}>How It Works</Link>
          <Link to="/technology" className={styles.mobileLink}>Technology</Link>
          <Link to="/contact" className={styles.mobileLink}>Contact</Link>
          <div className={styles.mobileBtnGroup}>
            <Link to="/login" className={`${styles.btn} ${styles.btnOutline}`}>Log In</Link>
            <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => (
  <section className={styles.hero}>
    <div className={styles.blob}></div>
    <div className={styles.blob}></div>
    <div className={styles.blob}></div>
    <div className={styles.heroContent}>
      <div className={styles.heroLogo}>
        <LogoIcon className={styles.heroLogoSvg} />
        <h1 className={styles.heroTitle}>AdaptiveLearn</h1>
      </div>
      <p className={styles.heroSubtitle}>AI-Powered Adaptive Learning in Real-Time</p>
      <p className={styles.heroDesc}>
        Transform passive video conferencing into dynamic, personalized educational experiences with real-time AI clustering, targeted content delivery, and intelligent feedback.
      </p>
      <div className={styles.heroBtns}>
        <Link to="/register" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>Get Started</Link>
        <a href="#how-it-works" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>Learn More</a>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => {
  const benefits = [
    { icon: <BrainIcon />, title: 'Predict Your Learning Path', desc: 'Our AI analyzes your engagement patterns to personalize your educational journey.' },
    { icon: <TargetIcon />, title: 'Get Questions That Match Your Pace', desc: 'Receive perfectly calibrated challenges based on your unique learning profile.' },
    { icon: <BarChartIcon />, title: 'See Real-Time Insights', desc: 'Gain valuable feedback instantly — for both you and your instructor.' },
  ];

  return (
    <section className={`${styles.section} ${styles.sectionBgWhite}`}>
      <div className={styles.grid}>
        {benefits.map((b, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardIcon}>{b.icon}</div>
            <h3 className={styles.cardTitle}>{b.title}</h3>
            <p className={styles.cardText}>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { icon: <DatabaseIcon />, title: 'Data Collection & Processing', desc: 'Ingests user profiles, real-time behavioral logs, quiz responses, and course metadata through secure channels.' },
    { icon: <BrainIcon />, title: 'Predictive Clustering Model', desc: "Identifies student engagement patterns in real-time, classifying learners as 'Engaged', 'Distracted', 'Struggling', or 'Advanced'." },
    { icon: <CpuIcon />, title: 'Targeted Quiz Delivery', desc: 'Recommends optimal questions based on cluster assignment and performance history.' },
    { icon: <ZapIcon />, title: 'Real-time Feedback Generation', desc: 'Delivers motivational or corrective feedback using hybrid AI models within 200ms.' },
    { icon: <BarChartIcon />, title: 'Live Analytics Dashboard', desc: 'Provides instructors with real-time visualization of class engagement and at-risk alerts.' },
    { icon: <ShieldIcon />, title: 'Secure & Compliant Infrastructure', desc: 'Built on enterprise-grade security with AES-256 encryption and GDPR compliance.' },
  ];

  return (
    <section id="how-it-works" className={`${styles.section} ${styles.sectionBgGradient}`}>
      <h2 className={styles.sectionTitle}>How AdaptiveLearn Works</h2>
      <p className={styles.sectionSubtitle}>
        Our sophisticated AI platform transforms passive video conferencing into dynamic, personalized learning experiences through a seamless six-step process.
      </p>
      <div className={styles.grid}>
        {steps.map((step, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardIcon}>{step.icon}</div>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardText}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const OnboardingFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={styles.footerGrid}>
        <div>
          <div className={styles.footerBrand}>
            <LogoIcon />
            AdaptiveLearn
          </div>
          <p className={styles.footerSlogan}>Where Learning Meets Intelligence</p>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Product</h3>
          <a href="#features" className={styles.footerLink}>Features</a>
          <a href="#how-it-works" className={styles.footerLink}>How It Works</a>
          <a href="/pricing" className={styles.footerLink}>Pricing</a>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Company</h3>
          <a href="/about" className={styles.footerLink}>About</a>
          <a href="/blog" className={styles.footerLink}>Blog</a>
          <a href="/contact" className={styles.footerLink}>Contact</a>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>Legal</h3>
          <a href="/privacy" className={styles.footerLink}>Privacy</a>
          <a href="/terms" className={styles.footerLink}>Terms</a>
          <a href="/security" className={styles.footerLink}>Security</a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} AdaptiveLearn. All rights reserved.
        </p>
        <div className={styles.socialIcons}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <TwitterIcon />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN COMPONENT ---
const Onboarding = () => {
  return (
    <div className={styles.container}>
      <OnboardingHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
      </main>
      <OnboardingFooter />
    </div>
  );
};

export default Onboarding;