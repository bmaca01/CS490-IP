import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function RentFilm({ setCustId, inventoryId }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (d) => {
    setCustId(d)
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Rent
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              formData.append("inventory_id", inventoryId);
              const formJson = Object.fromEntries(formData.entries());
              handleClose(formJson);
            },
          },
        }}
      >
        <DialogTitle>Rent Film to Customer?</DialogTitle>
        <DialogContent>
          <DialogContentText> Enter Customer ID </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="cid"
            label="Customer ID"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};