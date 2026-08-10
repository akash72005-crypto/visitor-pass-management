import { useEffect, useState } from "react";
import api from "../services/api";

function VisitorHistory() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await api.get("/visitors");

      const history = res.data.filter(
        (visitor) =>
          visitor.status === "Checked Out" ||
          visitor.status === "Rejected" ||
          visitor.status === "Cancelled"
      );

      setVisitors(history);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load visitor history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return <h2>Loading history...</h2>;
  }

  return (
    <div>
      <h1>Visitor History</h1>

      {visitors.length === 0 ? (
        <p>No visitor history found.</p>
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
              <strong>Employee:</strong>{" "}
              {visitor.employeeName}
            </p>

            <p>
              <strong>Visit Date:</strong>{" "}
              {new Date(
                visitor.visitDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {visitor.status}
            </p>

            {visitor.checkInTime && (
              <p>
                <strong>Check In:</strong>{" "}
                {new Date(
                  visitor.checkInTime
                ).toLocaleString()}
              </p>
            )}

            {visitor.checkOutTime && (
              <p>
                <strong>Check Out:</strong>{" "}
                {new Date(
                  visitor.checkOutTime
                ).toLocaleString()}
              </p>
            )}

            <h4>Activity History</h4>

            {visitor.activityHistory?.map(
              (activity, index) => (
                <p key={index}>
                  {activity.action} —{" "}
                  {new Date(
                    activity.dateTime
                  ).toLocaleString()}{" "}
                  — {activity.performedBy}
                </p>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default VisitorHistory;