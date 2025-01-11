import React, { useState, useEffect, useRef } from "react";
import PopupStruk from "./PopupStruk";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaMoneyBillAlt,
  FaPlus,
  FaMinus,
  FaSearch,
} from "react-icons/fa";
import { getAllBarang } from "../../api/barangApi";
import { createTransaksi } from "../../api/transaksiApi";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

const KasirSystem = () => {
  const [barangList, setBarangList] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [uangDiterima, setUangDiterima] = useState("");
  const [kembalian, setKembalian] = useState(0);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [kasirName, setKasirName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [transaksiData, setTransaksiData] = useState(null);

  const strukRef = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setKasirName(user?.username || "Kasir");

    const fetchBarang = async () => {
      try {
        setLoading(true);
        const data = await getAllBarang();
        setBarangList(data);
        setFilteredBarang(data);
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
        setMessage("Gagal memuat data barang.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = barangList.filter((barang) =>
      barang.nama.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBarang(filtered);
  };

  const addToCart = (barang) => {
    const existingItem = cart.find((item) => item.barang_id === barang._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.barang_id === barang._id
            ? {
                ...item,
                jumlah: item.jumlah + 1,
                subtotal: (item.jumlah + 1) * item.harga_satuan,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          barang_id: barang._id,
          nama_barang: barang.nama,
          jumlah: 1,
          harga_satuan: barang.harga_jual,
          subtotal: barang.harga_jual,
        },
      ]);
    }
  };

  const removeFromCart = (barang_id) => {
    setCart(cart.filter((item) => item.barang_id !== barang_id));
  };

  const updateJumlah = (barang_id, delta) => {
    setCart(
      cart.map((item) =>
        item.barang_id === barang_id
          ? {
              ...item,
              jumlah: Math.max(1, item.jumlah + delta),
              subtotal: Math.max(1, item.jumlah + delta) * item.harga_satuan,
            }
          : item
      )
    );
  };

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    setTotal(newTotal);
  }, [cart]);

  useEffect(() => {
    if (uangDiterima) {
      const numUang = parseInt(uangDiterima);
      if (!isNaN(numUang)) {
        setKembalian(Math.max(0, numUang - total));
      }
    }
  }, [uangDiterima, total]);

  // Define resetForm
  const resetForm = () => {
    setCart([]);
    setUangDiterima("");
    setKembalian(0);
    setSearch("");
    setFilteredBarang(barangList);
  };

  const handlePayment = async () => {
    // Show confirmation dialog before proceeding with the payment
    const result = await Swal.fire({
      title: "Konfirmasi Pembayaran",
      text: "Apakah Anda yakin ingin melanjutkan transaksi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const numUang = parseInt(uangDiterima);
      if (isNaN(numUang) || numUang < total) {
        setMessage("Uang diterima kurang dari total transaksi!");
        return;
      }

      const transaksiData = {
        kasir: kasirName,
        barang: cart.map(
          ({ barang_id, nama_barang, jumlah, harga_satuan, subtotal }) => ({
            barang_id,
            nama_barang,
            jumlah,
            harga_satuan,
            subtotal,
          })
        ),
        total,
        uang_diterima: numUang,
        kembalian,
      };

      try {
        await createTransaksi(transaksiData);
        setMessage("Transaksi berhasil disimpan! Mulailah transaksi Baru!");
        setShowPopup(true);
        setTransaksiData(transaksiData);
        resetForm();

        // SweetAlert success
        Swal.fire({
          title: "Transaksi Berhasil!",
          text: "Transaksi berhasil disimpan! Mulailah transaksi baru.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Gagal menyimpan transaksi:", error);
        setMessage("Gagal menyimpan transaksi.");

        // SweetAlert error
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menyimpan transaksi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      // If the user cancels the payment
      Swal.fire({
        title: "Pembayaran Dibatalkan",
        text: "Pembayaran dibatalkan.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const printPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150],
    });

    // Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TOKO GASTYAS", 40, 10, null, null, "center");
    doc.setFontSize(8);
    doc.text("Melangbong, Trangsan, Kec.Gatak", 40, 15, null, null, "center");
    doc.text("Telp: 0812-3456-7890", 40, 20, null, null, "center");

    // Garis pemisah header
    doc.setLineWidth(0.5);
    doc.line(5, 25, 75, 25);

    // Kasir dan Tanggal
    doc.setFontSize(8);
    doc.text(`Kasir: ${transaksiData?.kasir}`, 5, 30);
    doc.text(`Tanggal: ${new Date().toLocaleString()}`, 5, 35);

    // Garis pemisah
    doc.line(5, 40, 75, 40);

    // Daftar Barang
    doc.setFontSize(8);
    doc.text("Daftar Barang:", 5, 45);
    let yPosition = 50;

    transaksiData?.barang.forEach((item) => {
      // Nama barang di kiri
      doc.text(item.nama_barang, 5, yPosition);

      // Jumlah dan subtotal
      const qtyText = `${item.jumlah}x`;
      const totalText = `Rp ${item.subtotal.toLocaleString()}`;
      doc.text(qtyText, 40, yPosition, null, null, "center");
      doc.text(totalText, 75, yPosition, null, null, "right");

      yPosition += 5;
    });

    // Garis pemisah sebelum total
    doc.line(5, yPosition + 2, 75, yPosition + 2);

    // Informasi Total, Uang Diterima, dan Kembalian
    yPosition += 7;
    doc.text("Total:", 5, yPosition);
    doc.text(
      `Rp ${transaksiData?.total.toLocaleString()}`,
      75,
      yPosition,
      null,
      null,
      "right"
    );

    yPosition += 5;
    doc.text("Uang Diterima:", 5, yPosition);
    doc.text(
      `Rp ${transaksiData?.uang_diterima.toLocaleString()}`,
      75,
      yPosition,
      null,
      null,
      "right"
    );

    yPosition += 5;
    doc.text("Kembalian:", 5, yPosition);
    doc.text(
      `Rp ${transaksiData?.kembalian.toLocaleString()}`,
      75,
      yPosition,
      null,
      null,
      "right"
    );

    // Garis pemisah akhir
    doc.line(5, yPosition + 5, 75, yPosition + 5);

    // Footer dengan teks menarik
    yPosition += 10;
    doc.setFontSize(7);
    doc.text(
      "PROMO KHUSUS: Beli 2 Gratis 1 untuk semua item minuman!",
      40,
      yPosition,
      null,
      null,
      "center"
    );
    yPosition += 5;
    doc.text(
      "Berlaku hingga 31 Desember 2024. Jangan lewatkan kesempatan ini!",
      40,
      yPosition,
      null,
      null,
      "center"
    );
    yPosition += 10;

    // Ucapan Terima Kasih
    doc.text(
      "Terima kasih atas kunjungan Anda!",
      40,
      yPosition,
      null,
      null,
      "center"
    );
    yPosition += 5;
    doc.text(
      "Kami menanti kunjungan Anda berikutnya.",
      40,
      yPosition,
      null,
      null,
      "center"
    );
    yPosition += 10;

    // Pesan Penutup
    doc.text(
      "Simpan struk ini sebagai bukti pembelian.",
      40,
      yPosition,
      null,
      null,
      "center"
    );
    yPosition += 5;
    doc.text(
      "Toko Gastyas - Belanja Nyaman dan Hemat!",
      40,
      yPosition,
      null,
      null,
      "center"
    );

    // Membuka PDF di tab baru
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");

    // SweetAlert after PDF print
    Swal.fire({
      title: "Struk Tercetak!",
      text: "Struk transaksi telah berhasil dicetak!",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col">
      {/* Header */}
      <main className="flex-1 overflow-y-auto p-8 space-y-12">
        {/* Container */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Daftar Barang */}
          <div className="xl:col-span-7 bg-white shadow-xl rounded-3xl p-8 space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
              <FaShoppingCart size={36} className="text-blue-500" /> Daftar
              Barang
            </h2>
            {/* Pencarian */}
            <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl shadow-md">
              <FaSearch size={24} className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Cari Barang..."
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Daftar Barang */}
            {loading ? (
              <div className="text-center text-gray-500 py-6 text-lg">
                Loading...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBarang.map((barang) => (
                  <div
                    key={barang._id}
                    className="p-6 bg-gradient-to-b from-white to-gray-50 text-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer group"
                    onClick={() => addToCart(barang)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg">{barang.nama}</p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          barang.stok > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {barang.stok > 0 ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                    <p className="text-sm">
                      Harga: Rp {barang.harga_jual.toLocaleString()}
                    </p>
                    <p className="text-sm">Kode: {barang.kode_barang}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Keranjang dan Pembayaran */}
          <div className="xl:col-span-5 bg-white shadow-xl rounded-3xl p-8 space-y-8">
            {/* Keranjang Belanja */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
                Keranjang Belanja
              </h2>
              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
                <div className="max-h-80 overflow-y-auto">
                  <table className="table-auto w-full text-gray-700">
                    <thead className="bg-blue-500 text-white">
                      <tr>
                        <th className="px-4 py-3">Nama Barang</th>
                        <th className="px-4 py-3">Jumlah</th>
                        <th className="px-4 py-3">Harga</th>
                        <th className="px-4 py-3">Subtotal</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.barang_id} className="text-center">
                          <td className="border px-4 py-3">
                            {item.nama_barang}
                          </td>
                          <td className="border px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => updateJumlah(item.barang_id, -1)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                              >
                                <FaMinus />
                              </button>
                              {item.jumlah}
                              <button
                                onClick={() => updateJumlah(item.barang_id, 1)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </td>
                          <td className="border px-4 py-3">
                            Rp {item.harga_satuan.toLocaleString()}
                          </td>
                          <td className="border px-4 py-3">
                            Rp {item.subtotal.toLocaleString()}
                          </td>
                          <td className="border px-4 py-3">
                            <button
                              onClick={() => removeFromCart(item.barang_id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTrashAlt /> Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                      {cart.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="border px-4 py-3 text-center text-gray-500"
                          >
                            Keranjang kosong
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Pembayaran */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                Pembayaran
              </h2>
              <div className="space-y-4">
                <p className="text-xl font-semibold text-right">
                  Total: Rp {total.toLocaleString()}
                </p>
                <input
                  type="number"
                  placeholder="Masukkan uang diterima"
                  value={uangDiterima}
                  onChange={(e) => setUangDiterima(e.target.value)}
                  className="border p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xl font-semibold text-right">
                  Kembalian: Rp {kembalian.toLocaleString()}
                </p>
                <button
                  onClick={handlePayment}
                  className="bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:bg-blue-600 transition-all"
                >
                  <FaMoneyBillAlt className="inline mr-2" />
                  Proses Pembayaran
                </button>
                {message && (
                  <p className="text-green-600 font-bold text-center">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Popup Struk */}
        <PopupStruk
          show={showPopup}
          cart={transaksiData?.barang || []}
          kasirName={transaksiData?.kasir || kasirName}
          total={transaksiData?.total || total}
          uangDiterima={transaksiData?.uang_diterima || uangDiterima}
          kembalian={transaksiData?.kembalian || kembalian}
          onClose={() => {
            setShowPopup(false);
            setTransaksiData(null);
          }}
          onPrint={printPDF}
          ref={strukRef}
        />
      </main>
    </div>
  );
};

export default KasirSystem;
