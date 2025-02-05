import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '/src/Components/Navbar';
import MapSelector from '/src/Components/MapSelector';
import '/main.css';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || {});
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await fetch('http://localhost:3000/auth/me', {
            headers: { 'x-access-token': token }
          });
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, []);



  

  const handleQuantityChange = (id, amount) => {
    setCart(prevCart => {
      const newQuantity = (prevCart[id] || 0) + amount;
      if (newQuantity <= 0) {
        const { [id]: _, ...rest } = prevCart;
        return rest;
      }
      return { ...prevCart, [id]: Math.min(newQuantity, 3) };
    });
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const cartItems = items.filter(item => cart[item.id]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddressChange = (e) => setAddress(e.target.value);

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setAddress(location.address); // Guarda la dirección seleccionada
  };

  const handleRealizarPedido = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar un pedido");
      return;
    }
  
    if (!selectedLocation) {
      alert("Debes seleccionar una ubicación en el mapa");
      return;
    }
  
    const pedido = {
      fecha_realizacion: new Date(),
      clienteId: user.id,
      direccion: address,
      coordenadas: { lat: selectedLocation.lat, lng: selectedLocation.lng }, // Ahora es un objeto con lat y lng
      estado_envio: "Pendiente",
      estado_pago: "Pendiente",
      forma_pagoId: 1,
      detalles: items
        .filter((item) => cart[item.id])
        .map((item) => ({
          productoId: item.id,
          cantidad: cart[item.id],
          precio: item.precio,
        })),
    };
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(pedido),
      });
  
      if (response.ok) {
        setCart({});
        localStorage.removeItem("cart");
        setShowModal(false);
  
        navigate("/seguimiento", { state: { destination: pedido.coordenadas } }); // 🔥 Ahora enviamos la ubicación seleccionada
      } else {
        const errorData = await response.json();
        console.error("Error al realizar el pedido:", errorData);
      }
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-black text-white">
      <NavbarComponent cart={cart} />
      <div className="container my-5">
        <h2 className="mb-4 text-center text-white fw-bold">Carrito de compras</h2>
        {cartItems.length > 0 ? (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {cartItems.map(item => (
              <Col key={item.id}>
                <Card className="shadow-lg rounded card-equal-height">
                  <Card.Img variant="top" src={item.imagepath} className="card-img-top" />
                  <Card.Body>
                    <Card.Title className="text-center text-uppercase">{item.nombre}</Card.Title>
                    <Card.Text className="text-center text-muted">{item.descripcion}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-primary fw-bold">${item.precio}</span>
                      <div className="d-flex align-items-center">
                        <Button 
                          variant={cart[item.id] > 0 ? "primary" : "secondary"} 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={cart[item.id] <= 0}
                        >
                          -
                        </Button>
                        <span className="mx-2 fw-bold">{cart[item.id] || 0}</span>
                        <Button 
                          variant="primary" 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          disabled={cart[item.id] >= 3}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button variant="danger" className="mt-3 w-100" onClick={() => handleQuantityChange(item.id, -cart[item.id])}>
                      Eliminar del carrito
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Aún no hay productos en tu carrito.</Card.Title>
            </Card.Body>
          </Card>
        )}
        {cartItems.length > 0 && (
          <div className="text-center mt-4">
            <Button variant="success" size="lg" onClick={handleShowModal}>
              Realizar Compra
            </Button>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mt-3 w-100">
            <Form.Label>Ingresa tu Dirección</Form.Label>
            <Form.Control type="text" value={address} onChange={handleAddressChange} />
          </Form.Group>
          <MapSelector onSelectLocation={handleSelectLocation} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleRealizarPedido}>Realizar Pedido</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cart;