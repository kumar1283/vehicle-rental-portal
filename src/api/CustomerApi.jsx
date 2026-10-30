const BASE_URL = "http://localhost:3000/customers";

export async function getCustomers() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Could not load customers");
  }
  return await response.json();
}

export async function getCustomerById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Could not load the customer");
  }
  return await response.json();
}

export async function addCustomerApi(customer) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    throw new Error("Could not save the customer");
  }
  return await response.json();
}
