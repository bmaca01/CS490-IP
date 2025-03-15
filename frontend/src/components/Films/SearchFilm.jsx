import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function SearchFilms({submitSearch}) {
  const handleSubmit = (formData) => {
    const payload = Object.fromEntries(formData);
    submitSearch(payload);
  };

  return (
    <Box 
      component="form"
      action={handleSubmit}
      sx={{ flexGrow: 1, marginTop: 4 }}>
      <Typography variant="h3">Search for film:</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid size={3}> <TextField name="f-title" placeholder="Film Title" variant="outlined" size="small" type="search" /> </Grid>
        <Grid size={3}> <TextField name="f-genre" placeholder="Film Genre" variant="outlined" size="small" type="search" /> </Grid>
        <Grid size={3}> <TextField name="a-fname" placeholder="Actor First Name" variant="outlined" size="small" type="search" /> </Grid>
        <Grid size={3}> <TextField name="a-lname" placeholder="Actor Last Name" variant="outlined" size="small" type="search" /> </Grid>
        <Grid size={3}> <Button type="submit" variant="contained">Search</Button> </Grid>
      </Grid>
    </Box>
  )
};

export default SearchFilms;
