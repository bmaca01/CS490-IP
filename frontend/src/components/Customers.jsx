import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomPaginationActionsTable from './CustomPaginationActionsTable';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

const endpoint = "http://127.0.0.1:5000/customers"

function CustomerData({query}) {
  const [customersArray, setCustomersArray] = useState([{
    "cust-id": null,
    "first-name": null,
    "last-name": null
  }]);

  const fetchAPI = async () => {
    var response;
    if (query === null) {
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
    //e.preventDefault();
    //const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);


    action(payload);
  };

  return (
    <form action={handleSubmit}>
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
      <Button type="submit" variant="contained">Search</Button>
    </form>
  )
};

function Customers() {
  const [searchQuery, setSearchQuery] = useState({});

  return (
    <>
      <SearchForm 
        action={setSearchQuery}
      />
      <CustomerData
        query={(Object.keys(searchQuery).length === 0) ? null : searchQuery}
      />
    </>
  )
};

export default Customers;

      /*
function CustSearch() {
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
  });
  return (
    <div>
      <SearchBar searchQuery={formData} setSearchQuery={setFormData} />
      <CustomerData
        query={formData}
      />
    </div>
  )
};

      <SearchWrapper />
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField id="outlined-search" label="Customer ID" type="search" />
          <TextField id="outlined-search" label="First Name" type="search" />
          <TextField id="outlined-search" label="Last Name" type="search" />
        </div>
        <Button variant="contained" type="submit">Search</Button>
      </Box>
      <br />
      */


