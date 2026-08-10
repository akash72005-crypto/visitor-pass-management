import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [visitors, setVisitors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await api.get("/visitors");
      setVisitors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pending = visitors.filter(
    (v) => v.status === "Pending"
  ).length;

  const approved = visitors.filter(
    (v) => v.status === "Approved"
  ).length;

  const rejected = visitors.filter(
    (v) => v.status === "Rejected"
  ).length;

  const checkedIn = visitors.filter(
    (v) => v.status === "Checked In"
  ).length;

  const checkedOut = visitors.filter(
    (v) => v.status === "Checked Out"
  ).length;

  const cancelled = visitors.filter(
    (v) => v.status === "Cancelled"
  ).length;

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>

        <div style={styles.logo}>
          Visitor Pass
        </div>

        <div style={styles.navLinks}>

          <button
            style={styles.navButton}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            style={styles.navButton}
            onClick={() => navigate("/visitor")}
          >
            Register Visitor
          </button>

          <button
            style={styles.navButton}
            onClick={() => navigate("/search")}
          >
            Search
          </button>

          <button
            style={styles.navButton}
            onClick={() => navigate("/reports")}
          >
            Reports
          </button>

          <button
            style={styles.navButton}
            onClick={() => navigate("/users")}
          >
            User Management
          </button>

          <button
            style={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* MAIN */}
      <main style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>

          <h1 style={styles.title}>
            Admin Dashboard
          </h1>

          <p style={styles.subtitle}>
            Welcome, Administrator
          </p>

        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.quickActions}>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/visitor")}
          >
            + Register Visitor
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/search")}
          >
            Search Visitors
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/reports")}
          >
            View Reports
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/users")}
          >
            Manage Users
          </button>

        </div>

        {/* STAT CARDS */}
        <div style={styles.cards}>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Total Visitors
            </p>

            <h2 style={styles.number}>
              {visitors.length}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Pending Requests
            </p>

            <h2 style={styles.number}>
              {pending}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Approved
            </p>

            <h2 style={styles.number}>
              {approved}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Rejected
            </p>

            <h2 style={styles.number}>
              {rejected}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Currently Inside
            </p>

            <h2 style={styles.number}>
              {checkedIn}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Checked Out
            </p>

            <h2 style={styles.number}>
              {checkedOut}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardTitle}>
              Cancelled
            </p>

            <h2 style={styles.number}>
              {cancelled}
            </h2>
          </div>

        </div>

        {/* RECENT VISITORS */}
        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <h2 style={styles.sectionTitle}>
              Recent Visitors
            </h2>

            <button
              style={styles.viewButton}
              onClick={fetchVisitors}
            >
              Refresh
            </button>

          </div>

          {visitors.length === 0 ? (

            <div style={styles.empty}>
              No visitors found.
            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>

                    <th style={styles.th}>
                      Visitor
                    </th>

                    <th style={styles.th}>
                      Employee
                    </th>

                    <th style={styles.th}>
                      Visit Date
                    </th>

                    <th style={styles.th}>
                      Purpose
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {visitors
                    .slice(0, 10)
                    .map((visitor) => (

                      <tr key={visitor._id}>

                        <td style={styles.td}>
                          <strong>
                            {visitor.visitorName}
                          </strong>

                          <br />

                          <small>
                            {visitor.phone}
                          </small>
                        </td>

                        <td style={styles.td}>
                          {visitor.employeeName}
                        </td>

                        <td style={styles.td}>

                          {visitor.visitDate
                            ? new Date(
                                visitor.visitDate
                              ).toLocaleDateString()
                            : "No Date"}

                        </td>

                        <td style={styles.td}>
                          {visitor.purpose}
                        </td>

                        <td style={styles.td}>

                          <span
                            style={{
                              ...styles.status,

                              background:
                                visitor.status ===
                                "Approved"
                                  ? "#dcfce7"
                                  : visitor.status ===
                                    "Rejected"
                                  ? "#fee2e2"
                                  : visitor.status ===
                                    "Checked In"
                                  ? "#dbeafe"
                                  : visitor.status ===
                                    "Checked Out"
                                  ? "#e5e7eb"
                                  : visitor.status ===
                                    "Cancelled"
                                  ? "#f3f4f6"
                                  : "#fef3c7",

                              color:
                                visitor.status ===
                                "Approved"
                                  ? "#166534"
                                  : visitor.status ===
                                    "Rejected"
                                  ? "#991b1b"
                                  : visitor.status ===
                                    "Checked In"
                                  ? "#1e40af"
                                  : visitor.status ===
                                    "Checked Out"
                                  ? "#374151"
                                  : visitor.status ===
                                    "Cancelled"
                                  ? "#6b7280"
                                  : "#92400e",
                            }}
                          >
                            {visitor.status}
                          </span>

                        </td>

                        {/* VISITOR PASS BUTTON */}
                        <td style={styles.td}>

                          {(
                            visitor.status === "Approved" ||
                            visitor.status === "Checked In" ||
                            visitor.status === "Checked Out"
                          ) && (

                            <button
                              style={styles.passButton}
                              onClick={() =>
                                navigate(
                                  `/visitor-pass/${visitor._id}`
                                )
                              }
                            >
                              Visitor Pass
                            </button>

                          )}

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#1f2937",
  },

  navbar: {
    minHeight: "70px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 5%",
    boxSizing: "border-box",
    flexWrap: "wrap",
    gap: "10px",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "700",
  },

  navLinks: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  navButton: {
    background: "transparent",
    border: "none",
    color: "white",
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: "14px",
  },

  logoutButton: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "10px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 0",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    fontSize: "36px",
    margin: 0,
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },

  quickActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },

  primaryButton: {
    border: "none",
    background: "#111827",
    color: "white",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryButton: {
    border: "1px solid #d1d5db",
    background: "white",
    color: "#111827",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    color: "#6b7280",
    margin: 0,
    fontSize: "14px",
  },

  number: {
    fontSize: "32px",
    margin: "12px 0 0",
  },

  section: {
    marginTop: "40px",
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
  },

  viewButton: {
    border: "none",
    background: "#111827",
    color: "white",
    padding: "9px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  passButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    background: "#f3f4f6",
    fontSize: "14px",
  },

  td: {
    padding: "15px 14px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },

  status: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
  },
};

export default AdminDashboard;