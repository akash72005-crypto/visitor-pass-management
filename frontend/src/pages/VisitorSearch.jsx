import { useEffect, useState } from "react";
import api from "../services/api";

function VisitorSearch() {
  const [filters, setFilters] = useState({
    visitorName: "",
    employeeName: "",
    visitDate: "",
    status: "",
  });

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all visitors when page opens
  useEffect(() => {
    loadAllVisitors();
  }, []);

  const loadAllVisitors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/visitors");

      setVisitors(res.data);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to load visitors"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const searchVisitors = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.visitorName) {
        params.append(
          "visitorName",
          filters.visitorName
        );
      }

      if (filters.employeeName) {
        params.append(
          "employeeName",
          filters.employeeName
        );
      }

      if (filters.visitDate) {
        params.append(
          "visitDate",
          filters.visitDate
        );
      }

      if (filters.status) {
        params.append(
          "status",
          filters.status
        );
      }

      const res = await api.get(
        `/visitors/search?${params.toString()}`
      );

      setVisitors(res.data);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Search failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      visitorName: "",
      employeeName: "",
      visitDate: "",
      status: "",
    });

    loadAllVisitors();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <h1>Search Visitors</h1>

      {/* FILTER SECTION */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <form onSubmit={searchVisitors}>
          <input
            name="visitorName"
            placeholder="Visitor Name"
            value={filters.visitorName}
            onChange={handleChange}
            style={{
              padding: "10px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            name="employeeName"
            placeholder="Employee Name"
            value={filters.employeeName}
            onChange={handleChange}
            style={{
              padding: "10px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="date"
            name="visitDate"
            value={filters.visitDate}
            onChange={handleChange}
            style={{
              padding: "10px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            style={{
              padding: "10px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Checked In">
              Checked In
            </option>
            <option value="Checked Out">
              Checked Out
            </option>
            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          <br />

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            style={{
              padding: "10px 20px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </form>
      </div>

      {/* RESULTS */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "25px",
          overflowX: "auto",
        }}
      >
        <h2>
          Search Results ({visitors.length})
        </h2>

        {loading ? (
          <p>Loading visitors...</p>
        ) : visitors.length === 0 ? (
          <p>No visitors found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Phone</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>
                    {visitor.visitorName}
                  </td>

                  <td>
                    {visitor.phone}
                  </td>

                  <td>
                    {visitor.employeeName}
                  </td>

                  <td>
                    {visitor.visitDate
                      ? new Date(
                          visitor.visitDate
                        ).toLocaleDateString()
                      : "No Date"}
                  </td>

                  <td>
                    {visitor.purpose}
                  </td>

                  <td>
                    {visitor.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VisitorSearch;