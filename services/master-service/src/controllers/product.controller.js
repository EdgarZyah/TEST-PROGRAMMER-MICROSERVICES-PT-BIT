const ProductModel = require('../models/product.model');

const ProductController = {
  async listProducts(req, res) {
    try {
      const products = await ProductModel.findAll();
      res.json({ data: products });
    } catch (err) {
      console.error('List products error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ data: product });
    } catch (err) {
      console.error('Get product error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async addProduct(req, res) {
    try {
      const { name, harga } = req.body;

      if (!name || harga === undefined) {
        return res.status(400).json({ error: 'Name and harga are required' });
      }

      if (parseFloat(harga) < 0) {
        return res.status(400).json({ error: 'Harga cannot be negative' });
      }

      const existing = await ProductModel.findByName(name);
      if (existing) {
        return res.status(409).json({ error: 'Product name already exists' });
      }

      const id = await ProductModel.create({ name, harga: parseFloat(harga) });
      res.status(201).json({ message: 'Product created', id });
    } catch (err) {
      console.error('Add product error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, harga } = req.body;

      const existing = await ProductModel.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (harga !== undefined && parseFloat(harga) < 0) {
        return res.status(400).json({ error: 'Harga cannot be negative' });
      }

      if (name) {
        const nameExists = await ProductModel.findByName(name);
        if (nameExists && nameExists.id !== parseInt(id)) {
          return res.status(409).json({ error: 'Product name already exists' });
        }
      }

      await ProductModel.update(id, {
        name,
        harga: harga !== undefined ? parseFloat(harga) : undefined,
      });

      res.json({ message: 'Product updated' });
    } catch (err) {
      console.error('Update product error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProductModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted' });
    } catch (err) {
      console.error('Delete product error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = ProductController;
