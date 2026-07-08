import { useEffect, useState } from 'react';
import { transactionApi } from '../services/api';
import type { Transaction } from '../types';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import BillingModal from '../components/BillingModal';
import { Eye, CreditCard, Clock } from 'lucide-react';

export default function HistoryPembayaran() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    try {
      const res = await transactionApi.listTransactions();
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const handlePay = async (id: number) => {
    try {
      await transactionApi.payTransaction(id);
      alert('Pembayaran berhasil!');
      setDetailTx(null);
      loadTransactions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal melakukan pembayaran');
    }
  };

  const filtered = transactions.filter((t) => {
    const tgl = new Date(t.created_at);
    if (tanggalAwal && tgl < new Date(tanggalAwal)) return false;
    if (tanggalAkhir && tgl > new Date(tanggalAkhir + 'T23:59:59')) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { key: 'id', label: '#' },
    { key: 'kode_billing', label: 'ID Transaksi', render: (val: string) => <span className="font-mono text-sm font-medium text-gray-700">{val}</span> },
    {
      key: 'created_at',
      label: 'Tanggal',
      render: (value: string) => <span className="text-gray-600">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>,
    },
    {
      key: 'products',
      label: 'Produk',
      render: (_: any, row: Transaction) => <span className="text-gray-700">{row.products?.map((p) => p.nama).join(', ') || '-'}</span>,
    },
    {
      key: 'total_harga',
      label: 'Total (Rp)',
      render: (value: number) => <span className="font-semibold text-gray-900">Rp {value.toLocaleString('id-ID')}</span>,
    },
    {
      key: 'status',
      label: 'Status Pembayaran',
      render: (value: string) => {
        if (value === 'SUDAH_DIBAYAR') {
          return <span className="px-3 py-1.5 rounded-sm text-xs font-semibold bg-green-500 text-white whitespace-nowrap">Sudah Dibayar</span>;
        }
        if (value === 'BELUM_DIBAYAR') {
          return <span className="px-3 py-1.5 rounded-sm text-xs font-semibold bg-yellow-500 text-white whitespace-nowrap">Menunggu Pembayaran</span>;
        }
        if (value === 'EXPIRED') {
          return <span className="px-3 py-1.5 rounded-sm text-xs font-semibold bg-red-500 text-white whitespace-nowrap">Expired</span>;
        }
        return <span className="px-3 py-1.5 rounded-sm text-xs font-semibold bg-gray-500 text-white whitespace-nowrap">{value}</span>;
      },
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (_: any, row: Transaction) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDetailTx(row)}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Detail
          </button>
          {row.status === 'BELUM_DIBAYAR' && (
            <button
              onClick={() => handlePay(row.id)}
              className="flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Bayar
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-center py-12 text-gray-400 font-medium animate-pulse">Memuat riwayat...</div>;

  return (
    <div className="p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-800 tracking-tight"><Clock className="w-6 h-6 inline mr-2 -mt-0.5" />History Transaksi Pembayaran</h1>
      </div>

      <FilterBar
        tanggalAwal={tanggalAwal}
        tanggalAkhir={tanggalAkhir}
        status={statusFilter}
        onTanggalAwalChange={setTanggalAwal}
        onTanggalAkhirChange={setTanggalAkhir}
        onStatusChange={setStatusFilter}
        onFilter={() => {}}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-blue-700">Daftar Transaksi Pembayaran</h3>
        </div>
        <div className="p-5">
          <DataTable columns={columns} data={filtered} showActions={false} />
        </div>
      </div>

      <BillingModal
        open={!!detailTx}
        onClose={() => setDetailTx(null)}
        billing={detailTx ? { kode_billing: detailTx.kode_billing, total_harga: detailTx.total_harga, expired_at: detailTx.expired_at } : null}
      />
    </div>
  );
}
