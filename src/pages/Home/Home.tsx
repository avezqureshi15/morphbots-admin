import React from 'react';
import { Box, Typography } from '@mui/material';

const Home: React.FC = () => {

  return (
    <Box
      component='div'
      sx={{
        height: '100vh',
        padding: '0 ',
      }}
    >
      <Box
        component='div'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #EAEBF4',
          marginBottom: '20px',
          paddingBottom: '7px',
          padding: '10px 50px 10px 35px'
        }}
      >
        <Typography
          variant='h6'
          align='left'
          gutterBottom
          sx={{ margin: '5px', fontWeight: 700, color: '#000', fontSize: '19px' }}
        >
          Home
        </Typography>

      </Box>

    </Box>

  );
};

export default Home;
