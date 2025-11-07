import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <section className="onboarding-section">
      {/* Background Blobs */}
      <div className="blobs">
        <div className="blob blob-purple"></div>
        <div className="blob blob-indigo"></div>
        <div className="blob blob-blue"></div>
      </div>

      <div className="onboarding-content">
        <div className="logo-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4F46E5" />
            <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>AdaptiveLearn</h1>
        </div>

        <p className="subtitle">AI-Driven Learning That Adapts to Every Student</p>
        <p className="description">
          Empower educators and engage learners with real-time analytics, predictive insights, and personalized content — all within your existing virtual classroom.
        </p>

        <div className="button-group">
          <button className="btn-primary" onClick={() => navigate("/register")}>Get Started Free</button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;