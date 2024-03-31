import React, { useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

function ItineraryMap() {
  const libraries = ["places"];
  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };
  const center = {
    lat: 39.9334, // Updated to Turkey's center coordinates
    lng: 32.8597, // Updated to Turkey's center coordinates
  };

  const cities = [
    { name: "Izmir", position: { lat: 38.4192, lng: 27.1287 } },
    { name: "Istanbul", position: { lat: 41.0082, lng: 28.9784 } },
    { name: "Antalya", position: { lat: 36.8969, lng: 30.7133 } },
    { name: "Ankara", position: { lat: 39.9334, lng: 32.8597 } }
  ];


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8',
    libraries,
  });

 

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6} // Adjust the initial zoom level as needed
        center={center}
      >
        {cities.map((city) => (
          <Marker
            key={city.name}
            position={city.position}
            title={city.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default ItineraryMap;
