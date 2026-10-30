import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <img className="brand-logo" src="/images/logo.png" alt="" />
        <h1 className="logo">Vehicle Rental Portal</h1>
      </div>
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/vehicles">Vehicles</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/rentals">Rentals</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
