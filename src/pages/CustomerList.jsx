import { useState, useEffect } from "react";
import { getCustomers } from "../api/CustomerApi.jsx";
import { getRentals } from "../api/RentalApi.jsx";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setCustomers(await getCustomers());
        setRentals(await getRentals());
      } catch (err) {
        setError("Could not load customers. Is JSON Server running on port 3000?");
      }
    }
    loadData();
  }, []);

  // For each customer we show their LATEST rental (the one with the highest id)
  function getLatestRental(customerId) {
    const customerRentals = rentals.filter((rental) => Number(rental.customerId) === Number(customerId));
    if (customerRentals.length === 0) {
      return null;
    }
    return customerRentals.reduce((latest, rental) => (rental.id > latest.id ? rental : latest));
  }

  const filteredCustomers = customers.filter((customer) => {
    const rental = getLatestRental(customer.id);
    const vehicleName = rental ? rental.vehicleName : "";
    const text = searchText.toLowerCase();
    return (
      customer.name.toLowerCase().includes(text) ||
      customer.mobile.includes(text) ||
      vehicleName.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <div className="page-header">
        <h2>Customers</h2>
      </div>
      <p className="hint-text">Rental details shown here are from each customer's latest rental.</p>

      {error && <p className="message error">{error}</p>}

      <input
        type="text"
        className="search-box"
        placeholder="Search by name, mobile or vehicle..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {filteredCustomers.length === 0 ? (
        <p className="empty-text">No customers found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Vehicle rented</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Charges</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const rental = getLatestRental(customer.id);
                return (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.mobile}</td>
                    <td>{rental ? rental.vehicleName : "No rental yet"}</td>
                    <td>{rental ? rental.startDate : "-"}</td>
                    <td>{rental ? rental.endDate : "-"}</td>
                    <td>{rental ? `₹${rental.totalCharges}` : "-"}</td>
                    <td>{rental ? rental.status : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
