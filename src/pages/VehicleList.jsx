import { useState, useEffect } from "react";
import {
  getVehicles,
  addVehicleApi,
  updateVehicleApi,
  deleteVehicleApi,
} from "../api/VehicleApi.jsx";
import { getCustomers, addCustomerApi } from "../api/CustomerApi.jsx";
import {
  getRentals,
  addRentalApi,
  hasActiveRental,
} from "../api/RentalApi.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import VehicleCard from "../components/VehicleCard.jsx";
import VehicleForm from "../components/VehicleForm.jsx";
import RentVehicleForm from "../components/RentVehicleForm.jsx";

const MAX_VEHICLES = 10;

function VehicleList() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToRent, setVehicleToRent] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [rentError, setRentError] = useState("");
  const requestedStatus = searchParams.get("status");
  const vehicleStatus = ["available", "rented"].includes(requestedStatus)
    ? requestedStatus
    : "all";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.hash === "#vehicle-list") {
      document.getElementById("vehicle-list")?.scrollIntoView({ block: "start" });
    }
  }, [location.hash]);

  async function loadData() {
    try {
      setVehicles(await getVehicles());
      setRentals(await getRentals());
    } catch (err) {
      showMessage(
        "Could not load data. Is JSON Server running on port 3000?",
        "error",
      );
    }
  }

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
  }

  // ---------- Add / Edit ----------
  function openAddForm() {
    if (vehicles.length >= MAX_VEHICLES) {
      showMessage(
        "Vehicle limit reached. You can only keep 10 vehicles.",
        "error",
      );
      return;
    }
    setMessage("");
    setVehicleToEdit(null);
    setShowForm(true);
  }

  function openEditForm(vehicle) {
    setMessage("");
    setVehicleToEdit(vehicle);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setVehicleToEdit(null);
  }

  async function saveVehicle(vehicleData) {
    try {
      if (vehicleToEdit) {
        await updateVehicleApi(vehicleToEdit.id, {
          ...vehicleData,
          id: vehicleToEdit.id,
        });
        showMessage("Vehicle updated successfully.", "success");
      } else {
        await addVehicleApi(vehicleData);
        showMessage("Vehicle added successfully.", "success");
      }
      closeForm();
      await loadData();
    } catch (err) {
      showMessage(err.message, "error");
    }
  }

  // ---------- Delete ----------
  async function deleteVehicle(vehicle) {
    if (hasActiveRental(vehicle.id, rentals)) {
      showMessage(
        "This vehicle has an active rental and cannot be deleted.",
        "error",
      );
      return;
    }
    const sure = window.confirm(`Delete ${vehicle.name}?`);
    if (!sure) {
      return;
    }
    try {
      await deleteVehicleApi(vehicle.id);
      showMessage("Vehicle deleted successfully.", "success");
      await loadData();
    } catch (err) {
      showMessage(err.message, "error");
    }
  }

  // ---------- Rent ----------
  function openRentForm(vehicle) {
    setMessage("");
    setRentError("");
    setVehicleToRent(vehicle);
  }

  async function confirmRental(formData) {
    try {
      // 1. Check again with the server that nobody else rented this vehicle
      const latestRentals = await getRentals();
      if (hasActiveRental(vehicleToRent.id, latestRentals)) {
        setRentError("This vehicle already has an active rental.");
        setRentals(latestRentals);
        return;
      }

      // 2. Find the customer by mobile number, or create a new one
      const allCustomers = await getCustomers();
      let customer = allCustomers.find((c) => c.mobile === formData.mobile);
      if (!customer) {
        customer = await addCustomerApi({
          name: formData.customerName,
          mobile: formData.mobile,
          email: formData.email,
        });
      }

      // 3. Create the rental record
      await addRentalApi({
        customerId: customer.id,
        customerName: customer.name,
        customerMobile: customer.mobile,
        vehicleId: vehicleToRent.id,
        vehicleName: vehicleToRent.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: formData.days,
        pricePerDay: vehicleToRent.pricePerDay,
        totalCharges: formData.totalCharges,
        status: "Active",
      });

      // 4. Close the form, refresh and show success
      setVehicleToRent(null);
      await loadData();
      showMessage("Rental confirmed successfully.", "success");
    } catch (err) {
      setRentError(err.message);
    }
  }

  // ---------- Search ----------
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchText.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchText.toLowerCase());
      const isAvailable = !hasActiveRental(vehicle.id, rentals);
      const matchesStatus =
        vehicleStatus === "all" ||
        (vehicleStatus === "available" && isAvailable) ||
        (vehicleStatus === "rented" && !isAvailable);
      return matchesSearch && matchesStatus;
    });

  function selectVehicleStatus(status) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("status", status);
    setSearchParams(nextParams);
  }

  return (
    <div>
      <div className="page-header">
        <h2>Vehicles</h2>
        <button className="btn btn-primary" onClick={openAddForm}>
          Add New Vehicle
        </button>
      </div>

      {message && <p className={`message ${messageType}`}>{message}</p>}

      {showForm && (
        <VehicleForm
          key={vehicleToEdit ? vehicleToEdit.id : "new"}
          vehicleToEdit={vehicleToEdit}
          onSave={saveVehicle}
          onCancel={closeForm}
        />
      )}

      <section id="vehicle-list">
        <div className="vehicle-filters" aria-label="Filter vehicles">
          {[
            ["all", "All vehicles"],
            ["available", "Available"],
            ["rented", "Rented"],
          ].map(([status, label]) => (
            <button
              key={status}
              type="button"
              className={`vehicle-filter${vehicleStatus === status ? " active" : ""}`}
              aria-pressed={vehicleStatus === status}
              onClick={() => selectVehicleStatus(status)}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="search-box"
          placeholder="Search by name or type..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {filteredVehicles.length === 0 ? (
          <p className="empty-text">No vehicles found.</p>
        ) : (
          <div className="vehicle-grid">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAvailable={!hasActiveRental(vehicle.id, rentals)}
                onRent={openRentForm}
                onEdit={openEditForm}
                onDelete={deleteVehicle}
              />
            ))}
          </div>
        )}
      </section>

      {vehicleToRent && (
        <RentVehicleForm
          vehicle={vehicleToRent}
          onConfirm={confirmRental}
          onCancel={() => setVehicleToRent(null)}
          serverError={rentError}
        />
      )}
    </div>
  );
}

export default VehicleList;
