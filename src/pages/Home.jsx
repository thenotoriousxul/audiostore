import React, { useState, useEffect } from 'react';
import NavbarComponent from '/src/Components/Navbar';
import '/main.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    AOS.init();
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos');
        const data = await response.json();
        const productosFiltrados = data.filter(producto => [1, 6, 11].includes(producto.id));
        setProductos(productosFiltrados);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-black text-white">
      <NavbarComponent cart={cart} />
      <main className="flex-grow-1">
        <section id="products" className="py-5 text-center">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start" data-aos="fade-right" data-aos-duration="1000">
                <h2 className="display-4 fw-bold">Sumérgete en el sonido</h2>
                <p className="fs-5 text-light">Encuentra los audífonos perfectos para cada ocasión.</p>
                <a 
                  href="/catalogo" 
                  className="btn btn-light btn-lg fw-bold shadow-lg mt-3"
                  data-aos="zoom-in" 
                  data-aos-delay="300"
                >
                  Explorar ahora
                </a>
              </div>

              <div className="col-md-6 d-flex justify-content-center mt-4 mt-md-0" data-aos="fade-left" data-aos-duration="1000">
                <img 
                  src="src/assets/Audifonosmodelo.jpeg" 
                  alt="Audífonos premium" 
                  className="img-fluid rounded shadow-lg"
                  style={{ maxWidth: '350px' }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
