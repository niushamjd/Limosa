import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ItineraryMap = () => {
  const googleMapRef = useRef(null);
  const googleMap = useRef(null);
  const navigate = useNavigate(); // This replaces useHistory()

  const cities = [
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
    { name: 'Izmir', lat: 38.4192, lng: 27.1287 },
    { name: 'Ankara', lat: 39.9334, lng: 32.8597 },
    { name: 'Antalya', lat: 36.8969, lng: 30.7133 },
  ];

  const initGoogleMap = () => {
    googleMap.current = new window.google.maps.Map(googleMapRef.current, {
      zoom: 6,
      center: { lat: 39.0, lng: 35.0 },
      mapId: "75614eb06537871e",
    });

    cities.forEach(city => {
      const marker = new window.google.maps.Marker({
        position: { lat: city.lat, lng: city.lng },
        map: googleMap.current,
        title: city.name,
      });

      marker.addListener('click', () => {
        navigate('/new-itinerary', { state: { destination: city.name } });
      });
    });
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8`;
      document.head.appendChild(script);

      script.onload = () => {
        initGoogleMap();
      };

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initGoogleMap();
    }
  }, []);

  return <div ref={googleMapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ItineraryMap;
