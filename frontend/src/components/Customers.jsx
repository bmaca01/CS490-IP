import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomPaginationActionsTable from './CustomPaginationActionsTable';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

/* unused
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
*/

const endpoint = "http://127.0.0.1:5000/customers"

function CustomerData({query}) {
  const [customersArray, setCustomersArray] = useState([{
    "cust-id": null,
    "first-name": null,
    "last-name": null
  }]);

  const fetchAPI = async () => {
    var response;
    console.log(query);
    if (
      (query["cust-id"] === "" &&
      query["first-name"] === "" &&
      query["last-name"] === "") ||
      query == null
    ) {
      response = await axios.get(endpoint);
    }
    else {

      response = await axios.get(endpoint, 
        { 
          params: {
            customer_id: query["cust-id"],
            first_name: query["first-name"],
            last_name: query["last-name"]
          }
        }
      );
    }
    setCustomersArray(response.data.customers);
  };

  useEffect(() => {
    fetchAPI();
  }, [query]);

  return (
    <div>
      <CustomPaginationActionsTable 
        rows={customersArray}
      />
    </div>
  )
};

function SearchForm({action}) {
  const handleSubmit = (formData) => {
    const payload = Object.fromEntries(formData);
    action(payload);
  };

  return ( 
    <Box 
      component="form" 
      action={handleSubmit} 
      sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' } }}
    >
    {/*
    <form action={handleSubmit}>
    </form>
    */}
      <TextField 
        name="cust-id"
        placeholder="Customer ID"
        variant="outlined"
        size="small"
        type="search"
      />
      <TextField 
        name="first-name"
        placeholder="Customer First Name"
        variant="outlined"
        size="small"
        type="search"
      />
      <TextField 
        name="last-name"
        placeholder="Customer Last Name"
        variant="outlined"
        size="small"
        type="search"
      />
      <Button 
        type="submit" 
        variant="contained"
        sx={{
          m: 1
        }}
      >
        Search
      </Button>
    </Box>
  )
};

function AddNewCustomer() {
  const [open, setOpen] = useState(false);
  const [formInput, setFormInput] = useState({});
  const [countries, setCountries] = useState([])

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postAPI = async () => {
    axios.post(endpoint, formInput)
  }

  const getCountries = async () => {
    const response = await axios.get('http://127.0.0.1:5000/countries')
    setCountries(response.data.countries)
  }

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    postAPI();
  }, [formInput]);

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={handleClickOpen}
        sx={{
          m: 1
        }}
      >
        Add New Customer
      </Button>
      <AddNewCustomerDialog 
        open={open}
        onClose={handleClose}
        setFormInput={setFormInput}
        countries={countries}
      />
    </Box>
  );
};

function AddNewCustomerDialog({onClose, open, setFormInput, countries}) {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleChangeSelectedCountry = (e) => {
    setSelectedCountry(e.target.value);
  };
  const handleClose = () => {
    onClose();
  }

  return (
    <Dialog 
      onClose={handleClose} 
      open={open}
      sx={{
        p: 2
      }}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);
            setFormInput(formJson);
            handleClose();

          },
        },
      }}
    >
      <DialogTitle>Add a new customer</DialogTitle>
      <DialogContent>
        <Box
          sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' } }}
        >
          <TextField
            id="f-name"
            name="fname"
            label="First Name"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            id="l-name"
            name="lname"
            label="Last Name"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone Number"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            id="addr1"
            name="addr1"
            label="Address Line 1"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            id="addr2"
            name="addr2"
            label="Address Line 2"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <TextField
            id="city"
            name="city"
            label="City"
            variant="outlined"
            margin="normal"
            size="small"
          />
          {/* TODO: Make into selection */}
          <InputLabel 
            id="countries-label"
          >
            Country
          </InputLabel>
          <Select
            labelId="countries-label"
            id="countries"
            value={selectedCountry}
            label="Country"
            onChange={handleChangeSelectedCountry}
          >
            {countries.map((country, idx) => ( 
              <MenuItem value={country.country_id}>{country.country}</MenuItem>
            ))}
          </Select>
          {/* 
          <TextField
            id="country"
            name="country"
            label="Country"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <TextField
            id="district"
            name="district"
            label="District"
            variant="outlined"
            margin="normal"
            size="small"
          />
          */}
          <TextField
            id="zip"
            name="zip"
            label="Postal Code"
            variant="outlined"
            margin="normal"
            size="small"
          />
          <br />
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>

        </Box>
      </DialogContent>

    </Dialog>
  );
};

function Customers() {
  const [searchQuery, setSearchQuery] = useState({});

  return (
    <>
      <SearchForm 
        action={setSearchQuery}
      />
      <AddNewCustomer
      />
      <CustomerData
        query={searchQuery}
      />
    </>
  )
};

export default Customers;