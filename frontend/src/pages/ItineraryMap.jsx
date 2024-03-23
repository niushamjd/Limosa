import React, { useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

function ItineraryMap() {
  const libraries = ["places"];
  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };
  const center = {
    lat: 41.0082,
    lng: 28.9784,
  };

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8',
    libraries,
  });

  const handleMapClick = async (event) => {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setSelectedLocation(latLng);

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8`);
      const data = await response.json();
      const name = data.results[0].formatted_address;
      setLocationName(name);
      console.log(name);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
      {locationName && <p>Clicked Location: {locationName}</p>}
    </div>
  );
}

export default ItineraryMap;
