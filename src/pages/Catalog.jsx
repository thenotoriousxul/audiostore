import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import NavbarComponent from '/src/Components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '/main.css';

function Catalogo() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    AOS.init();
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos');
        const data = await response.json();
        const updatedItems = data.map(item => ({
          ...item,
          quantity: cart[item.id] || 0
        }));
        setItems(updatedItems);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [cart]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleQuantityChange = (id, amount) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = (item.quantity || 0) + amount;
          return { ...item, quantity: Math.max(0, Math.min(newQuantity, 3)) };
        }
        return item;
      });
    });
  };

  const handleAddToCart = (id) => {
    setCart((prevCart) => {
      const item = items.find((item) => item.id === id);
      if (item && item.quantity > 0) {
        return { ...prevCart, [id]: item.quantity };
      }
      return prevCart;
    });
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredItems = selectedCategory
      ? items.filter(item => item.categoria && item.categoria.nombre === selectedCategory)
      : items;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const uniqueCategories = [...new Set(items.map(item => item.categoria && item.categoria.nombre).filter(Boolean))];

  return (
      <div className="d-flex flex-column min-vh-100 bg-black text-white">
        <NavbarComponent cart={cart} />
        <div className="container my-5">
          <h2 className="mb-4 text-center text-white fw-bold">Catálogo de productos</h2>

          <Form.Group controlId="categorySelect" className="mb-4">
            <Form.Label className="h5">Filtrar por Categoría</Form.Label>
            <Form.Control
                as="select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="form-control-lg shadow-sm"
                data-aos="fade-up"
            >
              <option value="">Todas las categorías</option>
              {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {currentItems.map((item) => (
                <Col key={item.id}>
                  <Card className="shadow-lg rounded" style={{ height: '100%', backgroundColor: '#1e1e2f', color: '#ffffff' }} data-aos="zoom-in" data-aos-duration="1000">
                    <Card.Img
                        variant="top"
                        src={item.imagepath}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f8f8', borderRadius: '8px' }}
                    />
                    <Card.Body>
                      <Card.Title className="text-center text-uppercase" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.nombre}</Card.Title>
                      <Card.Text className="text-center text-muted">{item.descripcion}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-bold" style={{ fontSize: '1.1rem' }}>${item.precio}</span>
                        <div className="d-flex align-items-center">
                          <Button
                              variant={item.quantity > 0 ? "primary" : "secondary"}
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 0 || cart[item.id]}
                          >
                            -
                          </Button>
                          <span className="mx-2 fw-bold" style={{ fontSize: '1rem' }}>{item.quantity || 0}</span>
                          <Button
                              variant="primary"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={item.quantity >= 3 || cart[item.id]}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                          variant="dark"
                          className="mt-3 w-100 text-white"
                          style={{ backgroundColor: '#212121', borderColor: '#212121', fontWeight: 'bold' }}
                          onClick={() => handleAddToCart(item.id)}
                          disabled={cart[item.id]}
                      >
                        {cart[item.id] ? 'Añadido' : 'Agregar al carrito'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
            ))}
          </Row>

          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages).keys()].map(number => (
                <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => handlePageChange(number + 1)}
                    style={{ backgroundColor: '#1e1e2f', color: '#ffffff', borderColor: '#444' }}
                >
                  {number + 1}
                </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
  );
}

export default Catalogo;
