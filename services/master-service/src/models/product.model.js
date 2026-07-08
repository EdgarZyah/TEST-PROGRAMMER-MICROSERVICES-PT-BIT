const db = require('./db');

const ProductModel = {
  async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM produk ORDER BY created_at DESC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM produk WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByName(name) {
    const [rows] = await db.query('SELECT id FROM produk WHERE name = ?', [name]);
    return rows[0] || null;
  },

  async create({ name, harga }) {
    const [result] = await db.query(
      'INSERT INTO produk (name, harga) VALUES (?, ?)',
      [name, harga]
    );
    return result.insertId;
  },

  async update(id, { name, harga }) {
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (harga !== undefined) { fields.push('harga = ?'); values.push(harga); }

    if (fields.length === 0) return false;

    values.push(id);
    await db.query(`UPDATE produk SET ${fields.join(', ')} WHERE id = ?`, values);
    return true;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM produk WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = ProductModel;
