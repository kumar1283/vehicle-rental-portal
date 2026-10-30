import { useState } from "react";

function CustomerForm(props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (name.trim() === "" || phone.trim() === "") {
      props.showMessage("Customer name and phone number are required.");
      return;
    }

    props.addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    setName("");
    setPhone("");
    setEmail("");
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>Full name
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>Phone number
        <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
      </label>
      <label>Email (optional)
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <div className="form-actions">
        <button className="button primary" type="submit">Add Customer</button>
      </div>
    </form>
  );
}

export default CustomerForm;
