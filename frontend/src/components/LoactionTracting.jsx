import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LoadScript, GoogleMap, OverlayView } from '@react-google-maps/api';
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoom, setZoom] = useState(5); // Start with a zoomed-out view
  const mapRef = useRef(null);
  const firstLoad = useRef(true);
  const REFRESH_INTERVAL = 10000; // 10 seconds

  const containerStyle = {
    width: '100%',
    height: '600px',
  };

  const defaultCenter = { lat: 28.7041, lng: 77.1025 };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const getCurrentLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentPosition(newPosition);
            
            if (mapRef.current) {
              // Smooth zoom animation on first load
              if (firstLoad.current) {
                firstLoad.current = false;
                mapRef.current.panTo(newPosition);
                
                // Gradually increase zoom level
                let currentZoom = 12;
                const targetZoom = 18;
                const zoomInterval = setInterval(() => {
                  if (currentZoom < targetZoom) {
                    currentZoom++;
                    setZoom(currentZoom);
                  } else {
                    clearInterval(zoomInterval);
                  }
                }, 100);
              }
            }
          },
          (error) => console.error('Error getting location:', error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      }
    };

    getCurrentLocation();
    const intervalId = setInterval(getCurrentLocation, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || defaultCenter}
          zoom={zoom} // Use dynamic zoom level
          options={options}
          onLoad={onLoad}
        >
          {currentPosition && isLoaded && (
            <OverlayView
              position={currentPosition}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -height
              })}
            >
              <div className="custom-marker">
                <FaMapMarkerAlt size={32} color="#141414" />
              </div>
            </OverlayView>
          )}
        </GoogleMap>
      </LoadScript>

      <style>{`
        .map-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
        .custom-marker svg {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
      `}</style>
    </div>
  );
};

export default LocationTracking;
