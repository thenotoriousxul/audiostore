import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';
import NavbarComponent from '/src/Components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo: email, contraseña: password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Iniciando sesión con:', data);
        localStorage.setItem('token', data.accessToken);
        navigate('/catalogo');
      } else {
        const errorData = await response.json();
        alert('Error en el inicio de sesión: ' + errorData.message);
      }
    } catch (error) {
      alert('Error en el inicio de sesión: ' + error.message);
    }
  };

  return (
    <div className="login-container bg-black text-white">
      {/* Botón de Atrás */}
      <Link to="/" className="btn btn-light position-absolute top-0 start-0 m-3">
        Atrás
      </Link>

      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="overlay p-4" style={{ width: '25rem', backgroundColor: '#222', borderColor: '#fff' }}>
          <Card.Body>
            <h2 className="text-center text-white mb-4">Iniciar Sesión</h2>
            <Form onSubmit={handleLogin}>
              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-dark text-white border-white"
                />
              </Form.Group>

              {/* Contraseña */}
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-dark text-white border-white"
                />
              </Form.Group>

              {/* Botón de Iniciar Sesión */}
              <Button variant="light" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>

            {/* Enlace a registro */}
            <div className="text-center mt-3">
              <p className="text-white">¿No tienes cuenta? <Link to="/registro" className="text-light">Regístrate aquí</Link></p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
