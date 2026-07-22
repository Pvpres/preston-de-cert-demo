require('dotenv').config();
const path = require('path');
const express = require('express');
const appointmentRoutes = require('./routes/appointments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', appointmentRoutes);
app.use('/', dashboardRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Careotter demo running on http://localhost:${PORT}`);
});
