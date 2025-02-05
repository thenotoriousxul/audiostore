import React, { useState } from "react";
import AutocompleteInput from "/src/Components/AutocompleteInput";

const MapPage = () => {
  const [location, setLocation] = useState(null);

  const handleSelect = (selectedLocation) => {
    console.log("Dirección seleccionada:", selectedLocation);
    setLocation(selectedLocation);
  };

  return (
    <div>
      <h2>Busca una dirección</h2>
      <AutocompleteInput onSelect={handleSelect} />

      {location && (
        <div>
          <p>
            Dirección: {location.address} <br />
            Coordenadas: {location.lat}, {location.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPage;
