import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/assets/SAJ CAPS.png';
import LogoutButton from './LogoutButton';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ cart = {} }) => {
  const token = localStorage.getItem('token');
  const cartItemCount = Object.values(cart).reduce((acc, count) => acc + count, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo y nombre */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
          <span className="fs-4 fw-bold text-white">SOUND CONTROL</span>
        </Link>

        {/* Botón de colapso */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center gap-3">
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/ordershistory">Historial de Pedidos</Link>
                </li>
                <li className="nav-item">
                  <LogoutButton />
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-light btn-sm text-black" to="/login">Iniciar Sesión</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
