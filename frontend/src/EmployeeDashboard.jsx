import { useEffect, useState } from "react";
import api from "../services/api";

function EmployeeDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

 const fetchVisitors = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const res = await api.get(
      `/visitors/employee/${user.email}`
    );

    setVisitors(res.data);
  } catch (error) {
    console.log(error);
    alert("Unable to load visitor requests");
  } finally {
    setLoading(false);
  }
};
     const user = JSON.parse(localStorage.getItem("user"));

const res = await api.get(
  `/visitors/employee/${user.email}`
);
      setVisitors(res.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load visitor requests");
    } finally {
      setLoading(false);
    }
  };

  // Approve Visitor
  const approveVisitor = async (id) => {
    const remarks = window.prompt(
      "Enter remarks (optional):"
    );

    try {
      const res = await api.put(
        `/visitors/${id}/approve`,
        {
          remarks: remarks || "",
        }
      );

      alert(res.data.message);

      fetchVisitors();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Approval failed"
      );
    }
  };

  // Reject Visitor
  const rejectVisitor = async (id) => {
    const remarks = window.prompt(
      "Enter rejection remarks:"
    );

    try {
      const res = await api.put(
        `/visitors/${id}/reject`,
        {
          remarks: remarks || "",
        }
      );

      alert(res.data.message);

      fetchVisitors();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Rejection failed"
      );
    }
  };

  // Format date safely
  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
    }

    return parsedDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <h2 style={{ padding: "30px" }}>
        Loading...
      </h2>
    );
  }

  const pendingVisitors = visitors.filter(
    (visitor) => visitor.status === "Pending"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <h1>Employee Dashboard</h1>

      <p>
        Review and manage visitor requests.
      </p>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "25px",
        }}
      >
        <h2>
          Pending Requests (
          {pendingVisitors.length})
        </h2>

        {pendingVisitors.length === 0 ? (
          <p>
            No pending visitor requests.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {pendingVisitors.map((visitor) => (
              <div
                key={visitor._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "18px",
                }}
              >
                <h3>
                  {visitor.visitorName}
                </h3>

                <p>
                  <strong>Phone:</strong>{" "}
                  {visitor.phone}
                </p>

                <p>
                  <strong>Employee:</strong>{" "}
                  {visitor.employeeName}
                </p>

                <p>
                  <strong>Visit Date:</strong>{" "}
                  {formatDate(visitor.visitDate)}
                </p>

                <p>
                  <strong>Arrival:</strong>{" "}
                  {visitor.expectedArrivalTime}
                </p>

                <p>
                  <strong>Purpose:</strong>{" "}
                  {visitor.purpose}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {visitor.status}
                  </span>
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      approveVisitor(
                        visitor._id
                      )
                    }
                    style={{
                      padding: "9px 15px",
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectVisitor(
                        visitor._id
                      )
                    }
                    style={{
                      padding: "9px 15px",
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;