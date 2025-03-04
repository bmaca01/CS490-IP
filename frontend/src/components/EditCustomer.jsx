import { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ViewCustomerRentals from './ViewCustomerRentals'

function EditCustomerDialog({open, onClose, cust, endpoint}) {
  /**
   * customer schema: 
      active | address_id | create_date | customer_id | email | first_name | last_name | last_update | store_id
   */
  return (
    <Dialog
      maxWidth='lg'
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event) => { handleSubmit(event) },
        },
      }}
    >
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogContent>
        <Box sx={{ flexGrow: 1, p: 1}}>
          <Typography>{cust.first_name} {cust.last_name}</Typography>
          <Grid container spacing={1} sx={{ p: 1 }}>
            <Grid size={6}>

            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogTitle>Customer Rentals</DialogTitle>
      <DialogContent>
        <ViewCustomerRentals endpoint={endpoint} custID={cust.customer_id} open={open} />
      </DialogContent>
    </Dialog>
  );
};

function EditCustomer({editDiagOpen, setEditDiagOpen, cust, endpoint}) {
  const [selectedCust, setSelectedCust] = useState({});

  const handleClose = () => { setEditDiagOpen(false); };

  const handleSubmit = (e, data) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    console.log(formJson)

    /*TODO*/
    //axios.post(endpoint, formJson)
  };

  const fetchAPI = async () => {
    const response= await axios.get(endpoint, { params: {customer_id: cust} });
    console.log(response.data.customers[0]);
    setSelectedCust(response.data.customers[0]);
  };

  useEffect(() => {
    fetchAPI();
  }, [cust]);

  return (
    <>
      <EditCustomerDialog open={editDiagOpen} onClose={handleClose} cust={selectedCust} endpoint={endpoint} />
    </>
  );
};

export default EditCustomer;