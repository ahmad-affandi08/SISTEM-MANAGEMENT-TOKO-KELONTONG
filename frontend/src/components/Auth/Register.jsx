import React, { useState } from "react";
import { registerUser } from "../../api/loginApi";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo/gastyas-9.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kasir");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi input kosong
    if (!username || !password) {
      setError("Semua bidang harus diisi.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await registerUser(username, password, role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      setError("Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
        {/* Left Side */}
        <div className="relative bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-10">
          <div className="absolute inset-0 bg-opacity-60 bg-black rounded-xl"></div>
          <div className="relative text-center text-white z-10">
            <img
              src={Logo}
              alt="Logo"
              className="w-32 h-32 mx-auto mb-6 animate-pulse"
            />
            <h1 className="text-3xl font-bold tracking-wide leading-tight">
              Buat Akun Gastyas
            </h1>
            <p className="text-sm opacity-80 mt-2">
              Daftar dan kelola toko kelontong Anda dengan mudah!
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white p-10 flex flex-col justify-center relative">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Register
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4 text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
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
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
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
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-gray-600 font-medium">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              >
                <option value="kasir">Kasir</option>
                <option value="admin">Admin</option>
              </select>
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
