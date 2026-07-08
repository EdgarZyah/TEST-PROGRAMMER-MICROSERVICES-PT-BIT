import { useEffect, useState } from "react";
import { rbacApi, masterApi, transactionApi } from "../services/api";
import { Users, Package, Receipt, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    transactions: 0,
  });

  useEffect(() => {
    Promise.all([
      rbacApi.listUsers(),
      masterApi.listProducts(),
      transactionApi.listTransactions(),
    ])
      .then(([usersRes, productsRes, txRes]) => {
        setStats({
          users: usersRes.data?.length || 0,
          products: productsRes.data?.length || 0,
          transactions: txRes.data?.length || 0,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      icon: Users,
      label: "Total User",
      value: stats.users,
      color: "bg-blue-500",
    },
    {
      icon: Package,
      label: "Total Produk",
      value: stats.products,
      color: "bg-blue-400",
    },
    {
      icon: Receipt,
      label: "Total Transaksi",
      value: stats.transactions,
      color: "bg-blue-600",
    },
  ];

  if (loading)
    return (
      <div className="p-2">
        <div className="text-center py-12 text-gray-400 font-medium animate-pulse">
          Loading data...
        </div>
      </div>
    );

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-blue-500 mb-8 tracking-tight">
        <LayoutDashboard className="w-6 h-6 inline mr-2 -mt-0.5" />
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow-sm border border-blue-50 p-5 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`${card.color} p-3 md:p-4 rounded-lg`}>
              <card.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-0.5 md:mb-1 truncate">
                {card.label}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-blue-500">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
