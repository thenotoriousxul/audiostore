import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "80vh",
};

const initialOrigin = { lat: 25.54387, lng: -103.40678 }; // Torreón centro
const initialDestination = { lat: 25.5375, lng: -103.4000 }; // Destino en Torreón

const GOOGLE_MAPS_API_KEY = "TU_API_KEY";

const TrackingMap = () => {
    const [origin, setOrigin] = useState(initialOrigin);
    const [destination] = useState(initialDestination);
    const [route, setRoute] = useState([]);
    const [estimatedTime, setEstimatedTime] = useState("Calculando...");
    
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["geometry", "places"],
    });

    useEffect(() => {
        if (!isLoaded) return;

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
    }, [isLoaded]);

    useEffect(() => {
        if (route.length === 0) return;

        let step = 0;
        let remainingTime = parseInt(estimatedTime); 

        const interval = setInterval(() => {
            if (step < route.length) {
                setOrigin(route[step]);
                step++;
                remainingTime = Math.max(remainingTime - 1, 0);
                setEstimatedTime(`${remainingTime} min`);
            } else {
                clearInterval(interval);
                alert("El repartidor ha llegado a su destino");
            }
        }, 2000); // Movimiento más lento

        return () => clearInterval(interval);
    }, [route]);

    return isLoaded ? (
        <div>
            <h2 className="text-center">Seguimiento del Pedido</h2>
            <p className="text-center">Tiempo estimado de llegada: {estimatedTime}</p>
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
        </div>
    ) : (
        <p>Cargando mapa...</p>
    );
};

export default TrackingMap;
