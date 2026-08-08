import {useState} from "react";
import api from "../services/api";


function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");


const login=async(e)=>{

e.preventDefault();

try{

const res=await api.post("/admin/login",{
email,
password
});


alert(res.data.message);

localStorage.setItem("admin",true);

window.location.href="/dashboard";


}catch(error){

alert("Login Failed");

}

};


return(

<div>

<h2>Admin Login</h2>


<form onSubmit={login}>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>


<input
placeholder="Password"
type="password"
onChange={(e)=>setPassword(e.target.value)}
/>


<button>
Login
</button>


</form>

</div>

)

}


export default Login;