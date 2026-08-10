import { useEffect, useState } from "react";
import api from "../services/api";

function ReceptionistDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Get all visitors
  const fetchVisitors = async () => {
    try {
      const res = await api.get("/visitors");
      setVisitors(res.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load visitors");
    } finally {
      setLoading(false);
    }
  };

  // Check In
  const checkIn = async (id) => {
    try {
      const res = await api.put(`/visitors/${id}/checkin`);

      alert(res.data.message);
      fetchVisitors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Check-in failed"
      );
    }
  };

  // Check Out
  const checkOut = async (id) => {
    try {
      const res = await api.put(`/visitors/${id}/checkout`);

      alert(res.data.message);
      fetchVisitors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Check-out failed"
      );
    }
  };

  // Cancel Visitor
  const cancelVisitor = async (id) => {
    try {
      const res = await api.put(
        `/visitors/${id}/cancel`
      );

      alert(res.data.message);
      fetchVisitors();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Cancel failed"
      );
    }
  };

  // View Activity History
  const viewActivity = async (visitor) => {
    setSelectedVisitor(visitor);
    setActivityHistory([]);
    setActivityLoading(true);

    try {
      const res = await api.get(
        `/visitors/${visitor._id}/activity`
      );

      setActivityHistory(
        res.data.activityHistory || []
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to load activity history"
      );
    } finally {
      setActivityLoading(false);
    }
  };

  // Close Activity Modal
  const closeActivity = () => {
    setSelectedVisitor(null);
    setActivityHistory([]);
    setActivityLoading(false);
  };

  // Status Style
  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "Rejected") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (status === "Checked In") {
      return {
        background: "#dbeafe",
        color: "#1e40af",
      };
    }

    if (status === "Checked Out") {
      return {
        background: "#e5e7eb",
        color: "#374151",
      };
    }

    if (status === "Cancelled") {
      return {
        background: "#f3f4f6",
        color: "#6b7280",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  // Format Date
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <h1>Receptionist Dashboard</h1>

      <p>
        Register visitors and manage check-in /
        check-out.
      </p>

      {/* Register Visitor */}
      <button
        onClick={() =>
          (window.location.href = "/visitor")
        }
        style={{
          padding: "10px 18px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "25px",
        }}
      >
        + Register Visitor
      </button>

      {/* Visitor Table */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          overflowX: "auto",
        }}
      >
        <h2>Visitor History</h2>

        {visitors.length === 0 ? (
          <p>No visitors found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Visitor</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Employee</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Purpose</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td style={tdStyle}>
                    {visitor.visitorName}
                  </td>

                  <td style={tdStyle}>
                    {visitor.phone}
                  </td>

                  <td style={tdStyle}>
                    {visitor.employeeName}
                  </td>

                  <td style={tdStyle}>
                    {formatDate(visitor.visitDate)}
                  </td>

                  <td style={tdStyle}>
                    {visitor.purpose}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        ...getStatusStyle(
                          visitor.status
                        ),
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {visitor.status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {/* Check In */}
                    {visitor.status === "Approved" && (
                      <button
                        onClick={() =>
                          checkIn(visitor._id)
                        }
                        style={actionButton}
                      >
                        Check In
                      </button>
                    )}
                  {visitor.status === "Approved" && (
  <button
    onClick={() =>
      (window.location.href = `/pass/${visitor._id}`)
    }
    style={{
      ...actionButton,
      background: "#6366f1",
      marginLeft: "5px",
    }}
  >
    Generate Pass
  </button>
)}

                    {/* Check Out */}
                    {visitor.status === "Checked In" && (
                      <button
                        onClick={() =>
                          checkOut(visitor._id)
                        }
                        style={{
                          ...actionButton,
                          background: "#dc2626",
                        }}
                      >
                        Check Out
                      </button>
                    )}

                    {/* Cancel */}
                    {visitor.status === "Pending" && (
                      <button
                        onClick={() =>
                          cancelVisitor(visitor._id)
                        }
                        style={{
                          ...actionButton,
                          background: "#f59e0b",
                          marginLeft: "5px",
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    {/* Activity */}
                    <button
                      onClick={() =>
                        viewActivity(visitor)
                      }
                      style={{
                        ...actionButton,
                        background: "#6366f1",
                        marginLeft: "5px",
                      }}
                    >
                      Activity
                    </button>

                    {/* No Action */}
                    {visitor.status !== "Approved" &&
                      visitor.status !== "Checked In" &&
                      visitor.status !== "Pending" && (
                        <span
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          -
                        </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Activity History Modal */}
      {selectedVisitor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              color: "#111827",
              width: "500px",
              maxWidth: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "10px",
              padding: "25px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h2>Activity History</h2>

            <p>
              <strong>Visitor:</strong>{" "}
              {selectedVisitor.visitorName}
            </p>

            <p>
              <strong>Employee:</strong>{" "}
              {selectedVisitor.employeeName}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedVisitor.status}
            </p>

            <hr />

            {activityLoading ? (
              <p>Loading activity...</p>
            ) : activityHistory.length === 0 ? (
              <p>No activity found.</p>
            ) : (
              activityHistory.map(
                (activity, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>
                      {activity.action}
                    </strong>

                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      Date & Time:{" "}
                      {activity.dateTime
                        ? new Date(
                            activity.dateTime
                          ).toLocaleString()
                        : "N/A"}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      Performed By:{" "}
                      {activity.performedBy ||
                        "System"}
                    </p>
                  </div>
                )
              )
            )}

            <button
              onClick={closeActivity}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  background: "#f3f4f6",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const actionButton = {
  padding: "7px 12px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ReceptionistDashboard;