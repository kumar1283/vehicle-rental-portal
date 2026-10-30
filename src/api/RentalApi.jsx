const BASE_URL = "http://localhost:3000/rentals";

export async function getRentals() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Could not load rentals");
  }
  return await response.json();
}

export async function getRentalById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Could not load the rental");
  }
  return await response.json();
}

export async function addRentalApi(rental) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rental),
  });
  if (!response.ok) {
    throw new Error("Could not save the rental");
  }
  return await response.json();
}

// Sends the whole rental back with a new status (for example "Returned")
export async function updateRentalApi(id, rental) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rental),
  });
  if (!response.ok) {
    throw new Error("Could not update the rental");
  }
  return await response.json();
}

// Availability rule used everywhere:
// a vehicle is rented when it has a rental with status "Active".
export function hasActiveRental(vehicleId, rentals) {
  return rentals.some(
    (rental) => String(rental.vehicleId) === String(vehicleId) && rental.status === "Active"
  );
}
