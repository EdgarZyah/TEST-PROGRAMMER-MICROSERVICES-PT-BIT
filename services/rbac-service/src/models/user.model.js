const db = require('./db');

const UserModel = {
  async findAll() {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.username, u.status, u.created_at, ur.role
       FROM users u
       LEFT JOIN users_role ur ON u.id = ur.user_id
       ORDER BY u.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.username, u.status, u.created_at, ur.role
       FROM users u
       LEFT JOIN users_role ur ON u.id = ur.user_id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async create({ name, email, username, password, role, status }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [userResult] = await conn.query(
        'INSERT INTO users (name, email, username, password, status) VALUES (?, ?, ?, ?, ?)',
        [name, email, username, password, status !== undefined ? status : true]
      );

      await conn.query(
        'INSERT INTO users_role (user_id, role) VALUES (?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)',
        [userResult.insertId, role || 'user']
      );

      await conn.commit();
      return userResult.insertId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async update(id, { name, email, password, username, role, status }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const fields = [];
      const values = [];

      if (name !== undefined) { fields.push('name = ?'); values.push(name); }
      if (email !== undefined) { fields.push('email = ?'); values.push(email); }
      if (username !== undefined) { fields.push('username = ?'); values.push(username); }
      if (password !== undefined) { fields.push('password = ?'); values.push(password); }
      if (status !== undefined) { fields.push('status = ?'); values.push(status); }

      if (fields.length > 0) {
        values.push(id);
        await conn.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      }

      if (role !== undefined) {
        await conn.query('UPDATE users_role SET role = ? WHERE user_id = ?', [role, id]);
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
