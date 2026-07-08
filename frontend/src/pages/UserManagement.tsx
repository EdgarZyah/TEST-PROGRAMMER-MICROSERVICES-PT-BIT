import { useEffect, useState } from "react";
import { rbacApi } from "../services/api";
import type { User } from "../types";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus, Search, Users, Check } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "PEMBELI",
    status: true,
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  const loadUsers = async () => {
    try {
      const res = await rbacApi.listUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAdd = () => {
    setEditUser(null);
    setForm({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "PEMBELI",
      status: true,
    });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      role: user.role,
      status: user.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        const payload: any = {
          name: form.name,
          email: form.email,
          username: form.username,
          role: form.role,
          status: form.status,
        };
        if (form.password) payload.password = form.password;
        await rbacApi.updateUser(editUser.id, payload);
      } else {
        await rbacApi.addUser(form);
      }
      setModalOpen(false);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Hapus user ${user.name}?`)) return;
    try {
      await rbacApi.deleteUser(user.id);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const columns = [
    { key: "id", label: "#" },
    {
      key: "name",
      label: "Nama Lengkap",
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (val: string) => <span>{val}</span>,
    },
    {
      key: "role",
      label: "Role / Group",
      render: (val: string) => (
        <span className="text-xs font-semibold px-2 py-1">
          {val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`px-2.5 py-1 rounded-sm text-xs font-semibold text-white ${value ? "bg-green-600" : "bg-gray-400"}`}
        >
          {value ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
  ];

  if (loading)
    return (
      <div className="text-center py-12 text-gray-400 font-medium animate-pulse">
        Loading data...
      </div>
    );

  return (
    <div className="p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">
          <Users className="w-6 h-6 inline mr-2 -mt-0.5" />
          Manajemen User
        </h1>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Cari User
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ketik nama atau username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="w-full sm:w-2/3 flex items-end justify-end">
            <button
              onClick={openAdd}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah User
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          <DataTable
            columns={columns}
            data={filtered}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-lg"
        title={editUser ? "Edit User" : <><Users className="w-6 h-6 inline mr-2 -mt-0.5" /> Tambah User Baru</>}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required={!editUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password{" "}
                <span className="text-gray-400 font-normal">
                  {editUser && "(opsional)"}
                </span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required={!editUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role / Group
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="PEMBELI">Pembeli</option>
              </select>
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={form.status ? "Aktif" : "Nonaktif"}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value === "Aktif" })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/30"
            >
              <Check className="w-4 h-4" /> Simpan User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
