import * as React from 'react';
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

export default function CustomerRentalsTable({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (e) => {
    e.preventDefault();
    alert('click');
    //console.log(e.currentTarget.id, id);
    //selectCustomer(e.currentTarget.id);
    //openEdit(true);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Rental ID</TableCell>
            <TableCell>Return Date</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Rental Date</TableCell>
            <TableCell>Rental Duration</TableCell>
            <TableCell>Film ID</TableCell>
            <TableCell>Film Title</TableCell>
            <TableCell>Store ID</TableCell>
            <TableCell>Store Address</TableCell>
            <TableCell>Store City</TableCell>
            <TableCell>Store District</TableCell>
            <TableCell>Store Country</TableCell>
            <TableCell>Inventory ID</TableCell>
            <TableCell>Last Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow 
              key={row.rental_id}
              hover 
              id={row.rental_id}
              onClick={(e) => handleClick(e)}
              //sx={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row"> {row.rental_id} </TableCell>
              <TableCell> {row.return_date} </TableCell>
              <TableCell> {row.active} </TableCell>
              <TableCell> {row.rental_date} </TableCell>
              <TableCell> {row.rental_duration} </TableCell>
              <TableCell> {row.film_id} </TableCell>
              <TableCell> {row.title} </TableCell>
              <TableCell> {row.store_id} </TableCell>
              <TableCell> {row.address} </TableCell>
              <TableCell> {row.city} </TableCell>
              <TableCell> {row.district} </TableCell>
              <TableCell> {row.country} </TableCell>
              <TableCell> {row.inventory_id} </TableCell>
              <TableCell> {row.last_update} </TableCell>
              {/**
              <TableCell style={{ width: 160 }} align="left"> {row.first_name} </TableCell>
              <TableCell style={{ width: 160 }} align="left"> {row.last_name} </TableCell>
               */}
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
              count={rows.length}
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
  );
}

