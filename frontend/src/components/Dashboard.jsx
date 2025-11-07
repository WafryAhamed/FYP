import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from './Navbar';

const Dashboard = ({ user, setUser }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div style={{ padding: '2rem' }}>
        <h2>Welcome, {user.firstName}</h2>
        <p>Role: {user.roll}</p>
        {profile && (
          <div>
            <p>Email: {profile.email}</p>
            <p>Registered At: {new Date(profile.created_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
