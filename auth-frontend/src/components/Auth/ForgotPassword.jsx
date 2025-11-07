import { useState } from "react";
import { forgotPassword, sendReset } from "../../api/auth";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleHint = async () => {
    try {
      const res = await forgotPassword({ email });
      setHint(res.data.hint);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleReset = async () => {
    try {
      await sendReset({ email });
      alert("Reset email sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Forgot Password</h2>
      {!hint && <>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={handleHint}>Show Hint</button>
      </>}
      {hint && !showReset && <>
        <p>Password Hint: <strong>{hint}</strong></p>
        <button onClick={() => setShowReset(true)}>Didn't work? Reset via Email</button>
      </>}
      {showReset && <button onClick={handleReset}>Send Reset Email</button>}
    </div>
  );
};

export default ForgotPassword;
