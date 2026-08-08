import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VisitorForm from "./pages/VisitorForm";
import VisitorPass from "./pages/VisitorPass";


function App() {

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<AdminDashboard />} />

      <Route path="/visitor" element={<VisitorForm />} />

      <Route 
path="/pass/:id" 
element={<VisitorPass />} 
/>
<Route 
 path="/visitor" 
 element={<VisitorForm />} 
/>

    </Routes>
  );
}

export default App;