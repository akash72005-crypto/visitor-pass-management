import { useState } from "react";
import api from "../services/api";

function VisitorForm() {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    purpose: "",
    whomToMeet: ""
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await api.post("/visitors/add", formData);

      alert(res.data.message);

      setFormData({
        name: "",
        phone: "",
        purpose: "",
        whomToMeet: ""
      });

    } catch (error) {

      alert(error.message);

    }

  };


  return (
    <div>

      <h2>Visitor Pass Form</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Visitor Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="purpose"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="whomToMeet"
          placeholder="Whom To Meet"
          value={formData.whomToMeet}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Submit
        </button>

      </form>

    </div>
  );
}


export default VisitorForm;