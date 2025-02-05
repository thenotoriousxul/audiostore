import React, { useEffect, useState } from 'react';

const OrdersHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                setError('Usuario no autenticado');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/pedidos/repartidor', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    const errorData = await response.json();
                    console.error('Error al obtener los pedidos:', errorData);
                    setError(errorData.message || 'Error al obtener los pedidos');
                }

            } catch (error) {
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p style={{ color: '#f8f8f2', textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '18px' }}>Cargando historial de pedidos...</p>;
    if (error) return <p style={{ color: '#ff5555', textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '18px' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#282a36', minHeight: '100vh', color: '#f8f8f2', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Historial de Pedidos</h1>

            {orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6272a4' }}>No hay pedidos para mostrar.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            style={{ backgroundColor: '#44475a', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', border: '1px solid #6272a4' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Pedido #{order.id}</h2>
                            <p><span style={{ fontWeight: 'bold', color: '#8be9fd' }}>Estado de envío:</span> {order.estado_envio}</p>
                            <p><span style={{ fontWeight: 'bold', color: '#8be9fd' }}>Estado de pago:</span> {order.estado_pago}</p>
                            <p><span style={{ fontWeight: 'bold', color: '#8be9fd' }}>Dirección:</span> {order.direccion}</p>
                            <p><span style={{ fontWeight: 'bold', color: '#8be9fd' }}>Fecha de realización:</span> {new Date(order.fecha_realizacion).toLocaleString()}</p>
                            <p><span style={{ fontWeight: 'bold', color: '#8be9fd' }}>Fecha de entrega:</span> {order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleString() : 'Pendiente'}</p>
                            <p><span style={{ fontWeight: 'bold', color: '#8be9fd' }}>Repartidor ID:</span> {order.repartidorId}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersHistory;