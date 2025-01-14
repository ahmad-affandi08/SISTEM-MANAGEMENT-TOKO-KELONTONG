import React, { useState, useEffect } from "react";
import { getKaryawanByUserLogin, updateKaryawan } from "../../api/karyawanApi";

const KaryawanProfile = () => {
  const [karyawan, setKaryawan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchKaryawanData = async () => {
      try {
        const data = await getKaryawanByUserLogin();
        setKaryawan(data);
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil data");
        setLoading(false);
      }
    };

    fetchKaryawanData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateKaryawan(karyawan._id, formData);
      setMessage("Data berhasil diperbarui!");
      setKaryawan(formData);
      setIsEditing(false);
    } catch (err) {
      setMessage("Gagal memperbarui data. Coba lagi.");
    }
  };

  const handleModalClose = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Judul */}
      <div className="text-center">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600">
          Profil Kasir
        </h2>
      </div>

      {/* Notifikasi */}
      {message && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow-md">
          <p>{message}</p>
        </div>
      )}

      {/* Konten */}
      {karyawan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informasi Umum */}
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-t-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-600">Informasi Umum</h3>
            <p>
              <span className="font-semibold">Nama:</span> {karyawan.nama}
            </p>
            <p>
              <span className="font-semibold">Telepon:</span> {karyawan.telepon}
            </p>
            <p>
              <span className="font-semibold">Alamat:</span> {karyawan.alamat}
            </p>
          </div>

          {/* Informasi Pekerjaan */}
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-t-4 border-teal-500">
            <h3 className="text-lg font-bold text-teal-600">
              Informasi Pekerjaan
            </h3>
            <p>
              <span className="font-semibold">Gaji:</span> {karyawan.gaji}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {karyawan.statusPekerjaan}
            </p>
            <p>
              <span className="font-semibold">Tanggal Mulai Bekerja:</span>{" "}
              {new Date(karyawan.tanggalMulaiKerja).toLocaleDateString()}
            </p>
          </div>

          {/* Informasi Pribadi */}
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-t-4 border-purple-500">
            <h3 className="text-lg font-bold text-purple-600">
              Informasi Pribadi
            </h3>
            <p>
              <span className="font-semibold">Jenis Kelamin:</span>{" "}
              {karyawan.jenisKelamin}
            </p>
            <p>
              <span className="font-semibold">Tanggal Lahir:</span>{" "}
              {new Date(karyawan.tanggalLahir).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Catatan:</span>{" "}
              {karyawan.catatan || "Tidak ada catatan"}
            </p>
          </div>
        </div>
      )}

      {/* Tombol Edit */}
      <div className="text-center">
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200"
        >
          Edit Profil
        </button>
      </div>

      {/* Modal Form Edit */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-center mb-4">Edit Profil</h3>
            <form className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nama:</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Telepon:</label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Alamat:</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-200"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition duration-200"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaryawanProfile;
