import { useState, useEffect } from 'react';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const countries_endpoint = 'http://127.0.0.1:5000/countries';

function AddNewCustomerDialog({onClose, open, setFormInput, countries}) {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleChangeSelectedCountry = (e) => { setSelectedCountry(e.target.value); };

  return (
    <Dialog 
      onClose={onClose} 
      open={open}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event) => {
            setFormInput(event, selectedCountry);
          },
        },
      }}
    >
      <DialogTitle>Add a new customer</DialogTitle>
      <DialogContent>
        <Box sx={{ flexGrow: 1, p: 1 }} >
          <Grid container spacing={1} sx={{ p: 1 }}>
            <Grid size={6}> <TextField id="f-name" name="fname" label="First Name" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={6}> <TextField id="l-name" name="lname" label="Last Name" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={12}> <TextField id="email" name="email" label="Email" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={12}> <TextField id="phone" name="phone" label="Phone Number" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={12}> <TextField id="addr1" name="addr1" label="Address Line 1" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={12}> <TextField id="addr2" name="addr2" label="Address Line 2" variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
            <Grid size={12}> <TextField id="city" name="city" label="City" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={12}> <TextField id="district" name="district" label="District" variant="outlined" margin="normal" size="small" required fullWidth /> </Grid>
            <Grid size={12}>
              <FormControl size="small" fullWidth required >
                <InputLabel id="countries-label"> Country </InputLabel>
                <Select labelId="countries-label" id="countries" value={selectedCountry} label="Country" onChange={handleChangeSelectedCountry} margin="normal" >
                  {countries.map((country, idx) => ( 
                    <MenuItem value={country.country_id}>{country.country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}> <TextField id="zip" name="zip" label="Postal Code" variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
            <Grid size={2}>
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
            <Grid size={2}>
              <Button type="submit" variant="contained">Submit</Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

    </Dialog>
  );
};

function AddNewCustomer({endpoint}) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([])

  const handleSubmit = (e, data) => {
    e.preventDefault();

    const form = e.target;
    let formData = new FormData(form);
    formData.append("country", data);

    const formJson = Object.fromEntries(formData.entries());

    axios.post(endpoint, formJson);
  };

  const handleClickOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  const getCountries = async () => {
    const response = await axios.get(countries_endpoint);
    setCountries(response.data.countries);
  }

  useEffect(() => { getCountries(); }, []);

  return (
    <Box>
      <Button variant="contained" onClick={handleClickOpen} sx={{ m: 1 }} > Add New Customer </Button>
      <AddNewCustomerDialog open={open} onClose={handleClose} setFormInput={handleSubmit} countries={countries} />
    </Box>
  );
};

export default AddNewCustomer;