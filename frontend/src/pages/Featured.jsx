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
                <Card className="Card" sx={{ maxWidth: 345, m: 2 }}>
                    {business.photo && (
                        <CardMedia
                            className="CardMedia"
                            component="img"
                            height="140"
                            image={business.photo}
                            alt={`Photo of ${business.name}`}
                        />
                    )}
                    <CardContent className="CardContent">
                        <Typography gutterBottom variant="h5" component="div">
                            {business.name}
                        </Typography>
                        
                        <div className="detail-section">
                                <Typography className="detail-label" variant="body2">Opening Hours:</Typography>
                                <Typography className="detail-content" variant="body2" component="div">
                                    {business.openingHours ? business.openingHours
                                        .replace(/^\[|\]$/g, '') // Removes leading and trailing brackets
                                        .replace(/"/g, '') // Removes double quotes
                                        .split(',')
                                        .map((hour, index) => (
                                            <div key={index}>{hour.trim()}</div>
                                        )) : 'N/A'}
                                </Typography>
                            </div>
                        <div className="detail-section">
                            <Typography className="detail-label" variant="body2">Contact:</Typography>
                            <Typography className="detail-content" variant="body2">
                                {business.contactDetails.phone || 'N/A'} | {business.contactDetails.email || 'N/A'}
                            </Typography>
                        </div>
                        <div className="detail-section">
    <Typography className="detail-label" variant="body2">Website:</Typography>
    <Typography className="detail-content" variant="body2">
        {business.contactDetails.website ? (
            <a href={business.contactDetails.website} target="_blank" rel="noopener noreferrer">
                {business.contactDetails.website}
            </a>
        ) : 'N/A'}
    </Typography>
</div>

                        <div className="detail-section">
                            <Typography className="detail-label" variant="body2">Address:</Typography>
                            <Typography className="detail-content" variant="body2">
                                {business.contactDetails.address && `${business.contactDetails.address.street}, ${business.contactDetails.address.city}, ${business.contactDetails.address.state}, ${business.contactDetails.address.zipCode}, ${business.contactDetails.address.country}`}
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);
};

export default Featured;
