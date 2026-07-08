import { Receipt, CheckCircle } from "lucide-react";

interface BillingModalProps {
  open: boolean;
  onClose: () => void;
  billing: {
    kode_billing: string;
    total_harga: number;
    expired_at: string;
  } | null;
}

export default function BillingModal({
  open,
  onClose,
  billing,
}: BillingModalProps) {
  if (!open || !billing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden">
        <div className="bg-green-700 text-white px-6 py-5">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6" />
            <h2 className="text-lg font-bold">Kode Billing Simponi</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

            <div>
              <p className="font-semibold text-gray-800">
                Billing berhasil dibuat
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Berikut ini informasi kode billing dari sistem SIMPONI Kemenkeu.
              </p>
            </div>
          </div>

          <table className="w-full text-sm mb-5">
            <tbody>
              <tr className="w-full flex border-b border-gray-100">
                <td className="py-2.5 text-gray-500 w-44">Kode Billing</td>
                <td className="py-2.5 font-bold text-gray-600">
                  {billing.kode_billing}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 text-gray-500">Nominal</td>
                <td className="py-2.5 font-bold text-gray-800">
                  Rp {billing.total_harga.toLocaleString("id-ID")}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-500">Tanggal Kadaluarsa</td>
                <td className="py-2.5 font-semibold text-gray-800">
                  {new Date(billing.expired_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-sm">
            <p className="text-blue-600 font-semibold mb-2">
              Tata cara pembayaran
            </p>
            <ol className="list-decimal ml-4 space-y-1.5">
              <li>
                Buka aplikasi{" "}
                <strong>BRI / BNI / Mandiri / BSI / Bank lain</strong> yang
                mendukung pembayaran PNPB SIMPONI
              </li>
              <li>
                Pilih menu <strong>Pembayaran › PNBP › SIMPONI</strong>
              </li>
              <li>
                Masukkan <strong>Kode billing</strong> diatas.
              </li>
              <li>Perikasi rincian transaksi, dan lakukan pembayaran</li>
              <li>
                Simpan bukti bayar. Token askan otomatis aktif setelah
                verifikasi oleh sistem
              </li>
            </ol>
          </div>
          <button
            onClick={onClose}
            className="mt-6 inline-flex items-end gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Selesai</span>
          </button>
        </div>
      </div>
    </div>
  );
}
