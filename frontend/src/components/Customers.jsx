import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomPaginationActionsTable from './CustomPaginationActionsTable';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SearchBar = ({setSearchQuery}) => (
  <form>
    <TextField 
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Enter something bitch"
      variant="outlined"
      placeholder="FUCK"
      size="small"
    />
    <Button type="submit" variant="contained">Search</Button>
  </form>
);

function SearchWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  )
};

function Customers() {
  const [customersArray, setCustomersArray] = useState([{}]);

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/customers");
    setCustomersArray(response.data.customers);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
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
      <CustomPaginationActionsTable 
        rows={customersArray}
      />
    </div>
  )
};

export default Customers;