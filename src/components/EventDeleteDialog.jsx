import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Remove from '@mui/icons-material/Delete';

export default function EventDeleteDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} style={{ background: 'white', color: '#f44336', padding: '0.2rem', minWidth: 0 }}>
        <Remove/>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure wants to delete ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div><b>Task :</b> {props.data.desc}</div>
            <div><b>Point :</b>{props.data.points}</div>
            <div><b>Date :</b> {new Date(props.data.date).toLocaleString()}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => props.handleEventDelete(props.data)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
