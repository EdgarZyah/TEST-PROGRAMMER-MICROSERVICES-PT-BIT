import { useEffect, useState } from "react";
import { masterApi } from "../services/api";
import type { Product } from "../types";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus, Menu, Package } from "lucide-react";

export default function MasterProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", harga: "" });

  const loadProducts = async () => {
    try {
      const res = await masterApi.listProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", harga: "" });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ name: product.name, harga: product.harga.toString() });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await masterApi.updateProduct(editProduct.id, form);
      } else {
        await masterApi.addProduct(form);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Hapus produk ${product.name}?`)) return;
    try {
      await masterApi.deleteProduct(product.id);
      loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const columns = [
    { key: "id", label: "#", render: (_: any, __: any, idx: number) => <span>{idx + 1}</span> },
    { key: "name", label: "Nama Produk" },
    {
      key: "harga",
      label: "Harga per token/hit",
      render: (value: number) => (
        <span className="font-medium text-gray-700">
          Rp {value.toLocaleString("id-ID")}
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
          <Package className="w-6 h-6 inline mr-2 -mt-0.5" />
          Data Master Produk
        </h1>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-blue-600">
          <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
            <Menu className="w-5 h-5 shrink-0" /> Daftar Produk API
          </div>
          <button
            onClick={openAdd}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Product
          </button>
        </div>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={products}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="w-full max-w-lg"
        title={editProduct ? "Edit Produk" : <><Plus className="w-5 h-5 inline mr-2 -mt-0.5"/> Tambah Produk Baru</>}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Produk
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Masukkan nama produk"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Harga per Token/Hit
              </label>
              <input
                type="number"
                min="0"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/30"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
