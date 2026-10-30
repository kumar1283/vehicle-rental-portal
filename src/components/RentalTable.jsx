// Shows a list of rentals in a table.
// Pass onMarkReturned to show the "Mark Returned" action column.
function RentalTable({ rentals, onMarkReturned }) {
  if (rentals.length === 0) {
    return <p className="empty-text">No rentals found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Vehicle</th>
            <th>Start</th>
            <th>End</th>
            <th>Days</th>
            <th>Price/Day</th>
            <th>Total</th>
            <th>Status</th>
            {onMarkReturned && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id}>
              <td>{rental.customerName}</td>
              <td>{rental.customerMobile}</td>
              <td>{rental.vehicleName}</td>
              <td>{rental.startDate}</td>
              <td>{rental.endDate}</td>
              <td>{rental.days}</td>
              <td>₹{rental.pricePerDay}</td>
              <td>₹{rental.totalCharges}</td>
              <td>
                <span className={rental.status === "Active" ? "badge badge-red" : "badge badge-green"}>
                  {rental.status}
                </span>
              </td>
              {onMarkReturned && (
                <td>
                  {rental.status === "Active" ? (
                    <button className="btn btn-primary btn-small" onClick={() => onMarkReturned(rental)}>
                      Mark Returned
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RentalTable;
