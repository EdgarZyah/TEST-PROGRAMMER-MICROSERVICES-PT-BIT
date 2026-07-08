import { Search } from 'lucide-react';

interface FilterBarProps {
  tanggalAwal: string;
  tanggalAkhir: string;
  status: string;
  onTanggalAwalChange: (v: string) => void;
  onTanggalAkhirChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFilter: () => void;
}

export default function FilterBar({
  tanggalAwal, tanggalAkhir, status,
  onTanggalAwalChange, onTanggalAkhirChange, onStatusChange, onFilter,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tanggal Awal</label>
        <input
          type="date"
          value={tanggalAwal}
          onChange={(e) => onTanggalAwalChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
        <input
          type="date"
          value={tanggalAkhir}
          onChange={(e) => onTanggalAkhirChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Semua</option>
          <option value="BELUM_DIBAYAR">Belum Dibayar</option>
          <option value="SUDAH_DIBAYAR">Sudah Dibayar</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>
      <button
        onClick={onFilter}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-blue-700"
      >
        <Search className="w-4 h-4" />
        Filter
      </button>
    </div>
  );
}
