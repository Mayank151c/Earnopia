import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'white' }}>
        <CircularProgress />
        <p style={{ fontSize: '1.1rem', marginTop: '1rem'}}>Loading...</p>
      </Box>
    </>
  );
}