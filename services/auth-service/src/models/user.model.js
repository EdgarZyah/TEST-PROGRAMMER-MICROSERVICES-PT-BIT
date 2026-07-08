const db = require('./db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, ur.role FROM users u
       LEFT JOIN users_role ur ON u.id = ur.user_id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.username, u.status, ur.role
       FROM users u
       LEFT JOIN users_role ur ON u.id = ur.user_id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = UserModel;
