import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import api from "../services/api";
import "./VisitorPass.css";

function VisitorPass() {
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getVisitor();
  }, [id]);

  const getVisitor = async () => {
    try {
      const res = await api.get(`/visitors/${id}`);
      setVisitor(res.data);
    } catch (error) {
      console.log(error);
      setError("Unable to load visitor pass");
    }
  };

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!visitor) {
    return <h2>Loading Visitor Pass...</h2>;
  }

  return (
    <div className="pass-page">
      <div className="visitor-pass">
        <h1>Visitor Pass</h1>

        <p>
          <strong>Visitor:</strong> {visitor.visitorName}
        </p>

        <p>
          <strong>Phone:</strong> {visitor.phone}
        </p>

        <p>
          <strong>Employee:</strong> {visitor.employeeName}
        </p>

        <p>
          <strong>Visit Date:</strong>{" "}
          {new Date(visitor.visitDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Arrival Time:</strong>{" "}
          {visitor.expectedArrivalTime}
        </p>

        <p>
          <strong>Purpose:</strong> {visitor.purpose}
        </p>

        <p>
          <strong>Status:</strong> {visitor.status}
        </p>

        <div className="qr">
          <QRCodeCanvas
            value={visitor._id}
            size={180}
          />
        </div>

        <button onClick={() => window.print()}>
          Print Pass
        </button>
      </div>
    </div>
  );
}

export default VisitorPass;