import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function CustomCard({ title, description, additionalInfo, imageSrc }) {
  return (
    <Box
      sx={{
        display: 'flex', // İçeriği yatay olarak hizalar
        alignItems: 'center', // Ortadan hizalama
        backgroundColor: '#f0f0f0', // Gri arka plan
        borderRadius: '12px', // Yuvarlak köşeler
        padding: '16px', // İç boşluk
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Hafif gölge
        marginBottom: '16px', // Alt boşluk
      }}
    >
      {/* Fotoğraf penceresi */}
      {imageSrc && (
        <Box
          component="img"
          src={imageSrc}
          alt="Activity Image"
          sx={{
            width: '100px', // Fotoğraf genişliği
            height: '100px', // Fotoğraf yüksekliği
            borderRadius: '8px', // Yuvarlak köşeler
            marginRight: '16px', // Sağ boşluk
            objectFit: 'cover', // Fotoğraf içeriği kaplamak için
          }}
        />
      )}

      {/* Metin içeriği */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{description}</Typography>
        {additionalInfo && (
          <Typography variant="body2" sx={{ color: 'gray', marginTop: '8px' }}>
            {additionalInfo}
          </Typography>
        )}
      </Box>

      {/* Silme düğmesi */}
      <Button
        size="small"
        startIcon={<DeleteIcon />}
        style={{ marginLeft: '10px' }}
      >
        Delete
      </Button>
    </Box>
  );
}

export default CustomCard;
