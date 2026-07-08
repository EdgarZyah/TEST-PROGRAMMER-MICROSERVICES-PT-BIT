import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingCart, History, LogOut, Wallet, LogIn } from 'lucide-react';
import Modal from './Modal';

interface SidebarProps {
  role: 'admin' | 'pembeli';
}

export default function Sidebar({ role }: SidebarProps) {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const adminMenu = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User' },
    { to: '/admin/products', icon: Package, label: 'Master Produk' },
  ];

  const pembeliMenu = [
    { to: '/pembeli/beli', icon: ShoppingCart, label: 'Pembelian Produk' },
    { to: '/pembeli/history', icon: History, label: 'History Pembayaran' },
  ];

  const menu = role === 'admin' ? adminMenu : pembeliMenu;

  return (
    <>
      <aside className="w-64 bg-blue-700 min-h-screen flex flex-col text-white fixed left-0 top-0 z-50">
        <div className="p-5 border-b border-blue-600">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            <span className="text-lg font-bold">Dompet PNBP</span>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive ? 'bg-blue-800 border-r-2 border-white' : 'hover:bg-blue-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-5 py-3 text-sm w-full text-left hover:bg-blue-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        className="max-w-sm"
        title={<><LogIn className="w-5 h-5 inline mr-2 -mt-0.5" /> Konfirmasi Logout</>}
      >
        <p className="text-gray-600 text-sm mb-6">
          Apakah Anda yakin ingin keluar dari sistem?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => { logout(); setShowLogoutModal(false); }}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Ya, Logout
          </button>
        </div>
      </Modal>
    </>
  );
}
