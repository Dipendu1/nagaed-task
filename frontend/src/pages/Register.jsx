import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const [interests, setInterests] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSuggestUsername = async () => {
    if (!interests.trim()) return;

    try {
      setSuggestLoading(true);
      const res = await fetch("http://localhost:8000/api/suggest-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests.split(",").map((i) => i.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error("Failed to get suggestions");

      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/register", formData);

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Register to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Your interests, comma separated (e.g. gaming, hiking)"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleSuggestUsername}
              disabled={suggestLoading}
              className="text-sm text-indigo-600 font-semibold hover:underline"
            >
              {suggestLoading ? "Thinking..." : "✨ Suggest a username"}
            </button>

            {suggestions.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {suggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData({ ...formData, username: name })}
                    className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {message && (
          <p className="text-center mt-4 text-green-600">
            {message}
          </p>
        )}

        <p className="text-center mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-indigo-600 font-semibold ml-1"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;