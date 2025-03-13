import CustomerRentalsTable from './CustomerRentalsTable';

function ViewCustomerRentals({ rentals }) {

  return(
    <>
      <CustomerRentalsTable rows={rentals} />
    </>
  );
};


export default ViewCustomerRentals;