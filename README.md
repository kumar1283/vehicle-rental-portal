# Vehicle Rental Management Portal

React + Vite + React Router + JSON Server capstone project.

## Folder structure

```text
vehicle-rental-portal/
├── public/images/        (car, bike, scooter, van placeholder images)
├── src/
│   ├── api/              VehicleApi.jsx, CustomerApi.jsx, RentalApi.jsx
│   ├── assets/
│   ├── components/       Navbar, VehicleForm, VehicleCard, RentVehicleForm, RentalTable
│   ├── pages/            Home, VehicleList, CustomerList, RentalList
│   ├── App.jsx, App.css, index.css, main.jsx
├── db.json  index.html  package.json  vite.config.js  README.md
```

## Install and run

```bash
npm install
npm run server     # terminal 1: JSON Server on http://localhost:3000
npm run dev        # terminal 2: React app (usually http://localhost:5173)
npm run build      # production build
```

Both servers must be running. If the server is off, pages show an error message.

## Rules used in this project

- **Date counting:** both the start day and the end day count.
  Same start and end date = 1 day. 10 Jan to 12 Jan = 3 days.
  `Rental Charges = Number of Days x Price Per Day`.
- **Availability:** a vehicle is "Rented" when it has a rental with status `Active`.
  Otherwise it is "Available". This is calculated from the rentals data
  (`hasActiveRental` in `RentalApi.jsx`), so it can never get out of sync.
  Marking a rental as Returned makes the vehicle available again.
- **Double booking:** before saving a rental, the app re-checks the server for an
  active rental on that vehicle.
- **Customers:** found by mobile number (10 digits). If the number exists, the
  existing customer is reused, so no duplicates are created.
- **Customers page:** shows each customer's **latest rental** (highest rental id).
- **Images:** uploaded images are saved as base64 text in `db.json`. Max size 200 KB.
  With no upload, a local placeholder for the vehicle type is shown.
- **Vehicle limit:** maximum 10 vehicles.

## How to test

**Add a vehicle:** Vehicles > Add New Vehicle > fill name, type, price, (optional image) > Save Vehicle.
Refresh the page: it is still there. Add vehicles until you reach 10 to see the limit message.

**Edit:** click Edit on a card, change a value, Update Vehicle.

**Delete:** click Delete > confirm. A vehicle with an Active rental shows an error instead.

**Rent:** click Rent on an available card > enter name, a 10-digit mobile, dates > Confirm Rental.
You see a success message and the card changes to "Rented" (Rent button disabled).

**Verify the rental appears in Rentals and Customers:**
1. Go to Rentals: the new row shows status Active.
2. Go to Customers: the customer is listed with the vehicle, dates, charges and status.
3. Rent another vehicle with the same mobile number: Customers still shows one customer
   (latest rental shown), Rentals shows two rows.
4. In Rentals click Mark Returned > confirm. Status becomes Returned and the vehicle is available again.

## Explanation for project review

**API files** (only `fetch`, no JSX)
- `VehicleApi.jsx`: get all, get by id, add (POST), update (PUT), delete.
- `CustomerApi.jsx`: get all, get by id, add (POST).
- `RentalApi.jsx`: get all, get by id, add (POST), update status (PUT), and `hasActiveRental`.

**Components** (reusable UI, data comes in through props)
- `Navbar`: links to the four pages using `NavLink`.
- `VehicleCard`: shows one vehicle with Rent, Edit and Delete buttons.
- `VehicleForm`: add/edit form with image upload, preview and validation.
- `RentVehicleForm`: rent popup, calculates days and charges, validates input.
- `RentalTable`: table of rentals, optional Mark Returned button.

**Pages** (fetch data and hold the main logic)
- `Home`: dashboard cards calculated from the API data plus the 5 newest rentals.
- `VehicleList`: card grid, search, add/edit/delete, and `confirmRental`.
- `CustomerList`: read-only customer table with search.
- `RentalList`: read-only rentals with search and Mark Returned.
