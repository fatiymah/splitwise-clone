

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here
    navigate('/');
  };

  return (
    <button onClick={handleLogout}> Logout </button>
  );
};

export default LogoutButton;

