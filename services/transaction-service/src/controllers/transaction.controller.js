const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const TransactionModel = require('../models/transaction.model');

const MASTER_URL = process.env.MASTER_SERVICE_URL || 'http://localhost:3003';
const INTERNAL_KEY = process.env.INTERNAL_KEY || 'gateway-secret';

function generateKodeBilling() {
  return 'BILL-' + uuidv4().slice(0, 8).toUpperCase();
}

async function getProductFromMaster(produkId) {
  try {
    const resp = await axios.get(`${MASTER_URL}/products/${produkId}`, {
      headers: { 'x-internal-key': INTERNAL_KEY },
    });
    return resp.data.data;
  } catch {
    return null;
  }
}

const TransactionController = {
  async addToCart(req, res) {
    try {
      const { pembeli_id, produk_id, jumlah } = req.body;

      if (!pembeli_id || !produk_id || !jumlah) {
        return res.status(400).json({ error: 'pembeli_id, produk_id, and jumlah are required' });
      }
      if (jumlah <= 0) {
        return res.status(400).json({ error: 'Jumlah must be positive' });
      }

      const product = await getProductFromMaster(produk_id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let existingCart = await TransactionModel.findCartByPembeli(pembeli_id);
      let transaksiId;
      let createdNew = false;

      if (existingCart.length > 0) {
        transaksiId = existingCart[0].transaksi_id;
      } else {
        transaksiId = await TransactionModel.createTransaction({
          kode_billing: generateKodeBilling(),
          pembeli_id,
          total_harga: 0,
          expired_at: new Date(Date.now() + 10 * 60 * 1000),
        });
        createdNew = true;
      }

      await TransactionModel.addKeranjang({
        transaksi_id: transaksiId,
        produk_id,
        jumlah,
        harga: parseFloat(product.harga),
      });

      const cartItems = await TransactionModel.findCartByPembeli(pembeli_id);
      const total = cartItems.reduce((sum, item) => sum + parseFloat(item.harga) * item.jumlah, 0);

      await TransactionModel.updateTransactionTotal(transaksiId, total);

      res.json({
        message: 'Product added to cart',
        transaksi_id: transaksiId,
        total_harga: total,
      });
    } catch (err) {
      console.error('Add to cart error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async viewCart(req, res) {
    try {
      const { pembeli_id } = req.params;
      const cartItems = await TransactionModel.findCartByPembeli(pembeli_id);

      if (cartItems.length === 0) {
        return res.json({ data: null, total_harga: 0 });
      }

      const productIds = [...new Set(cartItems.map(item => item.produk_id))];
      const productsMap = {};

      for (const pid of productIds) {
        const p = await getProductFromMaster(pid);
        if (p) productsMap[pid] = p;
      }

      const items = cartItems
        .filter(item => item.keranjang_id)
        .map(item => ({
          keranjang_id: item.keranjang_id,
          produk_id: item.produk_id,
          nama_produk: productsMap[item.produk_id]?.name || 'Unknown',
          jumlah: item.jumlah,
          harga_satuan: parseFloat(item.harga),
          subtotal: parseFloat(item.harga) * item.jumlah,
        }));

      const total = items.reduce((sum, item) => sum + item.subtotal, 0);

      res.json({
        data: {
          transaksi_id: cartItems[0].transaksi_id,
          items,
          total_harga: total,
        },
      });
    } catch (err) {
      console.error('View cart error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async checkout(req, res) {
    try {
      const { pembeli_id } = req.body;

      if (!pembeli_id) {
        return res.status(400).json({ error: 'pembeli_id is required' });
      }

      const cartItems = await TransactionModel.findCartByPembeli(pembeli_id);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const total = cartItems.reduce((sum, item) => sum + parseFloat(item.harga) * item.jumlah, 0);
      const transaksiId = cartItems[0].transaksi_id;
      const kodeBilling = generateKodeBilling();
      const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

      await TransactionModel.updateTransaction(transaksiId, {
        kode_billing: kodeBilling,
        total_harga: total,
        expired_at: expiredAt,
        status: 'BELUM_DIBAYAR',
      });

      const productIds = [...new Set(cartItems.map(item => item.produk_id))];
      const productsMap = {};
      for (const pid of productIds) {
        const p = await getProductFromMaster(pid);
        if (p) productsMap[pid] = p;
      }

      const items = cartItems
        .filter(item => item.keranjang_id)
        .map(item => ({
          produk_id: item.produk_id,
          nama_produk: productsMap[item.produk_id]?.name || 'Unknown',
          jumlah: item.jumlah,
          harga: parseFloat(item.harga),
        }));

      res.json({
        message: 'Checkout successful',
        data: {
          transaksi_id: transaksiId,
          kode_billing: kodeBilling,
          total_harga: total,
          expired_at: expiredAt.toISOString(),
          items,
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async listTransactions(req, res) {
    try {
      const { pembeli_id } = req.params;

      await TransactionModel.markExpiredTransactions();

      let transactions;
      if (pembeli_id === 'all') {
        transactions = await TransactionModel.findAllTransactions();
      } else {
        transactions = await TransactionModel.findTransactionsByPembeli(pembeli_id);
      }

      const result = [];
      for (const t of transactions) {
        const [cartRows] = await TransactionModel.getKeranjangByTransaksi(t.id);

        const products = await Promise.all(
          cartRows.map(async (item) => {
            const p = await getProductFromMaster(item.produk_id);
            return {
              produk_id: item.produk_id,
              nama: p?.name || 'Unknown',
              jumlah: item.jumlah,
              harga: parseFloat(item.harga),
            };
          })
        );

        result.push({
          id: t.id,
          kode_billing: t.kode_billing,
          total_harga: parseFloat(t.total_harga),
          status: t.status,
          expired_at: t.expired_at,
          created_at: t.created_at,
          products,
        });
      }

      res.json({ data: result });
    } catch (err) {
      console.error('List transactions error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async payTransaction(req, res) {
    try {
      const { id } = req.params;

      const transaction = await TransactionModel.findTransactionById(id);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      if (transaction.status === 'SUDAH_DIBAYAR') {
        return res.status(400).json({ error: 'Transaction already paid' });
      }
      if (transaction.status === 'EXPIRED') {
        return res.status(400).json({ error: 'Transaction has expired' });
      }
      if (new Date(transaction.expired_at) < new Date()) {
        await TransactionModel.updateStatus(id, 'EXPIRED');
        return res.status(400).json({ error: 'Transaction has expired' });
      }

      await TransactionModel.updateStatus(id, 'SUDAH_DIBAYAR');

      res.json({ message: 'Payment successful', status: 'SUDAH_DIBAYAR' });
    } catch (err) {
      console.error('Pay transaction error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = TransactionController;
