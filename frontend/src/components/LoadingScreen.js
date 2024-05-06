import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white'
      }}
    >
      <CircularProgress size={70} thickness={4.5} sx={{ color: '#1e1930' }} /> {/* Turuncu renkli spinner */}
      <Typography variant="h6" sx={{ mt: 2, color: '#ff7e01', fontWeight: 550 }}>
        Loading...
      </Typography>
    </Box>
  );
}

export default LoadingScreen;
