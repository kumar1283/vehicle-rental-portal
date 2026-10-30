import { useState } from "react";

function RentalForm(props) {
  const today = new Date().toISOString().slice(0, 10);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  function getDays() {
    const difference = Math.ceil(
      (new Date(endDate + "T00:00:00") - new Date(startDate + "T00:00:00")) / 86400000
    );
    return Math.max(1, difference);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const vehicle = props.vehicles.find((item) => String(item.id) === String(vehicleId));
    const customer = props.customers.find((item) => String(item.id) === String(customerId));

    if (!vehicle || !customer) {
      props.showMessage("Please select a customer and an available vehicle.");
      return;
    }
    if (endDate < startDate) {
      props.showMessage("Return date must be on or after the start date.");
      return;
    }

    props.createRental({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      customerId: customer.id,
      customerName: customer.name,
      startDate: startDate,
      endDate: endDate,
      days: getDays(),
      pricePerDay: Number(vehicle.pricePerDay),
      totalCost: getDays() * Number(vehicle.pricePerDay),
      status: "Active",
    });

    setCustomerId("");
    setVehicleId("");
    setStartDate(today);
    setEndDate(today);
  }

  const selectedVehicle = props.vehicles.find((item) => String(item.id) === String(vehicleId));
  const estimate = selectedVehicle ? getDays() * Number(selectedVehicle.pricePerDay) : 0;

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>Customer
        <select value={customerId} onChange={(event) => setCustomerId(event.target.value)} required>
          <option value="">Select customer</option>
          {props.customers.map(function (customer) {
            return <option key={customer.id} value={customer.id}>{customer.name} ({customer.phone})</option>;
          })}
        </select>
      </label>
      <label>Available vehicle
        <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} required>
          <option value="">Select vehicle</option>
          {props.vehicles.map(function (vehicle) {
            return <option key={vehicle.id} value={vehicle.id}>{vehicle.name} — ₹{vehicle.pricePerDay}/day</option>;
          })}
        </select>
      </label>
      <label>Start date
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
      </label>
      <label>Return date
        <input type="date" min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
      </label>
      <div className="estimate">
        Estimated duration: <strong>{getDays()} day(s)</strong>
        <span>Estimated charge: <strong>₹{estimate}</strong></span>
      </div>
      <div className="form-actions">
        <button className="button primary" type="submit">Confirm Rental</button>
      </div>
    </form>
  );
}

export default RentalForm;
