import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import FilmDetailsDialog from './FilmDetailsDialog';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function FilmsTable({ searchResult, endpoint }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState('loading');
  const [selectedFilm, setSelectedFilm] = React.useState(1);
  const [selectedFilmDetails, setSelectedFilmDetails] = React.useState({});
  const [selectedFilmActors, setSelectedFilmActors] = React.useState([]);
  const [selectedFilmCount, setSelectedFilmCount] = React.useState([]);
  const [selectedFilmLanguage, setSelectedFilmLanguage] = React.useState([]);
  const [selectedFilmStock, setSelectedFilmStock] = React.useState([]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searchResult.length) : 0;

  const fetchAPI = async () => {
    setState('loading');
    const [details, actors, inventory, language, stock] = await Promise.all([
      fetchAPI_details(), 
      fetchAPI_actors(), 
      fetchAPI_inventory(),
      fetchAPI_language(),
      fetchAPI_stock()
    ])
    setSelectedFilmDetails(details.data);
    setSelectedFilmActors(actors.data);
    setSelectedFilmCount(inventory.data);
    setSelectedFilmLanguage(language.data);
    setSelectedFilmStock(stock.data);
    setState('success');
  };

  const fetchAPI_details = async () => {
    const response = axios.get(endpoint + '/' + selectedFilm);
    return response;
  };

  const fetchAPI_actors = async () => {
    const response = axios.get(endpoint + '/' + selectedFilm + '/actors');
    return response;
  };

  const fetchAPI_inventory = async () => {
    const response = axios.get(endpoint + '/' + selectedFilm + '/inventory');
    return response;
  };

  const fetchAPI_language = async () => {
    const response = axios.get(endpoint + '/' + selectedFilm + '/language');
    return response;
  };

  const fetchAPI_stock = async () => {
    const response = axios.get(endpoint + '/' + selectedFilm + '/availability');
    return response;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setSelectedFilm(e.currentTarget.id);
    setOpen(true);
  };

  React.useEffect(() => {
    fetchAPI();
  }, [selectedFilm])

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Release Year</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Rental Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? searchResult.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : searchResult
            ).map((row) => (
              <TableRow
                key={row.film_id}
                hover
                id={row.film_id}
                onClick={(e) => handleClick(e)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell> {row.title} </TableCell>
                <TableCell> {row.name} </TableCell>
                <TableCell> {row.release_year} </TableCell>
                <TableCell> {row.rating} </TableCell>
                <TableCell> {row.rental_rate} </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={searchResult.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {state === 'loading' ? (
        <></>
      ) : (
        <>
          <FilmDetailsDialog 
            open={open} 
            setOpen={setOpen} 
            endpoint={endpoint}
            selectedFilmDetails={selectedFilmDetails} 
            selectedFilmActors={selectedFilmActors} 
            selectedFilmCount={selectedFilmCount} 
            selectedFilmLanguage={selectedFilmLanguage} 
            selectedFilmStock={selectedFilmStock} 
          />
        </>
      )}
    </>
  );
}

export default FilmsTable;
