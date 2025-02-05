import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <button className="btn btn-light btn-sm text-black" onClick={handleLogout} style={{ padding: '5px 10px', fontSize: '14px' }}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;