import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Navbar from '/src/Components/Navbar';
import FooterComponent from '/src/Components/Footer';

const DeliveryDashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.error('Usuario no autenticado');
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/pedidos/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        const data = await response.json();
        console.log('Respuesta de la API:', data);

        if (Array.isArray(data)) {
          setPedidos(data);
        } else {
          console.error('Formato de respuesta inesperado:', data);
          setError('Formato de respuesta inesperado');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
        setError('Error al obtener pedidos');
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const agarrarPedido = async (pedidoId) => {
    const token = localStorage.getItem('token');
    const repartidorId = localStorage.getItem('userId'); // Asume que el userId es el repartidor

    if (!token || !repartidorId) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/pedidos/elegir/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          repartidorId: repartidorId,
          estado_envio: 'En Proceso',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el pedido');
      }

      const updatedPedido = await response.json();
      console.log('Pedido actualizado:', updatedPedido);

      // Actualiza la lista de pedidos
      setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
              pedido.id === pedidoId ? { ...pedido, ...updatedPedido } : pedido
          )
      );
    } catch (err) {
      console.error('Error al actualizar el pedido:', err);
      setError('Error al actualizar el pedido');
    }
  };

  return (
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container mt-5 flex-grow-1">
          <h2 className="mb-4 text-center text-info fw-bold">Panel de Repartidor</h2>
          {loading && <p className="text-center">Cargando...</p>}
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="row">
            {Array.isArray(pedidos) &&
                pedidos.map((pedido) => (
                    <div key={pedido.id} className="col-md-4 mb-4">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">{pedido.cliente}</h5>
                          <p className="card-text">{pedido.direccion}</p>
                          <span
                              className={`badge ${
                                  pedido.estado_envio === 'En Proceso'
                                      ? 'bg-warning'
                                      : pedido.estado_envio === 'En Camino'
                                          ? 'bg-primary'
                                          : pedido.estado_envio === 'Entregado'
                                              ? 'bg-success'
                                              : 'bg-danger'
                              }`}
                          >
                      {pedido.estado_envio}
                    </span>
                        </div>
                        <div className="card-footer text-center">
                          {pedido.estado_envio === 'Pendiente' && (
                              <Button
                                  variant="success"
                                  onClick={() => agarrarPedido(pedido.id)}
                              >
                                Agarrar Pedido
                              </Button>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
          </div>
        </div>
        <FooterComponent />
      </div>
  );
};

export default DeliveryDashboard;
