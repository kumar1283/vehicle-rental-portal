import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCustomers } from "../api/CustomerApi.jsx";
import { getRentals } from "../api/RentalApi.jsx";

function CustomerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const requestedStatus = searchParams.get("status");
  const customerStatus = ["active", "returned"].includes(requestedStatus)
    ? requestedStatus
    : "all";

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

  // IDs are strings, so use the rental date rather than ID ordering to find the latest rental.
  function getLatestRental(customerId) {
    const customerRentals = rentals.filter(
      (rental) => String(rental.customerId) === String(customerId)
    );
    if (customerRentals.length === 0) {
      return null;
    }
    return customerRentals.reduce((latest, rental) =>
      rental.startDate > latest.startDate ? rental : latest
    );
  }

  const customerRows = customerStatus === "all"
    ? customers.map((customer) => ({
        customer,
        rental: getLatestRental(customer.id),
      }))
    : rentals
        .filter((rental) => rental.status.toLowerCase() === customerStatus)
        .map((rental) => ({
          customer: customers.find(
            (customer) => String(customer.id) === String(rental.customerId)
          ),
          rental,
        }));

  const filteredCustomers = customerRows.filter(({ customer, rental }) => {
    const text = searchText.toLowerCase();
    const customerName = customer?.name || rental?.customerName || "";
    const mobile = customer?.mobile || customer?.phone || rental?.customerMobile || "";
    const vehicleName = rental?.vehicleName || "";
    return (
      customerName.toLowerCase().includes(text) ||
      String(mobile).includes(text) ||
      vehicleName.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <div className="page-header">
        <h2>Customers</h2>
      </div>
      <p className="hint-text">
        {customerStatus === "all"
          ? "Rental details shown here are from each customer's latest rental."
          : `Customers with ${customerStatus} rentals.`}
      </p>

      {error && <p className="message error">{error}</p>}

      <section id="customer-list">
        <div className="list-toolbar">
          <div className="vehicle-filters" aria-label="Filter customers by rental status">
            {[
              ["all", "All customers"],
              ["active", "Active"],
              ["returned", "Returned"],
            ].map(([status, label]) => (
              <button
                key={status}
                type="button"
                className={`vehicle-filter${customerStatus === status ? " active" : ""}`}
                aria-pressed={customerStatus === status}
                onClick={() => {
                  const nextParams = new URLSearchParams(searchParams);
                  if (status === "all") {
                    nextParams.delete("status");
                  } else {
                    nextParams.set("status", status);
                  }
                  setSearchParams(nextParams);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="search-box"
            placeholder="Search by name, mobile or vehicle..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

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
                {filteredCustomers.map(({ customer, rental }) => {
                  return (
                    <tr key={`${customer?.id ?? rental?.customerId}-${rental?.id ?? "none"}`}>
                      <td>{customer?.name || rental?.customerName || "-"}</td>
                      <td>{customer?.mobile || customer?.phone || rental?.customerMobile || "-"}</td>
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
      </section>
    </div>
  );
}

export default CustomerList;
