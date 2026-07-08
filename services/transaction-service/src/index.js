require('dotenv').config();
const express = require('express');
const cors = require('cors');
const transactionController = require('./controllers/transaction.controller');
const verifyInternalKey = require('./middleware/verify-internal-key');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use(verifyInternalKey);

app.post('/cart/add', transactionController.addToCart);
app.get('/cart/:pembeli_id', transactionController.viewCart);
app.post('/checkout', transactionController.checkout);
app.get('/transactions/:pembeli_id', transactionController.listTransactions);
app.put('/transactions/:id/pay', transactionController.payTransaction);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Transaction Service running on port ${PORT}`);
});
