import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineUp,
  AiOutlineDown,
  AiOutlineKey,
} from "react-icons/ai";
import Swal from "sweetalert2";
import DefaultView from "../components/Kasir/DefaultView";
import ChangePassword from "../components/Kasir/ChangePassword";
import { getKaryawanByUserLogin } from "../api/karyawanApi";

const KasirPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeComponent, setActiveComponent] = useState("DefaultView");
  const navigate = useNavigate();

  useEffect(() => {
    // Memanggil API untuk mendapatkan data karyawan berdasarkan login
    const fetchKaryawan = async () => {
      try {
        const data = await getKaryawanByUserLogin();
        setNama(data.nama || "Guest");
      } catch (error) {
        console.error("Error fetching karyawan data:", error);
      }
    };

    fetchKaryawan();
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

  const handleOpenKasirSystem = () => {
    // Membuka tab baru untuk Sistem Kasir
    window.open("/kasir/system", "_blank");
  };

  const handleGoToHomePage = () => {
    // Tampilkan konten utama di halaman yang sama
    setActiveComponent("DefaultView");
  };

  const handleChangePassword = () => {
    // Tampilkan komponen Ganti Password
    setActiveComponent("ChangePassword");
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

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "DefaultView":
        return <DefaultView />;
      case "ChangePassword":
        return <ChangePassword />;
      default:
        return <DefaultView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-utama text-white transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          <div className="flex justify-center items-center border-y mb-6 py-4">
            <h2 className="text-xl font-semibold text-border  text-center whitespace-nowrap">
              --Kasir Dashboard--{" "}
            </h2>
          </div>

          {/* Sidebar Menu */}
          <p
            className={` left-14 text-xl border-b-2 font-medium transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-100"
            }`}
          >
            MENU{" "}
          </p>
          <ul className="space-y-4">
            <li>
              <button
                onClick={handleGoToHomePage}
                className="flex items-center space-x-3 w-full text-left py-2 px-4 rounded-lg transition-all hover:bg-aksen hover:text-background"
              >
                <AiOutlineHome size={20} />
                <span>HALAMAN UTAMA</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleOpenKasirSystem}
                className="flex items-center space-x-3 w-full text-left py-2 px-4 rounded-lg transition-all hover:bg-aksen hover:text-background"
              >
                <AiOutlineShoppingCart size={20} />
                <span>SISTEM KASIR</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleChangePassword}
                className="flex items-center space-x-3 w-full text-left py-2 px-4 rounded-lg transition-all hover:bg-aksen hover:text-background"
              >
                <AiOutlineKey size={20} />
                <span>GANTI PASSWORD</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-utama p-4 shadow-md relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-background ml-4 flex items-center justify-center w-10 h-10 rounded-lg border border-background bg-aksen shadow-md hover:bg-ikon hover:text-utama transition-transform transform hover:scale-110 duration-300 ease-in-out z-50"
          >
            {sidebarOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>

          <div className="flex items-center space-x-6 mr-6 relative">
            {/* Profile Section with Icon */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleProfileClick}
            >
              <div className="w-12 h-12 rounded-full bg-utama border-border border-4 flex items-center justify-center text-background font-bold text-2xl shadow-md">
                {nama.charAt(0).toUpperCase()}
              </div>
              <div className="text-background flex items-center">
                <p className="font-semibold text-lg">{nama} | </p>
                <p className="text-sm text-gray-300">| Kasir</p>
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

        {/* Render Active Component */}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default KasirPage;
