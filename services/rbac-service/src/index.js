require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rbacController = require('./controllers/rbac.controller');
const verifyInternalKey = require('./middleware/verify-internal-key');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use(verifyInternalKey);

app.get('/users', rbacController.listUsers);
app.post('/add_users', rbacController.addUser);
app.put('/update_users/:id', rbacController.updateUser);
app.delete('/delete_users/:id', rbacController.deleteUser);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`RBAC Service running on port ${PORT}`);
});
