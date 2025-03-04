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

import CustomerRentalsTable from './CustomerRentalsTable';

function ViewCustomerRentals({ endpoint, custID, open }) {
  const [custRentals, setCustRentals] = useState([{}]);

  const fetchAPI = async () => {
    const response = await axios.get(endpoint + '/' + custID);
    console.log(response.data.details);
    setCustRentals(response.data.details);
  };

  useEffect(() => {
    fetchAPI();
  }, [open]);

  return(
    <>
      <CustomerRentalsTable rows={custRentals} />
    </>
  );
};


export default ViewCustomerRentals;