import { useState } from "react";
import VehicleForm from "../components/VehicleForm";
import VehicleCard from "../components/VehicleCard";
import { addVehicle, updateVehicle, deleteVehicle } from "../api/VehicleApi";

function Vehicles(props) {
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function showMessage(text) {
    setMessage("");
    setError(text);
  }

  async function saveVehicle(vehicle) {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicle);
        setMessage("Vehicle updated successfully.");
      } else {
        await addVehicle(vehicle);
        setMessage("Vehicle added successfully.");
      }
      setError("");
      setEditingVehicle(null);
      await props.refreshData();
    } catch {
      setError("Unable to save vehicle. Please try again.");
      setMessage("");
    }
  }

  async function removeVehicle(vehicle) {
    const activeRental = props.rentals.some(function (rental) {
      return String(rental.vehicleId) === String(vehicle.id) && rental.status === "Active";
    });
    if (activeRental) {
      setError("This vehicle has an active rental. Mark it returned before deleting.");
      setMessage("");
      return;
    }
    if (!window.confirm(`Delete ${vehicle.name}?`)) {
      return;
    }
    try {
      await deleteVehicle(vehicle.id);
      setMessage("Vehicle deleted successfully.");
      setError("");
      await props.refreshData();
    } catch {
      setError("Unable to delete vehicle.");
      setMessage("");
    }
  }

  const filteredVehicles = props.vehicles.filter(function (vehicle) {
    return (vehicle.name + " " + vehicle.type).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">FLEET</p>
          <h2>Vehicle Management</h2>
          <p className="muted">Add vehicles and keep the fleet details up to date.</p>
        </div>
        <span className="count-pill">{props.vehicles.length} vehicles</span>
      </div>

      {message && <p className="alert success-message">{message}</p>}
      {error && <p className="alert error-message">{error}</p>}

      <div className="content-panel">
        <h3>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h3>
        <VehicleForm
          vehicle={editingVehicle}
          saveVehicle={saveVehicle}
          cancelEdit={() => setEditingVehicle(null)}
          showMessage={showMessage}
        />
      </div>

      <div className="list-heading">
        <h3>Available Fleet</h3>
        <input className="search-input" placeholder="Search name or type..."
          value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="vehicle-list">
        {filteredVehicles.map(function (vehicle) {
          return (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              editVehicle={setEditingVehicle}
              removeVehicle={removeVehicle}
            />
          );
        })}
      </div>
      {filteredVehicles.length === 0 && <p className="empty-state">No matching vehicles found.</p>}
    </section>
  );
}

export default Vehicles;
