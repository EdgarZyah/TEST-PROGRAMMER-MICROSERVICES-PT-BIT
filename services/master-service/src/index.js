require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productController = require('./controllers/product.controller');
const verifyInternalKey = require('./middleware/verify-internal-key');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use(verifyInternalKey);

app.get('/products', productController.listProducts);
app.get('/products/:id', productController.getProduct);
app.post('/products', productController.addProduct);
app.put('/products/:id', productController.updateProduct);
app.delete('/products/:id', productController.deleteProduct);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Master Service running on port ${PORT}`);
});
