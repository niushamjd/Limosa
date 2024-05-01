import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
} from "@mui/material";
import { red, deepOrange } from "@mui/material/colors";
import {
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { DataGridPro } from '@mui/x-data-grid-pro';
import { BASE_URL } from "../utils/config";


function Itinerary() {
  const location = useLocation();
  const locationState = location.state || {};
  const [itinerary, setItinerary] = useState(locationState.itinerary);
  const mapRef = useRef(null);

  const loadGoogleMaps = (callback) => {
    if (window.google) {
      callback();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8`;
      document.head.appendChild(script);
      script.onload = () => {
        callback(); // Initialize map after the script is loaded
      };
    }
  };
  const handleRowOrderChange = async (params) => {
    const { oldIndex, targetIndex, field } = params;
    const date = field.split('.')[0]; // Assuming the field naming is 'date.period'
    const period = field.split('.')[1];
    const updatedRows = await updateRowPosition(oldIndex, targetIndex, itinerary.itineraryEvents[date][period]);
    const updatedItinerary = { ...itinerary };
    updatedItinerary.itineraryEvents[date][period] = updatedRows;
    setItinerary(updatedItinerary);
  };

  const updateRowPosition = (initialIndex, newIndex, rows) => {
    const rowsClone = [...rows];
    const row = rowsClone.splice(initialIndex, 1)[0];
    rowsClone.splice(newIndex, 0, row);
    return rowsClone;
  };
  const initMap = () => {
    if (!itinerary || !mapRef.current) return;

    let centerLat = 37.7749; // Default latitude
    let centerLng = -122.4194; // Default longitude
    let firstEventFound = false;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: centerLat, lng: centerLng },
    });

    Object.entries(itinerary.itineraryEvents).forEach(([date, dailyEvents]) => {
      ['morning', 'afternoon', 'evening'].forEach(period => {
        dailyEvents[period]?.forEach(event => {
          if (event.coordinates && !firstEventFound) {
            centerLat = event.coordinates.latitude;
            centerLng = event.coordinates.longitude;
            map.setCenter({ lat: centerLat, lng: centerLng });
            firstEventFound = true; // Ensures that the map centers on the first event found
          }
          if (event.coordinates) {
            new window.google.maps.Marker({
              position: { lat: event.coordinates.latitude, lng: event.coordinates.longitude },
              map: map,
              title: event.name,
            });
          }
        });
      });
    });
  };

  useEffect(() => {
    // Ensure that 'itinerary' is not null or undefined before attempting to access its properties
    if (window.google && itinerary && itinerary.itineraryEvents) {
        initMap();
    } else if (!window.google && itinerary) {
        loadGoogleMaps(initMap);
    }
}, [location.state.itinerary, itinerary]); // Dependency array includes itinerary to reinitialize the map on data change

  if (!itinerary) {
    return <div>No itinerary data found.</div>;
  }



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleDelete = async (date, period = null, eventName = null) => {
    const isDeletingDay = !period && !eventName; // Check that both are null to decide to delete the whole day
    const body = isDeletingDay
      ? { itineraryId: itinerary._id, date, deleteType: "day" }
      : {
          itineraryId: itinerary._id,
          date,
          period,
          eventName,
          deleteType: "part",
        };

    try {
      const response = await fetch(`${BASE_URL}/itinerary/delete-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok)
        throw new Error(`Failed to delete: ${response.statusText}`);
      console.log("Deletion successful");

      // Update state to reflect the changes
      if (isDeletingDay) {
        const updatedItinerary = { ...itinerary };
        delete updatedItinerary.itineraryEvents[date];
        setItinerary(updatedItinerary);
      } else {
        const updatedItinerary = { ...itinerary };
        updatedItinerary.itineraryEvents[date][period] =
          updatedItinerary.itineraryEvents[date][period].filter(
            (event) => event.name !== eventName
          );
        setItinerary(updatedItinerary);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", mt: 8 }}>
      <Box sx={{ flex: 1, overflowY: "auto", pr: 2 }}>
        <Typography variant="h4">Your Itinerary</Typography>
        {Object.entries(itinerary.itineraryEvents).map(([date, periods]) => (
  <Accordion key={date}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <LocationOnIcon style={{ color: "orange" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography style={{ marginLeft: "8px" }}>
          {formatDate(date)}
        </Typography>
        <Button
          onClick={() => handleDelete(date)} // This deletes the entire day
          variant="contained"
          color="error"
          sx={{ borderRadius: "16px" }}
        >
          Delete Day
        </Button>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      {Object.entries(periods).map(([period, activities]) => (
        <Box key={period} sx={{ marginTop: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.5rem", // Increased font size
                      fontWeight: 600, // Semi-bold for emphasis
                      color: "#1e1930", // Using a bold color for contrast
                      backgroundColor: "#FAA935", // Light background color
                      padding: "8px", // Padding for comfort
                      borderRadius: "4px", // Rounded corners for smooth edges
            }}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGridPro
              rows={activities}
              columns={[
                { field: 'name', headerName: 'Event', width: 150 },
                { field: 'activity', headerName: 'Activity', width: 150 },
                {
                  field: 'delete',
                  headerName: 'Delete',
                  sortable: false,
                  width: 110,
                  renderCell: (params) => (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(date, period, params.row.name)}
                    >
                      Delete
                    </Button>
                  ),
                }
              ]}
              rowReordering
              onRowOrderChange={(params) => handleRowOrderChange({
                ...params,
                field: `${date}.${period}` // Passing date and period for state updates
              })}
              getRowId={row => row.name}  // Ensure names are unique
              disableColumnMenu
              hideFooter
              autoHeight
            />
          </div>
        </Box>
      ))}
    </AccordionDetails>
  </Accordion>
))

        }
      </Box>
      <Box sx={{ flex: 1, minHeight: '100%' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      </Box>
    </Box>
  );
}

export default Itinerary;