import { useState, useEffect } from "react";
import { getRentals, updateRentalApi } from "../api/RentalApi.jsx";
import RentalTable from "../components/RentalTable.jsx";

function RentalList() {
  const [rentals, setRentals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    loadRentals();
  }, []);

  async function loadRentals() {
    try {
      setRentals(await getRentals());
    } catch (err) {
      setMessage("Could not load rentals. Is JSON Server running on port 3000?");
      setMessageType("error");
    }
  }

  async function markReturned(rental) {
    const sure = window.confirm(`Mark the rental of ${rental.vehicleName} as returned?`);
    if (!sure) {
      return;
    }
    try {
      await updateRentalApi(rental.id, { ...rental, status: "Returned" });
      await loadRentals();
      setMessage("Rental marked as returned. The vehicle is available again.");
      setMessageType("success");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  }

  const filteredRentals = rentals
    .filter((rental) => {
      const text = searchText.toLowerCase();
      return (
        rental.customerName.toLowerCase().includes(text) ||
        rental.customerMobile.includes(text) ||
        rental.vehicleName.toLowerCase().includes(text) ||
        rental.status.toLowerCase().includes(text)
      );
    })
    .sort((a, b) => b.id - a.id);

  return (
    <div>
      <div className="page-header">
        <h2>Rentals</h2>
      </div>

      {message && <p className={`message ${messageType}`}>{message}</p>}

      <input
        type="text"
        className="search-box"
        placeholder="Search by customer, mobile, vehicle or status..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <RentalTable rentals={filteredRentals} onMarkReturned={markReturned} />
    </div>
  );
}

export default RentalList;
