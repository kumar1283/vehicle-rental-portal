import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getRentals, updateRentalApi } from "../api/RentalApi.jsx";
import RentalTable from "../components/RentalTable.jsx";

function RentalList() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rentals, setRentals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const requestedStatus = searchParams.get("status");
  const rentalStatus = ["active", "returned"].includes(requestedStatus)
    ? requestedStatus
    : "all";

  useEffect(() => {
    loadRentals();
  }, []);

  useEffect(() => {
    if (location.hash === "#rental-list") {
      document.getElementById("rental-list")?.scrollIntoView({ block: "start" });
    }
  }, [location.hash]);

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
      const matchesSearch =
        rental.customerName.toLowerCase().includes(text) ||
        rental.customerMobile.includes(text) ||
        rental.vehicleName.toLowerCase().includes(text) ||
        rental.status.toLowerCase().includes(text);
      return matchesSearch &&
        (rentalStatus === "all" || rental.status.toLowerCase() === rentalStatus);
    })
    .sort((a, b) => b.id - a.id);

  function selectRentalStatus(status) {
    const nextParams = new URLSearchParams(searchParams);
    if (status === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", status);
    }
    setSearchParams(nextParams);
  }

  return (
    <div id="rental-list">
      <div className="page-header">
        <h2>Rentals</h2>
      </div>

      {message && <p className={`message ${messageType}`}>{message}</p>}

      <div className="vehicle-filters" aria-label="Filter rentals">
        {[
          ["all", "All rentals"],
          ["active", "Active"],
          ["returned", "Returned"],
        ].map(([status, label]) => (
          <button
            key={status}
            type="button"
            className={`vehicle-filter${rentalStatus === status ? " active" : ""}`}
            aria-pressed={rentalStatus === status}
            onClick={() => selectRentalStatus(status)}
          >
            {label}
          </button>
        ))}
      </div>

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
