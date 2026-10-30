import { useState } from "react";

const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB keeps db.json small

// Used for both Add and Edit. If vehicleToEdit is given, the form starts filled in.
function VehicleForm({ vehicleToEdit, onSave, onCancel }) {
  const [name, setName] = useState(vehicleToEdit ? vehicleToEdit.name : "");
  const [type, setType] = useState(vehicleToEdit ? vehicleToEdit.type : "Car");
  const [pricePerDay, setPricePerDay] = useState(vehicleToEdit ? vehicleToEdit.pricePerDay : "");
  const [image, setImage] = useState(vehicleToEdit ? vehicleToEdit.image : "");
  const [error, setError] = useState("");

  // Reads the chosen file and stores it as a base64 text string
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image is too large. Please choose an image under 200 KB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (name.trim() === "") {
      setError("Vehicle name is required.");
      return;
    }
    if (pricePerDay === "" || Number(pricePerDay) <= 0) {
      setError("Price per day must be greater than 0.");
      return;
    }
    setError("");
    onSave({ name: name.trim(), type, pricePerDay: Number(pricePerDay), image });
  }

  const previewSource = image ? image : `/images/${type.toLowerCase()}.svg`;

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h2>{vehicleToEdit ? "Edit Vehicle" : "Add New Vehicle"}</h2>
      {error && <p className="message error">{error}</p>}

      <label>Vehicle name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Vehicle type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Car</option>
        <option>Bike</option>
        <option>Scooter</option>
        <option>Van</option>
      </select>

      <label>Price per day (₹)</label>
      <input type="number" min="1" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />

      <label>Image (optional, max 200 KB)</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <img src={previewSource} alt="Preview" className="image-preview" />

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {vehicleToEdit ? "Update Vehicle" : "Save Vehicle"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default VehicleForm;
