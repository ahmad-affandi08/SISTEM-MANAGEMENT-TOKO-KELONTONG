import React, { useEffect, useState } from "react";
import { getAllBarang, deleteBarang, updateBarang } from "../../api/barangApi";
import {
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlineEdit,
  AiOutlinePlus,
} from "react-icons/ai";
import Swal from "sweetalert2";
import TambahBarang from "./AddBarang";
import Loading from "../Loading";

const BarangList = () => {
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "kode_barang",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [stockUpdateData, setStockUpdateData] = useState({ id: "", stock: 0 });
  const [showTambahBarangModal, setShowTambahBarangModal] = useState(false);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const barangData = await getAllBarang();
      setBarangList(barangData);
    } catch (err) {
      setError("Gagal mengambil data barang");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Barang ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBarang(id);
          setBarangList(barangList.filter((barang) => barang._id !== id));
          Swal.fire("Dihapus!", "Barang telah dihapus.", "success");
        } catch (err) {
          setError("Gagal menghapus barang");
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus barang.",
            "error"
          );
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      Swal.fire(
        "Pilih barang",
        "Pilih barang yang ingin dihapus terlebih dahulu.",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Barang yang dipilih akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const itemId of selectedItems) {
            await deleteBarang(itemId);
          }
          setBarangList(
            barangList.filter((barang) => !selectedItems.includes(barang._id))
          );
          setSelectedItems([]);
          Swal.fire(
            "Dihapus!",
            "Barang yang dipilih telah dihapus.",
            "success"
          );
        } catch (err) {
          setError("Gagal menghapus barang");
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus barang.",
            "error"
          );
        }
      }
    });
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const filteredBarang = barangList.filter(
    (barang) =>
      barang.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barang.kode_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barang.kategori_id.nama_kategori
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const sortedBarang = filteredBarang.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedBarang.length / itemsPerPage);
  const paginatedBarang = sortedBarang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStockUpdateChange = (e) => {
    setStockUpdateData({ ...stockUpdateData, stock: e.target.value });
  };

  const handleUpdateStock = async () => {
    if (stockUpdateData.stock < 0) {
      Swal.fire("Stok Invalid", "Stok tidak boleh kurang dari 0.", "error");
      return;
    }

    try {
      await updateBarang(stockUpdateData.id, { stok: stockUpdateData.stock });
      setBarangList(
        barangList.map((barang) =>
          barang._id === stockUpdateData.id
            ? { ...barang, stok: stockUpdateData.stock }
            : barang
        )
      );
      setStockUpdateData({ id: "", stock: 0 });
      Swal.fire("Berhasil!", "Stok telah diperbarui.", "success");
    } catch (err) {
      setError("Gagal memperbarui stok");
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui stok.", "error");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-w-max p-6 bg-background border-2 border-border m-6 rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-semibold mb-4 text-teks">Data Barang</h1>

      {/* Tombol Tambah Barang dan Hapus Terpilih */}
      <div className="my-4 flex space-x-4">
        <button
          onClick={() => setShowTambahBarangModal(true)}
          className="bg-utama text-white px-4 py-2 rounded-md hover:bg-aksen transition duration-200 flex items-center"
        >
          <AiOutlinePlus className="mr-2" />
          Tambah Barang
        </button>

        <button
          onClick={handleBulkDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-300 transition duration-200 flex items-center"
          disabled={selectedItems.length === 0}
        >
          <AiOutlineDelete className="mr-2" />
          Hapus Terpilih
        </button>
      </div>

      {/* Search */}
      <div className="my-4 flex space-x-4 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Cari barang..."
          className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-utama text-white px-4 py-2 rounded-md hover:bg-aksen transition duration-200">
          <AiOutlineSearch size={24} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-utama text-background">
              <th className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(barangList.map((barang) => barang._id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                  checked={selectedItems.length === barangList.length}
                />
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("kode_barang")}
              >
                Kode Barang
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("nama")}
              >
                Nama
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("stok")}
              >
                Stok
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("harga_beli")}
              >
                Harga Beli
              </th>
              <th
                className="border border-gray-300 px-4 py-2 cursor-pointer"
                onClick={() => handleSort("harga_jual")}
              >
                Harga Jual
              </th>
              <th className="border border-gray-300 px-4 py-2">Kategori</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBarang.map((barang) => (
              <tr key={barang._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(barang._id)}
                    onChange={(e) => handleCheckboxChange(e, barang._id)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {barang.kode_barang}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {barang.nama}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {barang.stok}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {barang.harga_beli}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {barang.harga_jual}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {barang.kategori_id ? barang.kategori_id.nama_kategori : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                  <button
                    onClick={() =>
                      setStockUpdateData({ id: barang._id, stock: barang.stok })
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(barang._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Previous
        </button>

        <span className="text-teks">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Modal Update Stok */}
      {stockUpdateData.id && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-teks p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl text-aksen font-semibold mb-4">
              Update Stok
            </h3>
            <input
              type="number"
              value={stockUpdateData.stock}
              onChange={handleStockUpdateChange}
              className="border px-4 py-2 w-full mb-4 rounded-md bg-gray-700 text-border"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setStockUpdateData({ id: "", stock: 0 })}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStock}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal untuk Tambah Barang */}
      {showTambahBarangModal && (
        <TambahBarang onClose={() => setShowTambahBarangModal(false)} />
      )}
    </div>
  );
};

export default BarangList;
