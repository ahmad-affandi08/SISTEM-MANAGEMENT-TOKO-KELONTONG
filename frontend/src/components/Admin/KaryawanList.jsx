import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getAllKaryawan,
  createKaryawan,
  updateKaryawan,
  deleteKaryawan,
} from "../../api/karyawanApi";
import Loading from "../Loading";

const KaryawanCrud = () => {
  const [karyawanList, setKaryawanList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    tanggalLahir: "",
    jenisKelamin: "",
    tanggalMulaiKerja: "",
    gaji: "",
    shift: "",
    username: "",
    password: "",
    catatan: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch data karyawan from API
  useEffect(() => {
    fetchKaryawan();
  }, []);

  const fetchKaryawan = async () => {
    try {
      const data = await getAllKaryawan();
      setKaryawanList(data);
    } catch (error) {
      console.error("Failed to fetch karyawan data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    setFormData({
      nama: "",
      alamat: "",
      telepon: "",
      tanggalLahir: "",
      jenisKelamin: "",
      tanggalMulaiKerja: "",
      gaji: "",
      shift: "",
      username: "",
      password: "",
      catatan: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (karyawan) => {
    setFormData(karyawan);
    setIsEditing(true);
    setSelectedId(karyawan._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateKaryawan(selectedId, formData);
        Swal.fire("Berhasil", "Data karyawan berhasil diperbarui.", "success");
      } else {
        await createKaryawan(formData);
        Swal.fire("Berhasil", "Data karyawan berhasil ditambahkan.", "success");
      }
      setShowModal(false);
      fetchKaryawan();
    } catch (error) {
      console.error("Failed to save karyawan data:", error);
      Swal.fire("Error", "Gagal menyimpan data karyawan.", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data karyawan ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKaryawan(id);
          Swal.fire("Berhasil", "Data karyawan berhasil dihapus.", "success");
          fetchKaryawan();
        } catch (error) {
          console.error("Failed to delete karyawan data:", error);
          Swal.fire("Error", "Gagal menghapus data karyawan.", "error");
        }
      }
    });
  };

  return (
    <div className="min-w-max p-6 bg-background border-2 border-border m-6 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-semibold mb-4 text-teks">Data Karyawan</h1>
      <button
        onClick={handleAdd}
        className="mb-6 bg-utama hover:bg-aksen text-white  py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        Tambah Karyawan
      </button>
      {karyawanList.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {karyawanList.map((karyawan) => (
            <div
              key={karyawan._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {karyawan.nama}
                </h3>
                <p className="text-sm text-gray-500">
                  {karyawan.jenisKelamin} |{" "}
                  {new Date(karyawan.tanggalLahir).toLocaleDateString("id-ID")}
                </p>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Alamat:</span>{" "}
                    {karyawan.alamat}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Telepon:</span>{" "}
                    {karyawan.telepon}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Mulai Kerja:</span>{" "}
                    {new Date(karyawan.tanggalMulaiKerja).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Gaji:</span> {karyawan.gaji}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Shift:</span>{" "}
                    {karyawan.shift}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Status:</span>{" "}
                    {karyawan.statusPekerjaan}
                  </p>
                  {karyawan.catatan && (
                    <p className="mt-2 text-sm text-gray-500 italic">
                      <span className="font-semibold">Catatan:</span>{" "}
                      {karyawan.catatan}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between p-4 bg-utama border-t">
                <button
                  onClick={() => handleEdit(karyawan)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(karyawan._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg transition duration-200"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-teks rounded-lg shadow-lg p-6 w-[600px] max-w-full flex flex-col">
            <h2 className="text-2xl font-semibold text-aksen mb-4 text-start">
              {isEditing ? "Edit Karyawan" : "Masukkan Data Karyawan"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Mapping form fields */}
              {[
                { name: "nama", label: "Nama", type: "text" },
                { name: "alamat", label: "Alamat", type: "text" },
                { name: "telepon", label: "Telepon", type: "tel" },
                { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
                {
                  name: "jenisKelamin",
                  label: "Jenis Kelamin",
                  type: "select",
                  options: ["Laki-laki", "Perempuan"],
                },
                {
                  name: "tanggalMulaiKerja",
                  label: "Tanggal Masuk Kerja",
                  type: "date",
                },
                { name: "gaji", label: "Gaji", type: "number" },
                {
                  name: "shift",
                  label: "Shift",
                  type: "select",
                  options: ["Pagi", "Siang", "Malam"],
                },
                { name: "username", label: "Username", type: "text" },
                { name: "password", label: "Password", type: "password" },
                { name: "catatan", label: "Catatan", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    className="block text-border text-sm font-semibold mb-2"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="shadow-lg border border-gray-300 rounded w-full py-2 px-4"
                    >
                      <option value="">Pilih {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="shadow-lg appearance-none border border-gray-300 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-utama focus:ring-2 focus:ring-aksen"
                      required
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-between gap-4 mt-4 col-span-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-utama hover:bg-aksen text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaryawanCrud;
