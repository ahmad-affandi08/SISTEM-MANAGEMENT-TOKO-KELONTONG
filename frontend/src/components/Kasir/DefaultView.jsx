// components/KaryawanProfile.js
import React, { useState, useEffect } from "react";
import { getKaryawanByUserLogin } from "../../api/karyawanApi";

const KaryawanProfile = () => {
  const [karyawan, setKaryawan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKaryawanData = async () => {
      try {
        const data = await getKaryawanByUserLogin();
        setKaryawan(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil data");
        setLoading(false);
      }
    };

    fetchKaryawanData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 border-2 border-border rounded-3xl m-6 shadow-2xl">
      <div className="relative z-10 max-w-7xl mx-auto  space-y-8">
        {/* Judul Hero */}
        <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-utama via-border to-aksen">
          Data Kasir
        </h2>

        {/* Konten */}
        {karyawan ? (
          <div className="space-y-8 text-lg sm:text-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Nama</p>
                <p className="text-2xl font-medium">{karyawan.nama}</p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Telepon</p>
                <p className="text-2xl font-medium">{karyawan.telepon}</p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Alamat</p>
                <p className="text-2xl font-medium">{karyawan.alamat}</p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Jenis Kelamin</p>
                <p className="text-2xl font-medium">{karyawan.jenisKelamin}</p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Tanggal Lahir</p>
                <p className="text-2xl font-medium">
                  {new Date(karyawan.tanggalLahir).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Status Pekerjaan</p>
                <p className="text-2xl font-medium">
                  {karyawan.statusPekerjaan}
                </p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Tanggal Mulai Kerja</p>
                <p className="text-2xl font-medium">
                  {new Date(karyawan.tanggalMulaiKerja).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Gaji</p>
                <p className="text-2xl font-medium">
                  Rp {karyawan.gaji.toLocaleString()}
                </p>
              </div>
              <div className="text-left transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Shift</p>
                <p className="text-2xl font-medium">{karyawan.shift}</p>
              </div>
              <div className="text-left sm:col-span-2 transform transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="font-semibold">Catatan</p>
                <p className="text-2xl font-medium">
                  {karyawan.catatan || "Tidak ada catatan"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg sm:text-xl">Karyawan tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default KaryawanProfile;
