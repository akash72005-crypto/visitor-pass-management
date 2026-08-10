import { useState } from "react";
import api from "../services/api";

function Reports() {
  const [period, setPeriod] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    try {
      const params = new URLSearchParams();

      params.append("period", period);

      if (period === "custom") {
        if (!startDate || !endDate) {
          alert("Please select start and end dates");
          return;
        }

        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const res = await api.get(
        `/visitors/reports?${params.toString()}`
      );

      setReport(res.data.report);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to generate report"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <h1>Visitor Reports</h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <label>Report Period</label>

        <br />

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: "10px",
            marginTop: "8px",
          }}
        >
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="custom">Custom</option>
        </select>

        {period === "custom" && (
          <div style={{ marginTop: "20px" }}>
            <label>Start Date</label>

            <br />

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />

            <br />
            <br />

            <label>End Date</label>

            <br />

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
          </div>
        )}

        <br />

        <button
          onClick={generateReport}
          style={{
            padding: "10px 20px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Generate Report
        </button>
      </div>

      {report && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <ReportCard
            title="Total Visitors"
            value={report.totalVisitors}
          />

          <ReportCard
            title="Pending"
            value={report.pending}
          />

          <ReportCard
            title="Approved"
            value={report.approved}
          />

          <ReportCard
            title="Rejected"
            value={report.rejected}
          />

          <ReportCard
            title="Checked In"
            value={report.checkedIn}
          />

          <ReportCard
            title="Checked Out"
            value={report.checkedOut}
          />

          <ReportCard
            title="Cancelled"
            value={report.cancelled}
          />
        </div>
      )}
    </div>
  );
}

function ReportCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ color: "#6b7280" }}>
        {title}
      </p>

      <h2>{value}</h2>
    </div>
  );
}

export default Reports;