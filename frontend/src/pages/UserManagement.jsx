import { useEffect, useState } from "react";
import api from "../services/api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receptionist");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/users/create", {
        name,
        email,
        password,
        role,
      });

      alert(res.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setRole("receptionist");

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "User creation failed"
      );
    }
  };

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <h1>User Management</h1>

      <p>
        Admin can create and manage Receptionist
        and Employee accounts.
      </p>

      {/* CREATE USER */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "25px",
          maxWidth: "500px",
        }}
      >
        <h2>Create User</h2>

        <form onSubmit={createUser}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
            <option value="receptionist">
              Receptionist
            </option>

            <option value="employee">
              Employee
            </option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Create User
          </button>
        </form>
      </div>

      {/* USERS LIST */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "30px",
          overflowX: "auto",
        }}
      >
        <h2>Users</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle}>
                    {user.name}
                  </td>

                  <td style={tdStyle}>
                    {user.email}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "15px",
                        background:
                          user.role === "admin"
                            ? "#fee2e2"
                            : user.role === "employee"
                            ? "#dbeafe"
                            : "#dcfce7",
                      }}
                    >
                      {user.role}
                    </span>
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "6px",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  background: "#f3f4f6",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

export default UserManagement;