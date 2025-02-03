import React from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EventDeleteDialog from './EventDeleteDialog';
import API from '../config';

const EventList = (props) => {
  const [eventRows, setEventRows] = React.useState([]);
  const [length, setLength] = React.useState(10);
  
  // get events from API in events 
  React.useEffect(() => {
    axios.get(API.BASE_URL('/events'), { withCredentials: true }).then((events) => {
      events.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEventRows(events.data);
    });
  }, []);

  const handleEventDelete = (data) => {
    props.updatePointsToAmount(-1, data.points);
    axios.delete(API.BASE_URL(`/events/${data._id}`), { withCredentials: true }).then((events) => {
      axios.get(API.BASE_URL('/events'), { withCredentials: true }).then((events) => {
        events.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEventRows(events.data);
      });
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: 'lightgrey' }}>
            <TableCell>Date</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventRows.slice(0, length).map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{(new Date(row.date)).toLocaleString()}</TableCell>
              <TableCell align="left">{row.desc}</TableCell>
              <TableCell align="right">{row.points}</TableCell>
              <TableCell align="right">
                <EventDeleteDialog 
                  data={row} 
                  handleEventDelete={handleEventDelete}
                />
              </TableCell>
            </TableRow>
          ))}
            <TableRow
              key={'more'}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell align="left" onClick={()=>setLength(length + 5)}>See more.....</TableCell>
            <TableCell></TableCell>
            <TableCell align="right" colSpan={2} onClick={()=>setLength(length - 5)}>See less.....</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventList;