import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/userApi";
import { Dialog } from "@headlessui/react";
import Loading from "../Loading";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "kasir",
  });
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data user.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.role) {
      Swal.fire("Error", "Mohon isi semua kolom.", "error");
      return;
    }

    setLoading(true);
    try {
      await createUser(newUser);
      fetchUsers();
      setNewUser({ username: "", password: "", role: "kasir" });
      setIsOpen(false);
      Swal.fire("Sukses", "User berhasil ditambahkan!", "success");
    } catch (error) {
      Swal.fire("Error", "Gagal membuat user.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateUser = async () => {
    if (!editUser.username || !editUser.password || !editUser.role) {
      Swal.fire("Error", "Mohon isi semua kolom.", "error");
      return;
    }

    setLoading(true);
    try {
      await updateUser(editUser.id, editUser);
      fetchUsers();
      setEditUser(null);
      setEditModalOpen(false);
      Swal.fire("Sukses", "User berhasil diperbarui!", "success");
    } catch (error) {
      Swal.fire("Error", "Gagal memperbarui user.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "User akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await deleteUser(id);
          fetchUsers();
          Swal.fire("Dihapus!", "User berhasil dihapus.", "success");
        } catch (error) {
          Swal.fire("Error", "Gagal menghapus user.", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 text-teks m-6 border-2 border-border shadow-2xl rounded-3xl">
      <h1 className="text-3xl font-semibold mb-4 text-teks">Kelola Pengguna</h1>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
      )}
      {loading && (
        <div className="p-2 mb-4">
          <Loading />
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 p-2 rounded-lg bg-utama text-white hover:bg-aksen transition-all duration-300"
      >
        Tambah User
      </button>

      <table className="min-w-full bg-backgroundSec text-teks border border-border rounded-lg shadow-md">
        <thead className="bg-utama text-background">
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Password</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-border">
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.password}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => {
                    setEditUser({ id: user._id, ...user });
                    setEditModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={loading}
                  className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding User */}
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 flex items-center bg-gray-500 bg-opacity-50 justify-center p-4 z-50"
        >
          <Dialog.Panel className="max-w-md w-full bg-teks p-6 rounded-lg shadow-lg text-aksen">
            <Dialog.Title className="text-2xl font-semibold mb-4">
              Tambah User
            </Dialog.Title>

            {error && (
              <div className="bg-red-500 text-white p-2 rounded mb-4">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500 mb-4"
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={handleAddUser}
                disabled={loading}
                className="w-full p-2 rounded-lg bg-utama text-white focus:outline-none focus:ring focus:ring-blue-500"
              >
                Tambah
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-500"
              >
                Batal
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}

      {/* Modal for Editing User */}
      {editModalOpen && (
        <Dialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          className="fixed  inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <Dialog.Panel className="max-w-md w-full bg-teks p-6 rounded-lg shadow-lg text-aksen">
            <Dialog.Title className="text-2xl font-semibold mb-4">
              Edit User
            </Dialog.Title>

            {error && (
              <div className="bg-red-500 text-white p-2 rounded mb-4">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Username"
              value={editUser.username}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={editUser.password}
              onChange={(e) =>
                setEditUser({ ...editUser, password: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500 mb-2"
            />
            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500 mb-4"
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={handleUpdateUser}
                disabled={loading}
                className="w-full p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring focus:ring-blue-500"
              >
                Update
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="w-full p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-500"
              >
                Batal
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
