import React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import History from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/FormatListBulleted';

export default function SimpleBottomNavigation(props) {
  return (
    <Box style={{ margin: '1rem 0', boxShadow: '0 0 1rem rgba(0, 0, 0, 0.5)', borderRadius: '1rem' }}>
      <BottomNavigation
        showLabels
        value={props.value}
        style={{ justifyContent: 'space-around'}}
        onChange={(event, newValue) => {
            props.navigate(newValue);
        }}
      >
        <BottomNavigationAction label="Tasks" icon={<FavoriteIcon fontSize='medium' />} />
        <BottomNavigationAction label="History" icon={<History fontSize='large' />} />
      </BottomNavigation>
    </Box>
  );
}
