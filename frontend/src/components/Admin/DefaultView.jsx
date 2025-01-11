import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { fetchLaporan } from "../../api/laporanApi";
import { getAllBarang } from "../../api/barangApi";
import { getAllKategori } from "../../api/kategoriApi";
import {
  FaMoneyBillWave,
  FaExchangeAlt,
  FaCogs,
  FaThLarge,
  FaChartLine,
  FaSyncAlt,
  FaWarehouse,
  FaPlusSquare,
} from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { BiLineChart } from "react-icons/bi";
import Loading from "../Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DefaultView = () => {
  const [laporan, setLaporan] = useState([]);
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(0);

  useEffect(() => {
    const getLaporanData = async () => {
      try {
        const laporanData = await fetchLaporan();
        setLaporan(laporanData);
        const total = laporanData.reduce(
          (acc, item) => acc + item.total_pendapatan,
          0
        );
        setTotalPendapatan(total);
        setTotalTransaksi(laporanData.length);
      } catch (error) {
        setError(error.message || "Failed to load data.");
      }
    };

    const getBarangData = async () => {
      try {
        const barangData = await getAllBarang();
        setBarang(barangData);
      } catch (error) {
        setError(error.message || "Failed to load barang.");
      }
    };

    const getKategoriData = async () => {
      try {
        const kategoriData = await getAllKategori();
        setKategori(kategoriData);
      } catch (error) {
        setError(error.message || "Failed to load kategori.");
      }
    };

    getLaporanData();
    getBarangData();
    getKategoriData();
  }, []);

  useEffect(() => {
    if (laporan.length > 0 && barang.length > 0 && kategori.length > 0) {
      setLoading(false);
    }
  }, [laporan, barang, kategori]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-6 text-lg text-red-600">
        Error: {error}
      </div>
    );
  }

  const kasirData = laporan.reduce((acc, item) => {
    const kasir = item.kasir;
    acc[kasir] = (acc[kasir] || 0) + item.total_pendapatan;
    return acc;
  }, {});

  const kasirLabels = Object.keys(kasirData);
  const kasirValues = Object.values(kasirData);

  const pieData = {
    labels: kasirLabels,
    datasets: [
      {
        data: kasirValues,
        backgroundColor: [
          "#6C5B7B",
          "#F1A7B7",
          "#F6C89F",
          "#F7D1CD",
          "#A8D0E6",
          "#6A0572",
          "#CFF7F6",
          "#FF6F61",
          "#FF9F8F",
          "#FFE156",
        ],
        hoverBackgroundColor: [
          "#6C5B7B",
          "#F1A7B7",
          "#F6C89F",
          "#F7D1CD",
          "#A8D0E6",
          "#6A0572",
          "#CFF7F6",
          "#FF6F61",
          "#FF9F8F",
          "#FFE156",
        ],
        borderWidth: 2,
      },
    ],
  };

  const dateLabels = laporan.map((item) => item.tanggal);
  const totalPendapatanValues = laporan.map((item) => item.total_pendapatan);

  const lineData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Total Pendapatan",
        data: totalPendapatanValues,
        fill: true,
        borderColor: "#FF7F50",
        backgroundColor: "rgba(0, 123, 255, 0.3)",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "blue",
        pointBorderColor: "#FF7F50",
        pointHoverBackgroundColor: "#32CD32",
        pointHoverBorderColor: "#32CD32",
        pointHoverRadius: 9,
      },
    ],
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Card 1: Total Pendapatan */}
        <div className="bg-gradient-to-r from-green-300 via-green-500 to-green-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all relative">
          <div className="flex items-center space-x-4">
            <FaMoneyBillWave className="text-5xl text-white drop-shadow-lg" />
            <div>
              <h3 className="text-2xl font-bold text-white">
                Total Pendapatan
              </h3>
              <p className="text-xl text-white font-medium">
                {totalPendapatan}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 p-2 rounded-md text-white text-sm font-medium">
            <p>Keuntungan bulan ini meningkat sebesar 15% 🎉</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/30 p-2 rounded-full">
            <FaChartLine className="text-2xl text-green-900" />
          </div>
        </div>

        {/* Card 2: Total Transaksi */}
        <div className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all relative">
          <div className="flex items-center space-x-4">
            <FaExchangeAlt className="text-5xl text-white drop-shadow-lg" />
            <div>
              <h3 className="text-2xl font-bold text-white">Total Transaksi</h3>
              <p className="text-xl text-white font-medium">{totalTransaksi}</p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 p-2 rounded-md text-white text-sm font-medium">
            <p>Rata-rata transaksi harian: 120 transaksi ⚡</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/30 p-2 rounded-full">
            <FaSyncAlt className="text-2xl text-blue-900" />
          </div>
        </div>

        {/* Card 3: Total Barang */}
        <div className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all relative">
          <div className="flex items-center space-x-4">
            <FaCogs className="text-5xl text-white drop-shadow-lg" />
            <div>
              <h3 className="text-2xl font-bold text-white">Total Barang</h3>
              <p className="text-xl text-white font-medium">{barang.length}</p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 p-2 rounded-md text-white text-sm font-medium">
            <p>Stok barang: 75% tersedia ✅</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/30 p-2 rounded-full">
            <FaWarehouse className="text-2xl text-orange-900" />
          </div>
        </div>

        {/* Card 4: Total Kategori */}
        <div className="bg-gradient-to-r from-purple-300 via-purple-500 to-purple-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all relative">
          <div className="flex items-center space-x-4">
            <FaThLarge className="text-5xl text-white drop-shadow-lg" />
            <div>
              <h3 className="text-2xl font-bold text-white">Total Kategori</h3>
              <p className="text-xl text-white font-medium">
                {kategori.length}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 p-2 rounded-md text-white text-sm font-medium">
            <p>Kategori baru ditambahkan bulan ini: 3 🌟</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/30 p-2 rounded-full">
            <FaPlusSquare className="text-2xl text-purple-900" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 ">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all col-span-2 h-full">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <GiChart className="text-xl text-teal-500" />
            <span>Distribusi Penjualan per Kasir</span>
          </h3>
          <div className="w-full h-full">
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all col-span-4 h-full">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <BiLineChart className="text-xl text-teal-500" />
            <span>Penjualan dari Waktu ke Waktu</span>
          </h3>
          <div className="w-full h-full">
            <Line data={lineData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultView;
