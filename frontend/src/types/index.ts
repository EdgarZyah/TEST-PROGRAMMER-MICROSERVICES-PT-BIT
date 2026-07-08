export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  status: boolean;
  role: 'admin' | 'pembeli';
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  harga: number;
  created_at?: string;
}

export interface CartItem {
  keranjang_id: number;
  produk_id: number;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export interface Cart {
  transaksi_id: number;
  items: CartItem[];
  total_harga: number;
}

export interface Transaction {
  id: number;
  kode_billing: string;
  total_harga: number;
  status: 'BELUM_DIBAYAR' | 'SUDAH_DIBAYAR' | 'EXPIRED';
  expired_at: string;
  created_at: string;
  products: {
    produk_id: number;
    nama: string;
    jumlah: number;
    harga: number;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
