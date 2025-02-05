import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    marginTop: "100px",
    width: "80%",
    height: "80vh",
};

const initialOrigin = {
    lat: 25.686614,
    lng: -100.316113,
};

const initialDestination = {
    lat: 20.87380625221217,
    lng: -100.58816691932074,
};

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const Tracking = () => {
    const [origin, setOrigin] = useState(initialOrigin);
    const [destination, setDestination] = useState(initialDestination);
    const [route, setRoute] = useState([]); // Remove TypeScript type here

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["geometry", "places"],
    });

    // Get current location (can be modified as needed)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setDestination({ lat: latitude, lng: longitude });
                },
                (error) => console.error("Error obteniendo la ubicación:", error)
            );
        }
    }, []);

    // Calculate the route
    useEffect(() => {
        if (!isLoaded || !origin || !destination) return;

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result.routes.length > 0) {
                    const points = result.routes[0].overview_path.map((point) => ({
                        lat: point.lat(),
                        lng: point.lng(),
                    }));
                    setRoute(points);
                } else {
                    console.error("Error al calcular la ruta: " + status);
                }
            }
        );
    }, [isLoaded, origin, destination]);

    // Animate the marker along the route
    useEffect(() => {
        if (route.length === 0) return;

        let step = 0;

        const interval = setInterval(() => {
            setOrigin(route[step]); // Move the marker to the next point
            step++;

            if (step >= route.length) {
                clearInterval(interval); // Stop the animation when reaching the end
            }
        }, 990); // Adjust the interval for speed

        return () => clearInterval(interval); // Clean up when the component is unmounted
    }, [route]);

    return isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={15}>
            <Marker position={origin} label="Origen" />
            <Marker position={destination} label="Destino" />
            <Polyline
                path={route}
                options={{
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                }}
            />
        </GoogleMap>
    ) : (
        <p>Cargando mapa...</p>
    );
};

export default Tracking;
