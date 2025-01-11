import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineAppstore,
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineHistory,
  AiOutlineUser,
  AiOutlineUp,
  AiOutlineDown,
} from "react-icons/ai";
import BarangList from "../components/Admin/BarangList";
import KategoriList from "../components/Admin/KategoriList";
import LaporanList from "../components/Admin/LaporanList";
import DefaultView from "../components/Admin/DefaultView";
import LogAktivitas from "../components/Admin/LogActivity";
import KelolaPengguna from "../components/Admin/UserManagement";
import KaryawanList from "../components/Admin/KaryawanList";
import Swal from "sweetalert2";

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("defaultView");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mengambil username dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username || "Admin");
    }
  }, []);

  const handleLogout = () => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Apakah Anda yakin ingin keluar?",
      text: "Anda akan keluar dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    });
  };

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
  };
  // Handle toggling the dropdown when the profile is clicked
  const handleProfileClick = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Add the event listener for mousedown event
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-utama text-white transform transition-all duration-300 ease-out ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full p-4 space-y-4 relative">
          {/* Header Sidebar */}
          <div className="flex justify-between items-center border-y mb-6 py-4 ">
            <div
              className={`h-8 overflow-hidden transition-all duration-300 ${
                sidebarOpen ? "w-full opacity-100" : "w-0 opacity-0"
              }`}
            >
              <h2 className="text-xl font-semibold text-border  text-center whitespace-nowrap">
                --Admin Dashboard--
              </h2>
            </div>
          </div>

          {/* Sidebar Menu */}
          <p
            className={` left-14 text-xl border-b-2 font-medium transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            MENU{" "}
          </p>
          <ul className="space-y-4 flex-grow">
            <li>
              <button
                onClick={() => handleSetActiveComponent("defaultView")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "defaultView" ? "bg-aksen text-teks" : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineHome size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  HALAMAN UTAMA
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSetActiveComponent("barangList")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "barangList" ? "bg-aksen text-teks" : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineShoppingCart size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  DAFTAR BARANG
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSetActiveComponent("kategoriList")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "kategoriList" ? "bg-aksen text-teks" : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineAppstore size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  DAFTAR KATEGORI
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSetActiveComponent("karyawanList")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "karyawanList" ? "bg-aksen text-teks" : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineAppstore size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  DAFTAR KARYAWAN
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSetActiveComponent("laporanList")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "laporanList" ? "bg-aksen text-teks" : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineFileText size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  LAPORAN LIST
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSetActiveComponent("KelolaPengguna")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "KelolaPengguna"
                    ? "bg-aksen text-teks"
                    : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineUser size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  KELOLA PENGGUNA
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSetActiveComponent("LogAktivitas")}
                className={`relative flex items-center w-full text-left py-2 px-3 rounded-lg transition-all ${
                  activeComponent === "LogAktivitas" ? "bg-aksen text-teks" : ""
                } hover:bg-border hover:text-teks`}
              >
                <AiOutlineHistory size={24} />
                <span
                  className={`absolute left-14 text-sm font-medium transition-opacity whitespace-nowrap duration-300 ${
                    sidebarOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  LOG AKTIVITAS
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all bg-background z-50 duration-300 ease-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-utama p-4 shadow-md relative">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-background ml-4 flex items-center justify-center w-10 h-10 rounded-lg border border-background bg-aksen shadow-md hover:bg-ikon hover:text-utama transition-transform transform hover:scale-110 duration-300 ease-in-out z-50"
          >
            {sidebarOpen ? (
              <AiOutlineClose size={28} />
            ) : (
              <AiOutlineMenu size={28} />
            )}
          </button>

          {/* Profile and Logout */}
          <div className="flex items-center space-x-6 mr-6 relative">
            {/* Profile Section with Icon */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleProfileClick}
            >
              <div className="w-12 h-12 rounded-full bg-utama border-border border-4 flex items-center justify-center text-background font-bold text-2xl shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="text-background flex items-center">
                <p className="font-semibold text-lg">{username} | </p>
                <p className="text-sm text-gray-300">| Admin</p>
              </div>
              {/* Arrow Icon */}
              {dropdownOpen ? (
                <AiOutlineUp
                  size={18}
                  className="text-background cursor-pointer transition-transform duration-300"
                />
              ) : (
                <AiOutlineDown
                  size={18}
                  className="text-background cursor-pointer transition-transform duration-300"
                />
              )}
            </div>

            {/* Profile Dropdown */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-14 right-0 bg-ikon p-4 rounded-lg shadow-lg z-50 w-48 transition-all duration-300 ease-out"
              >
                <button
                  onClick={handleLogout}
                  className="bg-aksen text-background font-semibold w-full px-4 py-2 rounded-lg hover:bg-teks hover:text-utama transition duration-200 ease-in-out flex items-center"
                >
                  <AiOutlineLogout size={20} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Component Rendering */}
        <div className="mx-auto ">
          {activeComponent === "defaultView" && <DefaultView laporan={[]} />}
          {activeComponent === "barangList" && <BarangList />}
          {activeComponent === "kategoriList" && <KategoriList />}
          {activeComponent === "karyawanList" && <KaryawanList />}
          {activeComponent === "laporanList" && <LaporanList />}
          {activeComponent === "KelolaPengguna" && <KelolaPengguna />}
          {activeComponent === "LogAktivitas" && <LogAktivitas />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
