require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth.controller');
const verifyInternalKey = require('./middleware/verify-internal-key');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(verifyInternalKey);

app.post('/login', authController.login);
app.get('/me', authController.me);
app.post('/refresh-token', authController.refreshToken);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
