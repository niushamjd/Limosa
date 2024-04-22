import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import { LocationOn as LocationOnIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { BASE_URL } from "../utils/config";
import CustomCard from './CustomCard';

function Itinerary() {
  const location = useLocation();
  const { itinerary } = location.state || {}; // Ensure fallback to prevent errors
  console.log("Itinerary object:", itinerary);
  console.log("Itinerary ID:", itinerary._id);
  console.log("Itinerary Events:", itinerary.itineraryEvents);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
  };

  if (!itinerary) {
    return <div>No itinerary data found.</div>; // Handling case where itinerary is not present
  }

  const handleDelete = async (date, period, eventName) => {
    console.log("Deleting event with ID:", itinerary._id, " Event: ", eventName);
    try {
      const response = await fetch(`${BASE_URL}/itinerary/delete-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          itineraryId: itinerary._id,
          date,
          period,
          eventName
        }),
      });
      if (!response.ok) throw new Error(`Failed to delete event: ${response.statusText}`);
      console.log('Event deleted successfully');
      // Optionally trigger a re-fetch or update local state to reflect changes
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', mt: 8 }}>
      {/* Sol taraf - İçerik */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 2 }}>
        <Typography variant="h4">Your Itinerary</Typography>
        {Object.entries(itinerary.itineraryEvents).map(([date, periods]) => (
          <Accordion key={date}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <LocationOnIcon style={{ color: 'orange' }} />
              <Typography style={{ marginLeft: '8px' }}>{formatDate(date)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(periods).map(([period, activities]) => (
                <Box key={period}>
                  <Typography variant="h6">{period.charAt(0).toUpperCase() + period.slice(1)}</Typography>
                  {activities.map((activity, index) => (
                    <CustomCard
                      key={index}
                      title={activity.name} // Başlık üstte
                      description={activity.activity} // Açıklama altta
                      imageSrc={activity.photo} // Opsiyonel fotoğraf
                    >
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(date, period, activity.name)}
                      >
                        Delete
                      </Button>
                    </CustomCard>
                  ))}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Sağ taraf - Harita */}
      <Box sx={{ flex: 1, minHeight: '100%' }}>
        {/* Google Maps iframe */}
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.4920654559354!2d-122.4194157!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064!2zU2FuIEZyYW5jaXNjbywgQ0Eg!5e0!3m2!1sen!2sus!4v1641861192787"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 'none' }}
          allowFullScreen
        />
      </Box>
    </Box>
  );
}

export default Itinerary;