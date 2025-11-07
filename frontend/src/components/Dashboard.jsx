import React, { useEffect, useState } from "react";
import { getProfile } from "../api"; // named import

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <p>
        Welcome, {user.firstName} {user.lastName}
      </p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Roll: {user.roll}</p>
    </div>
  );
};

export default Dashboard;
