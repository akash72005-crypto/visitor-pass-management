import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import api from "../services/api";
import "./VisitorPass.css";


function VisitorPass(){

const {id}=useParams();

const [visitor,setVisitor]=useState(null);


useEffect(()=>{
 getVisitor();
},[]);


const getVisitor=async()=>{

 const res=await api.get(`/visitors/${id}`);

 setVisitor(res.data);

};


if(!visitor){
 return <h2>Loading...</h2>
}


return(

<div className="pass-card">

<h1>VISITOR PASS</h1>

<hr/>

<h2>{visitor.name}</h2>

<p>Phone: {visitor.phone}</p>

<p>Purpose: {visitor.purpose}</p>

<p>Meet: {visitor.whomToMeet}</p>

<p>
Status: {visitor.status}
</p>


<QRCodeCanvas
value={visitor._id}
size={150}
/>


<p>
Pass ID:
</p>

<small>
{visitor._id}
</small>


<br/><br/>


<button onClick={()=>window.print()}>
Print Pass
</button>


</div>

)

}


export default VisitorPass;