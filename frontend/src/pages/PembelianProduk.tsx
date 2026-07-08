import { useEffect, useState } from "react";
import { masterApi, transactionApi } from "../services/api";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import BillingModal from "../components/BillingModal";
import { ShoppingCart, Bell } from "lucide-react";

const cardColors = [
  "bg-gradient-to-br from-blue-600 to-blue-400",
  "bg-gradient-to-br from-yellow-600 to-yellow-400",
  "bg-gradient-to-br from-purple-600 to-purple-400",
];

export default function PembelianProduk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [jumlah, setJumlah] = useState(1);
  const [billingData, setBillingData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    masterApi
      .listProducts()
      .then((res) => setProducts(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBeli = (product: Product) => {
    setSelectedProduct(product);
    setJumlah(1);
    setCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    setProcessing(true);
    try {
      await transactionApi.addToCart(selectedProduct.id, jumlah);
      const res = await transactionApi.checkout();
      setBillingData(res.data);
      setCheckoutOpen(false);
      setBillingOpen(true);
    } catch (err: any) {
      alert(err.response?.data?.error || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12 text-gray-400 font-medium animate-pulse">
        Memuat Produk...
      </div>
    );

  return (
    <div className="p-2">
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">
          <ShoppingCart className="w-6 h-6 inline mr-2 -mt-0.5" />
          Beli Produk
        </h1>
        <div className="flex items-center gap-3">
          <button
            className="p-2.5 rounded-xl bg-white text-blue-600 hover:shadow-md transition-all duration-200 relative"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
          className="p-2.5 rounded-xl bg-white text-blue-600 hover:shadow-md transition-all duration-200 relative"
          title="Keranjang Belanja"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            onBeli={handleBeli}
            colorClass={cardColors[idx % cardColors.length]}
          />
        ))}
      </div>

      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        className="max-w-lg"
        title="Checkout Pembelian"
      >
        {selectedProduct && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Token/Hit yang ingin dibeli
              </label>
              <input
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) =>
                  setJumlah(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between border border-gray-200">
              <span className="font-bold text-xl text-gray-900">
                Rp {(selectedProduct.harga * jumlah).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/30"
              >
                {processing ? "Memproses..." : "Lanjutkan Pembayaran"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <BillingModal
        open={billingOpen}
        onClose={() => setBillingOpen(false)}
        billing={billingData}
      />
    </div>
  );
}
