import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const initialOrigin = { lat: 25.54387, lng: -103.40678 }; // Torreón centro
const GOOGLE_MAPS_API_KEY = "TU_API_KEY";

const TrackingMap = () => {
  const location = useLocation();
  const destination = location.state?.destination || initialOrigin; // Usa la ubicación seleccionada o un valor por defecto

  const [origin, setOrigin] = useState(initialOrigin);
  const [route, setRoute] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState("Calculando...");

  // Carga de la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Si necesitas alguna librería adicional
  });

  useEffect(() => {
    if (!isLoaded) return; // Asegúrate de que la API esté cargada

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const points = result.routes[0].overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }));
          setRoute(points);

          let durationInSeconds = result.routes[0].legs[0].duration.value;
          setEstimatedTime(`${Math.ceil(durationInSeconds / 60)} min`);
        }
      }
    );
  }, [isLoaded, destination, origin]); // Dependencias actualizadas

  if (!isLoaded) {
    return <p>Cargando mapa...</p>; // Muestra un mensaje hasta que la API esté cargada
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={15}>
      <Marker position={origin} label="📦 Repartidor" />
      <Marker position={destination} label="📍 Destino" />
      <Polyline
        path={route}
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        }}
      />
    </GoogleMap>
  );
};

export default TrackingMap;
