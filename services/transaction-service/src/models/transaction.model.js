const db = require('./db');

const TransactionModel = {
  async findCartByPembeli(pembeliId) {
    const [rows] = await db.query(
      `SELECT t.id AS transaksi_id, t.status, t.expired_at, t.kode_billing,
              k.id AS keranjang_id, k.produk_id, k.jumlah, k.harga
       FROM transaksi t
       LEFT JOIN keranjang k ON t.id = k.transaksi_id
       WHERE t.pembeli_id = ? AND t.status = 'BELUM_DIBAYAR'
       ORDER BY t.created_at DESC`,
      [pembeliId]
    );
    return rows;
  },

  async findTransactionById(id) {
    const [rows] = await db.query('SELECT * FROM transaksi WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findTransactionsByPembeli(pembeliId) {
    const [rows] = await db.query(
      `SELECT * FROM transaksi WHERE pembeli_id = ? ORDER BY created_at DESC`,
      [pembeliId]
    );
    return rows;
  },

  async findAllTransactions() {
    const [rows] = await db.query(
      'SELECT * FROM transaksi ORDER BY created_at DESC'
    );
    return rows;
  },

  async createTransaction({ kode_billing, pembeli_id, total_harga, expired_at }) {
    const [result] = await db.query(
      `INSERT INTO transaksi (kode_billing, pembeli_id, total_harga, expired_at)
       VALUES (?, ?, ?, ?)`,
      [kode_billing, pembeli_id, total_harga, expired_at]
    );
    return result.insertId;
  },

  async addKeranjang({ transaksi_id, produk_id, jumlah, harga }) {
    const [result] = await db.query(
      `INSERT INTO keranjang (transaksi_id, produk_id, jumlah, harga)
       VALUES (?, ?, ?, ?)`,
      [transaksi_id, produk_id, jumlah, harga]
    );
    return result.insertId;
  },

  async updateStatus(id, status) {
    await db.query('UPDATE transaksi SET status = ? WHERE id = ?', [status, id]);
  },

  async markExpiredTransactions() {
    await db.query(
      `UPDATE transaksi SET status = 'EXPIRED'
       WHERE status = 'BELUM_DIBAYAR' AND expired_at < NOW()`
    );
  },

  async updateTransactionTotal(id, total_harga) {
    await db.query('UPDATE transaksi SET total_harga = ? WHERE id = ?', [total_harga, id]);
  },

  async updateTransaction(id, { kode_billing, total_harga, expired_at, status }) {
    await db.query(
      'UPDATE transaksi SET kode_billing = ?, total_harga = ?, expired_at = ?, status = ? WHERE id = ?',
      [kode_billing, total_harga, expired_at, status, id]
    );
  },

  async getKeranjangByTransaksi(transaksiId) {
    return db.query('SELECT * FROM keranjang WHERE transaksi_id = ?', [transaksiId]);
  },

  async deleteCartItems(transaksiId) {
    await db.query('DELETE FROM keranjang WHERE transaksi_id = ?', [transaksiId]);
  },

  async deleteTransaction(id) {
    await db.query('DELETE FROM transaksi WHERE id = ?', [id]);
  },
};

module.exports = TransactionModel;
