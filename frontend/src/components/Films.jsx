import { useState, useEffect } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import SearchFilms from './Films/SearchFilm';
import FilmsTable from './Films/FilmsTable';

const endpoint = "http://127.0.0.1:5000/films"

function Films() {
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchResult, setSearchResult] = useState([]);

  const fetchAPI = async () => {
    var response;
    if ((searchQuery == null) ||
      ((searchQuery['f-title'] === "") &&
        (searchQuery['f-genre'] === "") &&
        (searchQuery['a-fname'] === "") &&
        (searchQuery['a-lname'] === ""))) {
      response = await axios.get(endpoint);
    } else {
      response = await axios.get(endpoint,
        {
          params: {
            title: searchQuery['f-title'] === "" ? null : searchQuery['f-title'],
            name: searchQuery['f-genre'] === "" ? null : searchQuery['f-genre'],
            first_name: searchQuery['a-fname'] === "" ? null : searchQuery['a-fname'],
            last_name: searchQuery['a-lname'] === "" ? null : searchQuery['a-lname']
          }
        }
      );
    }
    setSearchResult(response.data)
  };

  useEffect(() => {
    fetchAPI();
  }, [searchQuery])

  return (
    <>
      {/*<CssBaseline />*/}
      <Container>
        <Box>
          <SearchFilms submitSearch={setSearchQuery} />
          <FilmsTable searchResult={searchResult} endpoint={endpoint} />
        </Box>
      </Container>
    </>
  )
};

export default Films;

