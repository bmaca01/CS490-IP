import { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';


//import './App.css'

function ActorsDialog(props) {
  const { selectedActor, onClose, open } = props;
  const [selectedActorDetails, setSelectedActorDetails] = useState([{}]);
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/actors/" + selectedActor);
    setSelectedActorDetails(response.data.actor);
  };

  useEffect(() => {
    fetchAPI();
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TOP 5 FILMS</DialogTitle>
      {selectedActorDetails.map((film, idx) => (
        <h3>{film.title}</h3>
      ))}
    </Dialog>
  )
}

function Actors() {
  const [actorsArray, setActorsArray] = useState([{}]);
  const [selectedActor, setSelectedActor] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickOpen = (e) => {
    console.log(e.currentTarget.id)
    setOpen(true);
    setSelectedActor(e.currentTarget.id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/top-5-actors");
    setActorsArray(response.data.top_5_actors);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
      <Typography gutterBottom variant="h3">
        Top 5 Actors
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }} 
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          justifyContent: "center"
        }}
      >
        {actorsArray.map((actor, idx) =>(
        <Grid item xs={2} sm={4} md={4} key={idx} id={actor.actor_id} onClick={handleClickOpen}>
            <Card>
              <CardActionArea>
                <Typography gutterBottom variant="h5">
                  {actor.first_name} {actor.last_name}
                </Typography>
              </CardActionArea>
            </Card>
        </Grid>
        ))}
      </Grid>
      <ActorsDialog
        selectedActor={selectedActor}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

function FilmsDialog(props) {
  const { selectedFilm, onClose, open } = props;
  const [selectedFilmDetails, setSelectedFilmDetails] = useState([{}]);
  const handleClose = () => {
    onClose();
  };

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/films/" + selectedFilm);
    setSelectedFilmDetails(response.data.film[0]);
  };

  useEffect(() => {
    fetchAPI();
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Details</DialogTitle>
      <Stack spacing={2}>
        <Card>
          <Typography>
            Description: {selectedFilmDetails.description}
          </Typography>
        </Card>
        <Card>
          <Typography>
            Film Length: {selectedFilmDetails.length}
          </Typography>
        </Card>
        <Card>
          <Typography>
            Rating: {selectedFilmDetails.rating}
          </Typography>
        </Card>
        <Card>
          <Typography>
            Release Year: {selectedFilmDetails.release_year}
          </Typography>
        </Card>
      </Stack>
    </Dialog>
  )
}

function Films() {
  const [filmsArray, setFilmsArray] = useState([{}]);
  const [selectedFilm, setSelectedFilm] = useState('');
  const [open, setOpen] = useState(false);

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/top-5-films");
    setFilmsArray(response.data.top_5_movies);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleClickOpen = (e) => {
    console.log(e.currentTarget.id)
    setOpen(true);
    setSelectedFilm(e.currentTarget.id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Typography gutterBottom variant="h3">
        Top 5 Rented Movies
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }} 
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          justifyContent: "center"
        }}
      >
        {filmsArray.map((film, idx) =>(
        <Grid item xs={2} sm={4} md={4} key={idx} id={film.film_id} onClick={handleClickOpen}>
            <Card>
              <CardActionArea>
                <Typography gutterBottom variant="h5">
                  {film.title} 
                </Typography>
                <Typography variant="caption">
                  {film.category}
                </Typography>
              </CardActionArea>
            </Card>
        </Grid>
        ))}
      </Grid>
      <FilmsDialog
        selectedFilm={selectedFilm}
        open={open}
        onClose={handleClose}
      />
    </Box>
  );
};

function Landing() {
  return (
    <Stack spacing={2}>
      <Films />
      <br />
      <Actors />
    </Stack>
  )
}

export default Landing

