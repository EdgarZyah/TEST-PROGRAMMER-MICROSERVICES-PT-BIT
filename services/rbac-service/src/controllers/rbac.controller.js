const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');

const RbacController = {
  async listUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json({ data: users });
    } catch (err) {
      console.error('List users error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async addUser(req, res) {
    try {
      const { name, email, username, password, role, status } = req.body;

      if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'Name, email, username, and password are required' });
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const normalizedRole = (role || 'PEMBELI').toUpperCase();

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await UserModel.create({
        name,
        email,
        username,
        password: hashedPassword,
        role: normalizedRole,
        status,
      });

      res.status(201).json({ message: 'User created', id: userId });
    } catch (err) {
      console.error('Add user error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, username, password, role, status } = req.body;

      const existing = await UserModel.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'User not found' });
      }

      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      await UserModel.update(id, {
        name,
        email,
        username,
        password: hashedPassword,
        role: role ? role.toUpperCase() : undefined,
        status,
      });

      res.json({ message: 'User updated' });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await UserModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = RbacController;
