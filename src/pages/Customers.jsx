import { useState } from "react";
import CustomerForm from "../components/CustomerForm";
import { addCustomer, deleteCustomer } from "../api/CustomerApi";

function Customers(props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveCustomer(customer) {
    try {
      await addCustomer(customer);
      setMessage("Customer added successfully.");
      setError("");
      await props.refreshData();
    } catch {
      setError("Unable to add customer.");
      setMessage("");
    }
  }

  async function removeCustomer(customer) {
    const activeRental = props.rentals.some(function (rental) {
      return String(rental.customerId) === String(customer.id) && rental.status === "Active";
    });
    if (activeRental) {
      setError("This customer has an active rental and cannot be deleted yet.");
      setMessage("");
      return;
    }
    if (!window.confirm(`Delete customer ${customer.name}?`)) {
      return;
    }
    try {
      await deleteCustomer(customer.id);
      setMessage("Customer deleted successfully.");
      setError("");
      await props.refreshData();
    } catch {
      setError("Unable to delete customer.");
      setMessage("");
    }
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">CUSTOMER RECORDS</p>
          <h2>Customer Management</h2>
          <p className="muted">Keep customer contact details in one place.</p>
        </div>
        <span className="count-pill">{props.customers.length} customers</span>
      </div>

      {message && <p className="alert success-message">{message}</p>}
      {error && <p className="alert error-message">{error}</p>}

      <div className="content-panel">
        <h3>Add New Customer</h3>
        <CustomerForm addCustomer={saveCustomer} showMessage={setError} />
      </div>

      <div className="content-panel">
        <h3>Customer List</h3>
        {props.customers.map(function (customer) {
          return (
            <div className="customer-row" key={customer.id}>
              <div className="customer-avatar">{customer.name.charAt(0).toUpperCase()}</div>
              <div className="customer-info">
                <strong>{customer.name}</strong>
                <p>{customer.phone}{customer.email ? ` · ${customer.email}` : ""}</p>
              </div>
              <button className="button danger" onClick={() => removeCustomer(customer)}>Delete</button>
            </div>
          );
        })}
        {props.customers.length === 0 && <p className="empty-state">No customers added yet.</p>}
      </div>
    </section>
  );
}

export default Customers;
