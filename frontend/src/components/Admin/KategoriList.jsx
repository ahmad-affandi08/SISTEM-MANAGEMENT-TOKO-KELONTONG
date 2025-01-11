import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllKategori,
  deleteKategori,
  createKategori,
  updateKategori,
} from "../../api/kategoriApi";
import Loading from "../Loading";

const KategoriList = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    kode_kategori: "",
    nama_kategori: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        setLoading(true);
        const data = await getAllKategori();
        setKategoriList(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
        setLoading(false);
      }
    };

    fetchKategori();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateKategori(selectedId, formData);
        Swal.fire("Berhasil", "Kategori berhasil diperbarui.", "success");
      } else {
        await createKategori(formData);
        Swal.fire("Berhasil", "Kategori berhasil ditambahkan.", "success");
      }
      setFormData({ kode_kategori: "", nama_kategori: "" });
      setIsEditing(false);
      setShowModal(false);
      const data = await getAllKategori();
      setKategoriList(data);
    } catch (err) {
      Swal.fire("Gagal", `Gagal menyimpan kategori: ${err}`, "error");
    }
  };

  const handleEdit = (kategori) => {
    setFormData({
      kode_kategori: kategori.kode_kategori,
      nama_kategori: kategori.nama_kategori,
    });
    setSelectedId(kategori._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Kategori?",
      text: "Apakah Anda yakin ingin menghapus kategori ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKategori(id);
          setKategoriList((prev) =>
            prev.filter((kategori) => kategori._id !== id)
          );
          Swal.fire("Berhasil", "Kategori berhasil dihapus.", "success");
        } catch (err) {
          Swal.fire("Gagal", `Gagal menghapus kategori: ${err}`, "error");
        }
      }
    });
  };

  const handleAddKategori = () => {
    setFormData({ kode_kategori: "", nama_kategori: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">Terjadi kesalahan: {error}</p>
    );

  return (
    <div className="min-w-max p-6 bg-background border-2 border-border m-6 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-semibold mb-4 text-teks">Daftar Kategori</h1>
      <button
        onClick={handleAddKategori}
        className="mb-4 bg-utama hover:bg-aksen text-white py-2 px-4 rounded-md transition-all duration-300"
      >
        Tambah Kategori
      </button>
      {kategoriList.length === 0 ? (
        <p className="text-center">Tidak ada kategori yang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
          {kategoriList.map((kategori) => (
            <div
              key={kategori._id}
              className="bg-white shadow-md rounded-lg border-2 border-utama  p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Kode Kategori: {kategori.kode_kategori}
                </h3>
                <p className="text-gray-600">
                  Nama Kategori: {kategori.nama_kategori}
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(kategori)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(kategori._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-teks rounded shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4 text-aksen">
              {isEditing ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-border text-sm font-bold mb-2"
                  htmlFor="kode_kategori"
                >
                  Kode Kategori
                </label>
                <input
                  type="text"
                  id="kode_kategori"
                  name="kode_kategori"
                  value={formData.kode_kategori}
                  onChange={handleInputChange}
                  className="shadow appearance-none border bg-gray-700 rounded w-full py-2 px-3 text-border leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Masukkan kode kategori"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-border text-sm font-bold mb-2"
                  htmlFor="nama_kategori"
                >
                  Nama Kategori
                </label>
                <input
                  type="text"
                  id="nama_kategori"
                  name="nama_kategori"
                  value={formData.nama_kategori}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-border bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default KategoriList;
