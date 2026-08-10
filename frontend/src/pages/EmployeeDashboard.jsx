import { useEffect, useState } from "react";
import api from "../services/api";

function EmployeeDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVisitors = async () => {
    try {
      const res = await api.get("/visitors");

      const pendingVisitors = res.data.filter(
        (visitor) => visitor.status === "Pending"
      );

      setVisitors(pendingVisitors);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load visitor requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleApprove = async (id) => {
    const remarks = prompt("Enter remarks (optional):");

    try {
      await api.put(`/visitors/${id}/approve`, {
        remarks: remarks || "",
      });

      alert("Visitor approved successfully");

      loadVisitors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Approval failed"
      );
    }
  };

  const handleReject = async (id) => {
    const remarks = prompt("Enter rejection reason:");

    try {
      await api.put(`/visitors/${id}/reject`, {
        remarks: remarks || "",
      });

      alert("Visitor rejected successfully");

      loadVisitors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Rejection failed"
      );
    }
  };

  if (loading) {
    return <h2>Loading visitor requests...</h2>;
  }

  return (
    <div>
      <h1>Employee Dashboard</h1>

      <h2>Pending Visitor Requests</h2>

      {visitors.length === 0 ? (
        <p>No pending visitor requests.</p>
      ) : (
        visitors.map((visitor) => (
          <div
            key={visitor._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Visitor:</strong>{" "}
              {visitor.visitorName}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {visitor.phone}
            </p>

            <p>
              <strong>Visit Date:</strong>{" "}
              {new Date(
                visitor.visitDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Arrival:</strong>{" "}
              {visitor.expectedArrivalTime}
            </p>

            <p>
              <strong>Purpose:</strong>{" "}
              {visitor.purpose}
            </p>

            <button
              onClick={() =>
                handleApprove(visitor._id)
              }
            >
              Approve
            </button>

            {" "}

            <button
              onClick={() =>
                handleReject(visitor._id)
              }
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeDashboard;