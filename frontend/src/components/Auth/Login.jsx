import React, { useState } from "react";
import { loginUser } from "../../api/loginApi";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo/gastyas-9.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi input kosong
    if (!username || !password) {
      setError("Username dan password harus diisi.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "kasir") {
        navigate("/kasir");
      } else {
        setError("Role tidak dikenali.");
      }
    } catch (error) {
      // Tangani error dari server
      if (error.response) {
        setError(
          error.response.data.message ||
            "Login gagal. Periksa kembali username dan password."
        );
      } else {
        setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
        {/* Left Side */}
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-10">
          <div className="absolute inset-0 bg-opacity-60 bg-black rounded-xl"></div>
          <div className="relative text-center text-white z-10">
            <img
              src={Logo}
              alt="Logo"
              className="w-32 h-32 mx-auto mb-6 animate-pulse"
            />
            <h1 className="text-3xl font-bold tracking-wide leading-tight">
              Selamat Datang di Gastyas
            </h1>
            <p className="text-sm opacity-80 mt-2">
              Sistem Manajemen Toko Kelontong Modern
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white p-10 flex flex-col justify-center relative">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4 text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-600 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-600 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Masukkan password"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 text-teks text-lg font-semibold rounded-lg transition duration-300 transform hover:scale-105 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-aksen hover:bg-opacity-80"
              }`}
              disabled={loading}
            >
              {" "}
              {loading ? "Logging in..." : "Login"}{" "}
            </button>{" "}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
