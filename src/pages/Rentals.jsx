import { useState } from "react";
import RentalForm from "../components/RentalForm";
import { addRental, updateRental } from "../api/RentalApi";

function Rentals(props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function createRental(rental) {
    const vehicleBusy = props.rentals.some(function (item) {
      return String(item.vehicleId) === String(rental.vehicleId) && item.status === "Active";
    });
    if (vehicleBusy) {
      setError("This vehicle is already rented.");
      setMessage("");
      return;
    }
    try {
      await addRental(rental);
      setMessage("Rental created successfully.");
      setError("");
      await props.refreshData();
    } catch {
      setError("Unable to create rental.");
      setMessage("");
    }
  }

  async function returnVehicle(rental) {
    if (!window.confirm(`Mark rental #${rental.id} as returned?`)) {
      return;
    }
    try {
      await updateRental(rental.id, { ...rental, status: "Returned" });
      setMessage("Vehicle marked as returned.");
      setError("");
      await props.refreshData();
    } catch {
      setError("Unable to update rental.");
      setMessage("");
    }
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">BOOKINGS</p>
          <h2>Rental Management</h2>
          <p className="muted">Create a rental and track vehicle returns.</p>
        </div>
        <span className="count-pill">{props.rentals.length} records</span>
      </div>

      {message && <p className="alert success-message">{message}</p>}
      {error && <p className="alert error-message">{error}</p>}

      <div className="content-panel">
        <h3>Create New Rental</h3>
        {props.customers.length === 0 && <p className="alert">Add a customer before creating a rental.</p>}
        {props.availableVehicles.length === 0 && <p className="alert">No vehicles are currently available.</p>}
        <RentalForm
          customers={props.customers}
          vehicles={props.availableVehicles}
          createRental={createRental}
          showMessage={setError}
        />
      </div>

      <div className="content-panel">
        <h3>Rental Records</h3>
        {props.rentals.map(function (rental) {
          return (
            <article className="rental-row" key={rental.id}>
              <div className="rental-topline">
                <div>
                  <strong>#{rental.id} · {rental.vehicleName}</strong>
                  <p className="muted">Customer: {rental.customerName}</p>
                </div>
                <span className={rental.status === "Active" ? "status active" : "status returned"}>
                  {rental.status}
                </span>
              </div>
              <p>{rental.startDate} to {rental.endDate} · {rental.days} day(s)</p>
              <div className="rental-bottomline">
                <strong>₹{rental.totalCost}</strong>
                {rental.status === "Active" && (
                  <button className="button secondary" onClick={() => returnVehicle(rental)}>
                    Mark as Returned
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {props.rentals.length === 0 && <p className="empty-state">No rental records yet.</p>}
      </div>
    </section>
  );
}

export default Rentals;
