import React, { forwardRef } from "react";

const PopupStruk = forwardRef(
  (
    { show, cart, kasirName, total, uangDiterima, kembalian, onClose, onPrint },
    ref
  ) => {
    if (!show) return null;

    // Fungsi untuk reset kasir
    const handlePrint = () => {
      onPrint();
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-96 p-6 rounded-2xl shadow-2xl transform scale-100 transition-all duration-300 ease-in-out">
          <div ref={ref}>
            <h3 className="text-center text-2xl  mb-6 text-background bg-utama rounded-md">
              Struk Transaksi
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Kasir:</span> {kasirName}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Tanggal:</span>{" "}
              {new Date().toLocaleString()}
            </p>
            <hr className="border-t-2 border-gray-200 mb-4" />
            <div>
              {cart.map((item) => (
                <div
                  key={item.barang_id}
                  className="flex justify-between items-center text-gray-700 mb-2"
                >
                  <span>
                    {item.nama_barang}{" "}
                    <span className="text-gray-500">x{item.jumlah}</span>
                  </span>
                  <span className="font-medium">
                    Rp {item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-t-2 border-gray-200 my-4" />
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Uang Diterima:</span>
              <span>Rp {uangDiterima.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Kembalian:</span>
              <span>Rp {kembalian.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-800 font-semibold text-lg mt-3">
              <span>Total:</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrint}
              className="bg-utama text-white py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform"
            >
              Cetak
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-white py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default PopupStruk;
