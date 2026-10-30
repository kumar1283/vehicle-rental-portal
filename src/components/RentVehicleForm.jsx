import { useState } from "react";

// Counting rule: both the start day and the end day count.
// Same start and end date = 1 day.
function countDays(startDate, endDate) {
  if (startDate === "" || endDate === "") {
    return 0;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = end - start;
  if (difference < 0) {
    return 0;
  }
  return Math.round(difference / (1000 * 60 * 60 * 24)) + 1;
}

function RentVehicleForm({ vehicle, onConfirm, onCancel, serverError }) {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState("");

  const days = countDays(startDate, endDate);
  const totalCharges = days * vehicle.pricePerDay;

  function handleSubmit(event) {
    event.preventDefault();

    if (customerName.trim() === "") {
      setError("Customer name is required.");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (email !== "" && !email.includes("@")) {
      setError("Please enter a valid email or leave it empty.");
      return;
    }
    if (startDate === "" || endDate === "") {
      setError("Start date and end date are required.");
      return;
    }
    if (startDate < today) {
      setError("Start date cannot be in the past.");
      return;
    }
    if (endDate < startDate) {
      setError("End date cannot be before the start date.");
      return;
    }

    setError("");
    onConfirm({
      customerName: customerName.trim(),
      mobile,
      email: email.trim(),
      startDate,
      endDate,
      days,
      totalCharges,
    });
  }

  return (
    <div className="modal-background">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h2>Rent a Vehicle</h2>
        {error && <p className="message error">{error}</p>}
        {serverError && <p className="message error">{serverError}</p>}

        <div className="summary-box">
          <p><strong>Vehicle:</strong> {vehicle.name}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>
          <p><strong>Price per day:</strong> ₹{vehicle.pricePerDay}</p>
        </div>

        <label>Customer name</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

        <label>Mobile number (10 digits)</label>
        <input type="text" maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value)} />

        <label>Email (optional)</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="date-row">
          <div>
            <label>Start date</label>
            <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label>End date</label>
            <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="summary-box">
          <p><strong>Number of days:</strong> {days}</p>
          <p><strong>Total charges:</strong> ₹{totalCharges}</p>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">Confirm Rental</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default RentVehicleForm;
