import React, { useEffect, useState } from "react";
import { fetchLaporan } from "../../api/laporanApi";
import { saveAs } from "file-saver";
import Loading from "../Loading";

const LaporanTabel = () => {
  const [laporan, setLaporan] = useState([]);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetail, setOpenDetail] = useState(null);
  const [rowsPerPage] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([
    "tanggal",
    "kasir",
    "total_transaksi",
    "total_pendapatan",
    "detail_barang",
  ]);

  useEffect(() => {
    const getLaporan = async () => {
      try {
        const data = await fetchLaporan();
        setLaporan(data);
        setFilteredLaporan(data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat laporan, coba lagi nanti.");
        setLoading(false);
      }
    };
    getLaporan();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = laporan.filter(
      (item) =>
        item.kasir.toLowerCase().includes(query.toLowerCase()) ||
        item.barang_terjual.some((barang) =>
          barang.nama_barang.toLowerCase().includes(query.toLowerCase())
        )
    );
    setFilteredLaporan(filtered);
    setCurrentPage(1);
  };

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih rentang tanggal mulai dan akhir!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set waktu ke awal dan akhir hari untuk perbandingan
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filtered = laporan.filter((item) => {
      // Mengonversi tanggal dari backend ke objek Date
      const itemDate = new Date(item.tanggal.split("/").reverse().join("-"));

      // Set waktu itemDate ke awal hari
      itemDate.setHours(0, 0, 0, 0);

      // Cek apakah tanggal berada dalam rentang yang ditentukan
      return itemDate >= start && itemDate <= end;
    });

    if (filtered.length === 0) {
      alert("Tidak ada laporan yang ditemukan dalam rentang tanggal tersebut.");
    }

    setFilteredLaporan(filtered);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    // Header CSV
    const headers = [
      "Tanggal",
      "Kasir",
      "Total Transaksi",
      "Total Pendapatan",
      "Nama Barang",
      "Jumlah",
      "Harga Satuan",
      "Subtotal",
    ];

    // Data CSV
    const rows = filteredLaporan.flatMap((item) =>
      item.barang_terjual.map((barang) => [
        item.tanggal,
        item.kasir,
        item.total_transaksi,
        item.total_pendapatan,
        barang.nama_barang,
        barang.jumlah,
        barang.harga_satuan,
        barang.jumlah * barang.harga_satuan,
      ])
    );

    // Gabungkan header dan data
    const csvContent =
      "\uFEFF" + [headers, ...rows].map((row) => row.join(";")).join("\n");

    // Buat file Blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "laporan_penjualan.csv");
  };

  const handleResetFilters = () => {
    setFilteredLaporan(laporan);
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const totalPendapatan = filteredLaporan.reduce(
    (acc, item) => acc + item.total_pendapatan,
    0
  );

  const totalPages = Math.ceil(filteredLaporan.length / rowsPerPage);

  const currentRows = filteredLaporan.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  const getBarangTerlaris = () => {
    const barangMap = new Map();

    filteredLaporan.forEach((item) => {
      item.barang_terjual.forEach((barang) => {
        if (!barangMap.has(barang.nama_barang)) {
          barangMap.set(barang.nama_barang, 0);
        }
        barangMap.set(
          barang.nama_barang,
          barangMap.get(barang.nama_barang) + barang.jumlah
        );
      });
    });

    const allBarang = Array.from(barangMap.entries());
    const sortedBarang = allBarang.sort((a, b) => b[1] - a[1]);

    const terlaris = sortedBarang[0] || ["Tidak ada", 0];
    const kurangLaku = sortedBarang[sortedBarang.length - 1] || [
      "Tidak ada",
      0,
    ]; // Barang kurang laku
    const tidakLaku = filteredLaporan
      .flatMap((item) => item.barang_terjual)
      .filter((barang) => barang.jumlah === 0)
      .map((barang) => barang.nama_barang);

    return {
      terlaris,
      kurangLaku,
      tidakLaku:
        tidakLaku.length > 0 ? tidakLaku.join(", ") : "Semua barang terjual",
    };
  };

  return (
    <div className="p-6 border-2 border-border rounded-3xl m-6 shadow-2xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Laporan Penjualan
      </h1>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari kasir atau barang..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleDateFilter}
          className="px-6 py-3 bg-utama text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Filter Tanggal
        </button>
        <button
          onClick={handleResetFilters}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-300"
        >
          Reset
        </button>
        <button
          onClick={handleExportCSV}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Export CSV
        </button>
      </div>

      {/* Column Selector */}
      <div className="mb-6">
        <span className="font-medium text-gray-700">Tampilkan Kolom: </span>
        {[
          "tanggal",
          "kasir",
          "total_transaksi",
          "total_pendapatan",
          "detail_barang",
        ].map((col) => (
          <label key={col} className="ml-4 inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={(e) =>
                setSelectedColumns((prev) =>
                  e.target.checked
                    ? [...prev, col]
                    : prev.filter((column) => column !== col)
                )
              }
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2 text-gray-600">{col.replace("_", " ")}</span>
          </label>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="table-auto w-full border-collapse bg-backgroundSec border border-border text-sm text-gray-800">
          <thead className="bg-utama text-background">
            <tr>
              {selectedColumns.includes("tanggal") && (
                <th className="border border-border px-6 py-4 text-left">
                  Tanggal
                </th>
              )}
              {selectedColumns.includes("kasir") && (
                <th className="border border-border px-6 py-4 text-left">
                  Kasir
                </th>
              )}
              {selectedColumns.includes("total_transaksi") && (
                <th className="border border-border px-6 py-4 text-left">
                  Total Transaksi
                </th>
              )}
              {selectedColumns.includes("total_pendapatan") && (
                <th className="border border-border px-6 py-4 text-left">
                  Pendapatan
                </th>
              )}
              {selectedColumns.includes("detail_barang") && (
                <th className="border border-border px-6 py-4 text-left">
                  Detail Barang
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((item, index) => (
                <tr
                  key={index}
                  className={
                    item.total_pendapatan > 1000000
                      ? "bg-green-100"
                      : "bg-backgroundSec"
                  }
                >
                  {selectedColumns.includes("tanggal") && (
                    <td className="border border-border px-6 py-4">
                      {item.tanggal}
                    </td>
                  )}
                  {selectedColumns.includes("kasir") && (
                    <td className="border border-border px-6 py-4">
                      {item.kasir}
                    </td>
                  )}
                  {selectedColumns.includes("total_transaksi") && (
                    <td className="border border-border px-6 py-4">
                      {item.total_transaksi.toLocaleString()}
                    </td>
                  )}
                  {selectedColumns.includes("total_pendapatan") && (
                    <td className="border border-border px-6 py-4">
                      {item.total_pendapatan.toLocaleString()}
                    </td>
                  )}
                  {selectedColumns.includes("detail_barang") && (
                    <td className="border border-border px-6 py-4">
                      <button
                        onClick={() =>
                          setOpenDetail(openDetail === index ? null : index)
                        }
                        className="text-blue-500 underline"
                      >
                        {openDetail === index ? "Tutup Detail" : "Lihat Detail"}
                      </button>
                      {openDetail === index && (
                        <div className="mt-2 space-y-2">
                          {item.barang_terjual.map((barang, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center pb-2"
                            >
                              <span className="font-medium">
                                {barang.nama_barang}
                              </span>
                              <span>
                                {barang.jumlah} x Rp
                                {barang.harga_satuan.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={selectedColumns.length}
                  className="text-center py-4 text-gray-500"
                >
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={selectedColumns.length - 1}
                className="text-right py-4 text-gray-700 font-semibold"
              >
                Total Pendapatan :
              </td>
              <td className="text-right p-4 text-gray-700 font-semibold">
                {totalPendapatan.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td
                colSpan={selectedColumns.length - 1}
                className="text-right py-4 text-gray-700 font-semibold"
              >
                Barang Terlaris :
              </td>
              <td className="text-right p-4 text-gray-700 font-semibold">
                {getBarangTerlaris().terlaris[0]} (
                {getBarangTerlaris().terlaris[1]} terjual)
              </td>
            </tr>
            <tr>
              <td
                colSpan={selectedColumns.length - 1}
                className="text-right py-4 text-gray-700 font-semibold"
              >
                Barang Kurang Laku :
              </td>
              <td className="text-right p-4 text-gray-700 font-semibold">
                {getBarangTerlaris().kurangLaku[0]} (
                {getBarangTerlaris().kurangLaku[1]} terjual)
              </td>
            </tr>
            <tr>
              <td
                colSpan={selectedColumns.length - 1}
                className="text-right py-4 text-gray-700 font-semibold"
              >
                Barang Tidak Laku :
              </td>
              <td className="text-right p-4 text-gray-700 font-semibold">
                {getBarangTerlaris().tidakLaku}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-600 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LaporanTabel;
