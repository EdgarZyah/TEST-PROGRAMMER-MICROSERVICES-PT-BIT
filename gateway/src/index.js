require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const rbacRoutes = require('./routes/rbac.routes');
const masterRoutes = require('./routes/master.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', rbacRoutes);
app.use('/api', masterRoutes);
app.use('/api', transactionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway' });
});

app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({ error: 'Internal Gateway Error' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
