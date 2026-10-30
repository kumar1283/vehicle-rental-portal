import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import VehicleList from "./pages/VehicleList.jsx";
import CustomerList from "./pages/CustomerList.jsx";
import RentalList from "./pages/RentalList.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/rentals" element={<RentalList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
