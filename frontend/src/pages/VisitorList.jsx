import { useEffect, useState } from "react";
import api from "../services/api";

function VisitorList() {

  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    getVisitors();
  }, []);

  const getVisitors = async () => {
    try {
      const res = await api.get("/visitors/all");
      setVisitors(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <h2>Visitor List</h2>

      {visitors.map((visitor) => (
        <div key={visitor._id}>
          <h3>{visitor.name}</h3>
          <p>Phone: {visitor.phone}</p>
          <p>Purpose: {visitor.purpose}</p>
          <p>Meet: {visitor.whomToMeet}</p>
          <hr />
        </div>
      ))}

    </div>
  );
}

export default VisitorList;