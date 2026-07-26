import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login if no token
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center shadow">

        <h1 className="text-2xl font-bold">
          NagaEd Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto mt-10">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-indigo-600 mb-6">
            Welcome, {user.username} 👋
          </h2>

          <div className="space-y-4">

            <div className="border rounded-lg p-4">
              <strong>Username:</strong> {user.username}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Email:</strong> {user.email}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Address:</strong> {user.address}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;