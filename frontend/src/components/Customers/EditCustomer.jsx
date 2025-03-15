import { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { red } from '@mui/material/colors';

//import ViewCustomerRentals from './ViewCustomerRentals'
import CustomerRentalsTable from './CustomerRentalsTable';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteCustomer from './DeleteCustomer';

const endpoint2 = '127.0.0.1:5000/rental_return';

function EditCustomerDialog({open, onClose, cust, endpoint, setFormInput, countries}) {
  /**
   * customer schema: 
      active | address_id | create_date | customer_id | email | first_name | last_name | last_update | store_id
   */
  const [selectedCountry, setSelectedCountry] = useState(cust.country_id | 1);
  const [value, setValue] = useState('1');
  const [custRentals, setCustRentals] = useState([{}]);
  const [checked, setChecked] = useState(cust.active === 1);
  const [rentalId, setRentalId] = useState(0);

  const fetchAPI = async () => {
    const response = await axios.get(endpoint + '/' + cust.customer_id);
    setCustRentals(response.data.details);
  };

  const updateRental = async () => {
    if (rentalId !== 0) {
      axios.put(endpoint2 + '/' + cust.customer_id, rentalId)
    }

  };

  const handleCheckChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleDelete = (e) => {
    axios.delete(endpoint + '/' + cust.customer_id)
      .then(window.location.reload());
    onClose();
  };

  const handleClose = () => {
    setValue('1');
    onClose();
  };

  const handleChangeSelectedCountry = (e) => { 
    console.log(e.target.value);
    setSelectedCountry(e.target.value); 
  };

  useEffect(() => {
    console.log(rentalId);
    updateRental();

  }, [rentalId])

  useEffect(() => {
    setSelectedCountry(cust.country_id);
  }, [cust])

  useEffect(() => {
    fetchAPI();
    setChecked(cust.active === 1);
  }, [open]);

  return (
    <Dialog
      maxWidth='lg'
      onClose={handleClose}
      open={open}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event) => { setFormInput(event, selectedCountry, checked) },
        },
      }}
    >
    <DialogTitle>Customer Details</DialogTitle>
    <DialogContent sx={{ height: '100%' }}>
        <Box sx={{ flexGrow: 1, p: 1 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="Edit Customer" value="1" />
                <Tab label="View Rentals" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={1} sx={{ p: 1 }}>
                <Grid size={2}> <TextField id="f-name" name="fname" label="First Name" defaultValue={cust.first_name} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="l-name" name="lname" label="Last Name" defaultValue={cust.last_name} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="email" name="email" label="Email" defaultValue={cust.email} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="phone" name="phone" label="Phone Number" defaultValue={cust.phone} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="addr1" name="addr1" label="Address Line 1" defaultValue={cust.address} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="addr2" name="addr2" label="Address Line 2" defaultValue={cust.address2} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="city" name="city" label="City" defaultValue={cust.city} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}> <TextField id="district" name="district" label="District" defaultValue={cust.district} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}>
                  <FormControl size="small" fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="countries-label"> Country </InputLabel>
                    <Select labelId="countries-label" id="countries" value={selectedCountry} label="Country" onChange={handleChangeSelectedCountry} margin="normal">
                      {countries.map((country, idx) => (
                        <MenuItem value={country.country_id}>{country.country}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={2}> <TextField id="zip" name="zip" label="Postal Code" defaultValue={cust.postal_code} variant="outlined" margin="normal" size="small" fullWidth /> </Grid>
                <Grid size={2}>
                  <FormGroup sx={{ margin: 2 }}>
                    <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckChange} />} label="Active" />
                  </FormGroup>
                </Grid>
                <Grid size={12} />
                <Grid size={1}> <Button onClick={onClose}>Cancel</Button> </Grid>
                <Grid size={1}><Button type="submit" variant="contained">Submit</Button></Grid>
                <Grid size={8}><Box /></Grid>
                <Grid size={2}><DeleteCustomer handleDelete={handleDelete} /></Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <CustomerRentalsTable rows={custRentals} setRentalId={setRentalId} />
            </TabPanel>
          </TabContext>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

function EditCustomer({editDiagOpen, setEditDiagOpen, cust, endpoint, countries}) {
  //const [selectedCust, setSelectedCust] = useState({});

  const handleClose = () => { setEditDiagOpen(false); };

  const handleSubmit = (e, data, checked) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("country", data);
    formData.append("active", (checked ? ('1') : ('0')))
    const formJson = Object.fromEntries(formData.entries());

    console.log(formJson);
    //console.log(cust.customer_id);
    setEditDiagOpen(false);

    /*TODO*/
    //axios.post(endpoint + '/' + cust.customer_id, formJson)
    axios.put(endpoint + '/' + cust.customer_id, formJson);
  };

  return (
    <>
      <EditCustomerDialog open={editDiagOpen} onClose={handleClose} cust={cust} endpoint={endpoint} setFormInput={handleSubmit} countries={countries} />
    </>
  );
};

export default EditCustomer;