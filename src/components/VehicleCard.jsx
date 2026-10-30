// Shows one vehicle. All actions are passed in from the parent as props.
function VehicleCard({ vehicle, isAvailable, onRent, onEdit, onDelete }) {
  const imageSource = vehicle.image ? vehicle.image : `/images/${vehicle.type.toLowerCase()}.svg`;

  return (
    <div className="vehicle-card">
      <img src={imageSource} alt={vehicle.name} className="vehicle-image" />
      <div className="vehicle-info">
        <h3>{vehicle.name}</h3>
        <p>Type: {vehicle.type}</p>
        <p>₹{vehicle.pricePerDay} / day</p>
        <span className={isAvailable ? "badge badge-green" : "badge badge-red"}>
          {isAvailable ? "Available" : "Rented"}
        </span>
      </div>
      <div className="card-buttons">
        {isAvailable && (
          <button className="btn btn-primary" onClick={() => onRent(vehicle)}>
            Rent
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => onEdit(vehicle)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(vehicle)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default VehicleCard;
