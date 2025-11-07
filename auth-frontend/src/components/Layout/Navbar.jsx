import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav style={{ padding: "10px", background: "#f0f0f0", display: "flex", justifyContent: "space-between" }}>
      <span>Edu Platform ({user.role})</span>
      <button onClick={logoutUser}>Logout</button>
    </nav>
  );
};

export default Navbar;
