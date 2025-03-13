import { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import CustomerTable from './Customers/CustomerTable';
import AddNewCustomer from './Customers/AddNewCustomer';
import EditCustomer from './Customers/EditCustomer'

const endpoint = "http://127.0.0.1:5000/customers"
const countries_endpoint = 'http://127.0.0.1:5000/countries';

function CustomerData({query, selectCust, openEditCust}) {
  const [customersArray, setCustomersArray] = useState([{}]);

  const fetchAPI = async () => {
    var response;
    console.log(query);
    if ( (query["cust-id"] === "" && query["first-name"] === "" && query["last-name"] === "") || query == null) { 
      response = await axios.get(endpoint); 
    } else {
      response = await axios.get(endpoint, 
        { 
          params: {
            customer_id: query["cust-id"] === "" ? null : query["cust-id"],
            first_name: query["first-name"] === "" ? null : query["first-name"],
            last_name: query["last-name"] === "" ? null : query["last-name"]
          }
        }
      );
    }
    setCustomersArray(response.data.customers);
  };

  useEffect(() => { fetchAPI(); }, [query]);

  return (
    <div> <CustomerTable rows={customersArray} selectCustomer={selectCust} openEdit={openEditCust} /> </div>
  )
};

function SearchForm({submitSearch}) {
  const handleSubmit = (formData) => {
    const payload = Object.fromEntries(formData);
    submitSearch(payload);
  };

  return ( 
    <Box component="form" action={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' } }} >
      <TextField name="cust-id" placeholder="Customer ID" variant="outlined" size="small" type="search" />
      <TextField name="first-name" placeholder="Customer First Name" variant="outlined" size="small" type="search" />
      <TextField name="last-name" placeholder="Customer Last Name" variant="outlined" size="small" type="search" />
      <Button type="submit" variant="contained" sx={{ m: 1 }} > Search </Button>
    </Box>
  )
};

function Customers() {
  const [searchQuery, setSearchQuery] = useState({});
  const [selectedCustId, setSelectedCustId] = useState(null);
  const [selectedCustData, setSelectedCustData] = useState({});
  const [editDiagOpen, setEditDiagOpen] = useState(false);  // I love shared state and spaghetti code
  const [countries, setCountries] = useState([])
  const [state, setState] = useState('loading');


  const fetchAPI = async () => {
    setState('loading');
    //const response = await axios.get(endpoint, {params: {customer_id: selectedCustId}})
    await axios.get(endpoint, {params: {customer_id: selectedCustId}}).then((res) => {
      console.log(res.data.customers);
      setSelectedCustData(res.data.customers[0]);
      setState('success');
    });
    //setSelectedCustData(response.data.customers[0]);
  }

  const getCountries = async () => {
    const response = await axios.get(countries_endpoint);
    setCountries(response.data.countries);
  }

  useEffect(() => { 
    getCountries(); 
  }, []);

  useEffect(() => {
    fetchAPI();
  }, [selectedCustId])

  return (
    <>
      <SearchForm submitSearch={setSearchQuery} />
      <AddNewCustomer endpoint={endpoint} countries={countries} />
      <CustomerData query={searchQuery} selectCust={setSelectedCustId} openEditCust={setEditDiagOpen} />
      {state === 'loading' ? (
        <></>
      ) : (
        <EditCustomer editDiagOpen={editDiagOpen} setEditDiagOpen={setEditDiagOpen} cust={selectedCustData} endpoint={endpoint} countries={countries} />
      )}
    </>
  )
};

export default Customers;