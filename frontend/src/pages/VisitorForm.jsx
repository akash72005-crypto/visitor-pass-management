import { useState } from "react";
import api from "../services/api";

function VisitorForm() {
  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    employeeName: "",
    employeeEmail: "",
    visitDate: "",
    expectedArrivalTime: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/visitors/create",
        formData
      );

      alert(res.data.message);

      setFormData({
        visitorName: "",
        phone: "",
        employeeName: "",
        employeeEmail: "",
        visitDate: "",
        expectedArrivalTime: "",
        purpose: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Visitor registration failed"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Visitor Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="visitorName"
          placeholder="Visitor Name"
          value={formData.visitorName}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="employeeName"
          placeholder="Employee Name"
          value={formData.employeeName}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="email"
          name="employeeEmail"
          placeholder="Employee Email"
          value={formData.employeeEmail}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Visit Date</label>

        <br />

        <input
          type="date"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Expected Arrival Time</label>

        <br />

        <input
          type="time"
          name="expectedArrivalTime"
          value={formData.expectedArrivalTime}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="purpose"
          placeholder="Purpose of Visit"
          value={formData.purpose}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Register Visitor
        </button>
      </form>
    </div>
  );
}

export default VisitorForm;