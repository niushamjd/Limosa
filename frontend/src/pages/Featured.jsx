import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { BASE_URL } from '../utils/config';
import "../styles/featured.css"; // Ensure to include necessary styles

const Featured = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/business`);
        if (response.ok) {
          const data = await response.json();
          setBusinesses(data.data.filter(business => business.premium)); // Filter for premium businesses
        } else {
          throw new Error('Failed to fetch businesses');
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <Grid container spacing={2} className="featured-grid">
      {businesses.map(business => (
        <Grid item key={business._id} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ maxWidth: 345, m: 2 }}>
            {business.photo && (
              <CardMedia
                component="img"
                height="140"
                image={business.photo}
                alt={`Photo of ${business.name}`}
              />
            )}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {business.name}
              </Typography>
              {business.type && <Typography variant="body2" color="text.secondary">Type: {business.type}</Typography>}
              {business.openingHours && <Typography variant="body2" color="text.secondary">Opening Hours: {business.openingHours}</Typography>}
              <Typography variant="body2" color="text.secondary">
                Contact: {business.contactDetails.phone || 'N/A'} | {business.contactDetails.email || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Website: {business.contactDetails.website || 'N/A'}
              </Typography>
              {business.contactDetails.address && (
                <Typography variant="body2" color="text.secondary">
                  Address: {`${business.contactDetails.address.street}, ${business.contactDetails.address.city}, ${business.contactDetails.address.state}, ${business.contactDetails.address.zipCode}, ${business.contactDetails.address.country}`}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Featured;
