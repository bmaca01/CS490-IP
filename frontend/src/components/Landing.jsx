import { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

//import './App.css'

function Actors() {
  const [actorsArray, setActorsArray] = useState([{}]);

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
      <Stack 
        direction="row" 
        divider={<Divider orientation="vertical" flexItem />}
        spacing={4}
      >
        {actorsArray.map((actor, idx) =>(
        <Card sx={{ maxWidth: 150 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="body" component="div">
                {actor.first_name} {actor.last_name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        /*
        <div key={idx}>
          <span>{actor.first_name} {actor.last_name}, {actor.actor_film_cnt}</span>
          <br />
        </div>
        */
        ))}
      </Stack>
    </div>
  );
};

function Films() {
  const [filmsArray, setFilmsArray] = useState([{}]);

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/top-5-films");
    setFilmsArray(response.data.top_5_movies);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
      <Typography gutterBottom variant="h3">
        Top 5 Rented Movies
      </Typography>
      <Stack 
        direction="row" 
        divider={<Divider orientation="vertical" flexItem />}
        spacing={4}
      >
        {filmsArray.map((film, idx) =>(
        <Card sx={{ maxWidth: 150 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {film.title} 
              </Typography>
              <Typography variant="caption">
                {film.category}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        ))}
      </Stack>
    </div>
  );
};

function Landing() {
  return (
    <div>
      <Films />
      <br />
      <Actors />
    </div>
  )
}

export default Landing

