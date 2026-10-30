import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVehicles } from "../api/VehicleApi.jsx";
import { getCustomers } from "../api/CustomerApi.jsx";
import { getRentals, hasActiveRental } from "../api/RentalApi.jsx";
import RentalTable from "../components/RentalTable.jsx";

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setVehicles(await getVehicles());
        setCustomers(await getCustomers());
        setRentals(await getRentals());
      } catch (err) {
        setError("Could not load data. Is JSON Server running on port 3000?");
      }
    }
    loadData();
  }, []);

  // All numbers are calculated from the data loaded from the API
  const availableCount = vehicles.filter((vehicle) => !hasActiveRental(vehicle.id, rentals)).length;
  const activeRentals = rentals.filter((rental) => rental.status === "Active").length;
  const totalCharges = rentals.reduce((sum, rental) => sum + rental.totalCharges, 0);

  // Newest rentals have the highest id
  const recentRentals = [...rentals].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <Link to="/vehicles" className="btn btn-primary">Manage Vehicles</Link>
      </div>

      {error && <p className="message error">{error}</p>}

      <div className="summary-grid">
        <Link to="/vehicles?status=all#vehicle-list" className="summary-card summary-card-link">
          <h3>{vehicles.length}</h3><p>Total vehicles</p>
        </Link>
        <Link to="/vehicles?status=available#vehicle-list" className="summary-card summary-card-link">
          <h3>{availableCount}</h3><p>Available vehicles</p>
        </Link>
        <Link to="/customers#customer-list" className="summary-card summary-card-link">
          <h3>{customers.length}</h3><p>Total customers</p>
        </Link>
        <Link to="/rentals?status=active#rental-list" className="summary-card summary-card-link">
          <h3>{activeRentals}</h3><p>Active rentals</p>
        </Link>
        <div className="summary-card"><h3>₹{totalCharges}</h3><p>Total rental charges</p></div>
      </div>

      <h2>Recent Rentals</h2>
      <RentalTable rentals={recentRentals} />
    </div>
  );
}

export default Home;
