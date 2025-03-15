import { useState, useEffect } from 'react';
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
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import RentFilm from './RentFilm';

export default function FilmDetailsDialog({ open, setOpen, endpoint, selectedFilmDetails, selectedFilmActors, selectedFilmCount, selectedFilmLanguage, selectedFilmStock }) {
  const [custId, setCustId] = useState(0)
  
  //const count = typeof selectedFilmCount[0] !== 'undefined' ? selectedFilmCount[0].inventory_count : 0;
  const film = selectedFilmDetails.film[0];
  const features = selectedFilmDetails.film[0].special_features.split(',')
  const language = selectedFilmLanguage[0].name
  const stock = selectedFilmStock

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
  };

  const submitData = async () => {
    console.log(custId)
    //axios.post(endpoint + '/' + film.film_id, custId)
  };

  useEffect(() => {
    submitData()
  }, [custId])

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle>Film Details</DialogTitle>
      <DialogContent sx={{ height: '100%' }}>
        <Box sx={{ flexGrow: 1, p:1 }}>
          <Grid 
            container 
            spacing={2}
            sx={{
              justifyContent: "space-evenly",
              alignItems: "stretch"
            }}
          >
            <Grid size={2}>
              <Paper sx={{ textAlign: 'center' }}>
                <Typography variant='h5'>Actors</Typography>
                <Box>
                  <List>
                    {selectedFilmActors.map((actor, idx) => (
                      <ListItem value={actor.actor_id}>
                        <ListItemText
                          primary={`${actor.first_name} ${actor.last_name}`}
                        />
                      </ListItem>
                    ))}
                  </List> 
                </Box>
              </Paper>
            </Grid>
            <Grid size={6}>
              <Paper sx={{ textAlign: 'center' }}>
                <Typography variant='h5'>Details</Typography>
                <Box>
                  <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}}>
                      <TableBody>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>{film.title}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Genre</TableCell>
                          <TableCell>{film.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>{film.description}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Release Year</TableCell>
                          <TableCell>{film.release_year}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Rating</TableCell>
                          <TableCell>{film.rating}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Language</TableCell>
                          <TableCell>{language}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Special Features</TableCell>
                          <TableCell>
                            <List>
                              {features.map((feature) => (
                                <ListItem>
                                  <ListItemText
                                    disableTypography
                                    primary={`${feature}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
            <Grid size={4}>
              <Paper sx={{ textAlign: 'center' }}>
                <Typography variant='h5'>Inventory</Typography>
                <Box textAlign='left'> 
                  Number of copies in stock: {stock.length} 
                </Box>
                <Box textAlign='left'> 
                  Inventory ID
                </Box>
                <hr />
                <Box>
                  <List>
                    {stock.map((it, idx) => (
                      <ListItem>
                        <ListItemText
                          primary={`${it.inventory_id}`}
                        />
                        { it.return_date === null ? 
                          <Button disabled variant='outlined'>Not Available</Button> : 
                          <RentFilm setCustId={setCustId} inventoryId={it.inventory_id} /> }
                      </ListItem>
                    ))}
                  </List> 
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};