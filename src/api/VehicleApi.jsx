const BASE_URL = "http://localhost:3000/vehicles";

export async function getVehicles() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Could not load vehicles");
  }
  return await response.json();
}

export async function getVehicleById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Could not load the vehicle");
  }
  return await response.json();
}

export async function addVehicleApi(vehicle) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!response.ok) {
    throw new Error("Could not add the vehicle");
  }
  return await response.json();
}

export async function updateVehicleApi(id, vehicle) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!response.ok) {
    throw new Error("Could not update the vehicle");
  }
  return await response.json();
}

export async function deleteVehicleApi(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Could not delete the vehicle");
  }
}
