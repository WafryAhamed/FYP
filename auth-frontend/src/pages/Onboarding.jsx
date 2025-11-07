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
          <h1>Edu Platform</h1>
        </div>

        <p className="subtitle">Personalized Learning. AI-Powered. Real-Time Feedback.</p>
        <p className="description">
          Transform your learning experience with interactive content, adaptive quizzes, and intelligent insights for students and instructors alike.
        </p>

        <div className="button-group">
          <button className="btn-primary" onClick={() => navigate("/register")}>Sign Up</button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;
