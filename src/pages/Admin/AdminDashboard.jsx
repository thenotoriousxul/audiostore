import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "/src/Components/Navbar";
import FooterComponent from "/src/Components/Footer";

const pedidosIniciales = [
  {
    id: 1,
    cliente: "Juan Pérez",
    direccion: "Av. Revolución 123",
    estado: "Pendiente",
    fecha: "2023-10-01",
    repartidor: "Sin asignar",
    detalles: [
      {
        imagen: "https://martinguitarmexico.com/wp-content/uploads/2022/02/martin-guitarras-D-42-modern-deluxe-1.jpg",
        nombre: "Guitarra Acústica Fender",
        descripcion: "Guitarra de madera de alta calidad con un sonido excepcional.",
        cantidad: 1,
        precio: 1200.00,
      },
      {
        imagen: "https://i5.walmartimages.com/asr/08756097-cef4-402c-b715-504741840605.05eeebc0f0801be3092cd1d44a4d2f88.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        nombre: "Amplificador Marshall",
        descripcion: "Amplificador de 50W ideal para conciertos en vivo.",
        cantidad: 2,
        precio: 300.00,
      },
      {
        imagen: "https://www.guitargear.com.mx/tienda/images/detailed/47/me-90_gal_02.jpg",
        nombre: "Pedalera de efectos Boss",
        descripcion: "Pedalera multi-efectos para guitarra con sonidos profesionales.",
        cantidad: 1,
        precio: 500.00,
      }
    ],
  },
];

const estados = ["Pendiente", "En Proceso", "En Camino", "Entregado"];
const estadoColores = {
  "Pendiente": "bg-warning text-white",
  "En Proceso": "bg-primary",
  "En Camino": "bg-warning text-white",
  "Entregado": "bg-success",
};

const AdminDashboard = () => {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [showModal, setShowModal] = useState(false);
  const [detallesPedido, setDetallesPedido] = useState([]);

  const verDetalles = (detalles) => {
    setDetallesPedido(detalles);
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const cambiarEstado = (id, accion) => {
    setPedidos((prev) => prev.map((p) => {
      if (p.id === id) {
        const estadoIndex = estados.indexOf(p.estado);
        let nuevoEstado = p.estado;

        if (accion === "aceptar" && p.estado === "Pendiente") {
          nuevoEstado = "En Proceso";
        } else if (accion === "recojido" && p.estado === "En Proceso") {
          nuevoEstado = "En Camino";
        }

        return { ...p, estado: nuevoEstado };
      }
      return p;
    }));
  };

  const totalCantidad = detallesPedido.reduce((acc, producto) => acc + producto.cantidad, 0);
  const totalPrecio = detallesPedido.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarComponent />
      <nav className="container mt-3">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item"><Link to="/pedidos" className="nav-link active">Pedidos</Link></li>
          <li className="nav-item"><Link to="/admin/createproducts" className="nav-link">Agregar Productos</Link></li>
          <li className="nav-item"><Link to="/registroempleado" className="nav-link">Registrar Empleados</Link></li>
        </ul>
      </nav>
      <main className="flex-grow-1 container mt-4">
        <h2 className="text-center mb-4 text-primary">Panel de Administrador</h2>
        <div className="row">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="col-md-4 mb-4">
              <div className="card shadow-lg rounded border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark">{pedido.cliente}</h5>
                  <p className="card-text text-muted">{pedido.direccion}</p>
                  <p className="card-text"><small className="text-secondary">Fecha: {pedido.fecha}</small></p>
                  <p className="card-text">Repartidor: <strong>{pedido.repartidor}</strong></p>
                  <span className={`badge py-2 px-3 ${estadoColores[pedido.estado]}`}>{pedido.estado}</span>
                </div>
                <div className="card-footer text-center bg-white border-0">
                  <button className="btn btn-info btn-sm me-2 text-white" onClick={() => verDetalles(pedido.detalles)}>Ver Detalles</button>
                  {pedido.estado === "Pendiente" && (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => cambiarEstado(pedido.id, "aceptar")}>Aceptar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => cambiarEstado(pedido.id, "denegar")}>Denegar</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal show={showModal} onHide={cerrarModal} centered size="lg">
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>Detalles del Pedido</Modal.Title>
  </Modal.Header>
  <Modal.Body className="p-4 bg-light">
    <div className="d-flex flex-wrap justify-content-start">
      {detallesPedido.map((producto, index) => (
        <div key={index} className="d-flex align-items-center border rounded p-3 me-3 mb-3 shadow-sm" style={{ minWidth: "250px", maxWidth: "300px", backgroundColor: "#f8f9fa" }}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-lg me-3"
            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
          />
          <div>
            <h6 className="fw-bold text-dark m-0">{producto.nombre}</h6>
            <p className="small text-muted m-0">{producto.descripcion}</p>
            <p className="fw-bold m-0">Cantidad: {producto.cantidad}</p>
            <p className="fw-bold m-0">${(producto.cantidad * producto.precio).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  </Modal.Body>
  <Modal.Footer className="bg-primary text-white">
    <div className="w-100 d-flex justify-content-between align-items-center">
      <div>
        <p className="fw-bold mb-1">Total de productos: {totalCantidad}</p>
        <p className="fw-bold mb-1">Total: ${totalPrecio.toFixed(2)}</p>
      </div>
      <Button variant="secondary" onClick={cerrarModal} className="text-white" style={{ backgroundColor: "#0056b3", borderColor: "#0056b3" }}>
        Cerrar
      </Button>
    </div>
  </Modal.Footer>
</Modal>


      </main>
      <FooterComponent />
    </div>
  );
};

export default AdminDashboard;
