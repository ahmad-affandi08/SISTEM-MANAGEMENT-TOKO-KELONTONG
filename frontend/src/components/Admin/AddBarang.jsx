import React, { useState, useEffect } from "react";
import { createBarang } from "../../api/barangApi";
import { getAllKategori } from "../../api/kategoriApi";
import Swal from "sweetalert2";

const TambahBarang = ({ onClose }) => {
  const [nama, setNama] = useState("");
  const [kodeKategori, setKodeKategori] = useState("");
  const [stok, setStok] = useState(0);
  const [satuanPembelian, setSatuanPembelian] = useState("");
  const [hargaBeli, setHargaBeli] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const data = await getAllKategori();
        setKategoriList(data);
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
      }
    };
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const barangData = {
      nama,
      kode_kategori: kodeKategori,
      stok,
      satuan_pembelian: satuanPembelian,
      harga_beli: hargaBeli,
      harga_jual: hargaJual,
    };

    try {
      const response = await createBarang(barangData);

      // Menampilkan SweetAlert saat barang berhasil ditambahkan
      Swal.fire({
        icon: "success",
        title: "Barang berhasil ditambahkan",
        text: `Barang: ${response.data.nama} berhasil ditambahkan`,
      });

      // Reset form
      setNama("");
      setKodeKategori("");
      setStok(0);
      setSatuanPembelian("");
      setHargaBeli(0);
      setHargaJual(0);

      // Tutup modal setelah berhasil
      onClose();
    } catch (error) {
      // Menampilkan SweetAlert saat ada error
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan barang",
        text: `Error: ${error.message}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-teks p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl text-aksen font-bold mb-4">Tambah Barang</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-border">
              Nama Barang
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-1 block w-full p-2 border bg-gray-700 text-border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-border">
              Kategori
            </label>
            <select
              value={kodeKategori}
              onChange={(e) => setKodeKategori(e.target.value)}
              className="mt-1 block w-full p-2 border bg-gray-700 text-border rounded"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((kategori) => (
                <option
                  key={kategori.kode_kategori}
                  value={kategori.kode_kategori}
                >
                  {kategori.nama_kategori}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-border">
              Stok
            </label>
            <input
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              className="mt-1 block w-full p-2 border text-border bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-border">
              Satuan Pembelian
            </label>
            <select
              value={satuanPembelian}
              onChange={(e) => setSatuanPembelian(e.target.value)}
              className="mt-1 block w-full p-2 border text-border bg-gray-700 rounded"
              required
            >
              <option value="">Pilih Satuan</option>
              <option value="Pcs">Pcs</option>
              <option value="Dus">Dus</option>
              <option value="Pack">Pack</option>
              <option value="Kg">Kg</option>
              <option value="Liter">Liter</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-border">
              Harga Beli
            </label>
            <input
              type="number"
              value={hargaBeli}
              onChange={(e) => setHargaBeli(e.target.value)}
              className="mt-1 block w-full p-2 border text-border bg-gray-700 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-border">
              Harga Jual
            </label>
            <input
              type="number"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
              className="mt-1 block w-full p-2 border text-border bg-gray-700 rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose} // Tutup modal jika batal
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tambah Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahBarang;
