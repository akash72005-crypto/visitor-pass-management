import { useEffect, useState } from "react";
import { FaUsers, FaUserClock, FaCheckCircle } from "react-icons/fa";
import api from "../services/api";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";


function AdminDashboard()  {
const [search, setSearch] = useState("");

const checkoutVisitor = async (id) => {

  try {

    await api.put(`/visitors/checkout/${id}`);

    alert("Visitor Checked Out");

    fetchVisitors();

  } catch (error) {

    console.log(error);

    alert("Checkout failed");

  }

};

  const [visitors, setVisitors] = useState([]);
  
const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);


  const fetchVisitors = async () => {

    try {

      const res = await api.get("/visitors/all");
      setVisitors(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  const updateStatus = async (id, status) => {

    try {

      await api.put(`/visitors/status/${id}`, {
        status
      });

      alert("Status Updated");

      fetchVisitors();

    } catch (error) {

      console.log(error);
      alert("Update failed");

    }

  };
const filteredVisitors = visitors.filter((visitor)=>{

  return (
    visitor.name.toLowerCase()
    .includes(search.toLowerCase())
  );

});

  const pendingCount = visitors.filter(
    (visitor) => visitor.status === "Pending"
  ).length;


  const approvedCount = visitors.filter(
    (visitor) => visitor.status === "Approved"
  ).length;



  return (

    <div className="dashboard">


      <aside className="sidebar">

        <h2>Visitor Pass</h2>

        <p>Dashboard</p>
        <p onClick={() => navigate("/visitor")}>
  Visitors
</p>
        <p>Settings</p>

      </aside>



      <main className="main">


        <h1>Admin Dashboard</h1>



        <div className="cards">


          <div className="card">

            <FaUsers />

            <h3>Total Visitors</h3>

            <span>
              {visitors.length}
            </span>

          </div>




          <div className="card">

            <FaUserClock />

            <h3>Pending</h3>

            <span>
              {pendingCount}
            </span>

          </div>




          <div className="card">

            <FaCheckCircle />

            <h3>Approved</h3>

            <span>
              {approvedCount}
            </span>

          </div>



        </div>





        <div className="table-container">

<input
  type="text"
  placeholder="Search Visitor Name..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
/><h2>Recent Visitors</h2>



          <table>


            <thead>

              <tr>

               <th>Name</th>
<th>Phone</th>
<th>Purpose</th>
<th>Meet</th>
<th>Entry Time</th>
<th>Exit Time</th>
<th>Status</th>
<th>Action</th>

              </tr>

            </thead>




            <tbody>


              {filteredVisitors.map((visitor)=>(


                <tr key={visitor._id}>


                  <td>
                    {visitor.name}
                  </td>


                  <td>
                    {visitor.phone}
                  </td>


                  <td>
                    {visitor.purpose}
                  </td>


                  <td>
                    {visitor.whomToMeet}
                  </td>


                <td>
  {visitor.entryTime
    ? new Date(visitor.entryTime).toLocaleString()
    : "-"}
</td>

<td>
  {visitor.exitTime
    ? new Date(visitor.exitTime).toLocaleString()
    : "-"}
</td>

                <td>
{
 new Date(visitor.createdAt)
 .toLocaleString()
}
</td>


                  <td>

                    <span className={`status ${visitor.status}`}>

                      {visitor.status}

                    </span>

                  </td>



                  <td>


                    <button
                    onClick={() =>
                      updateStatus(visitor._id,"Approved")
                    }
                    >
                      Approve
                    </button>

{visitor.status === "Approved" && (
  <button
    onClick={() => checkoutVisitor(visitor._id)}
  >
    Check Out
  </button>
)}

                    <button
                    onClick={() =>
                      updateStatus(visitor._id,"Rejected")
                    }
                    >
                      Reject
                    </button>

{visitor.status === "Approved" && (

<button
onClick={() => window.open(`/pass/${visitor._id}`, "_blank")}
>
Generate Pass
</button>

)}


                  </td>



                </tr>


              ))}


            </tbody>


          </table>


        </div>


      </main>


    </div>

  );

}


export default AdminDashboard;