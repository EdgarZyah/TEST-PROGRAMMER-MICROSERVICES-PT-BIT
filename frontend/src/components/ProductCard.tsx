import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: { id: number; name: string; harga: number };
  onBeli: (product: { id: number; name: string; harga: number }) => void;
  colorClass: string;
}

export default function ProductCard({
  product,
  onBeli,
  colorClass,
}: ProductCardProps) {
  return (
    <div
      className={`rounded-xl shadow-lg p-6 text-white ${colorClass} flex flex-col justify-between min-h-[200px]`}
    >
      <div>
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-2xl font-semibold">
          Rp {product.harga.toLocaleString("id-ID")}
        </p>
        <p className="text-sm opacity-80 mt-1">per token/hit</p>
      </div>
      <button
        onClick={() => onBeli(product)}
        className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-100 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Beli Sekarang
      </button>
    </div>
  );
}
