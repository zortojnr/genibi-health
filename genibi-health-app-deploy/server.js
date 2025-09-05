const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from health-app directory
app.use(express.static(path.join(__dirname, 'health-app')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'health-app', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Genibi Health App running at http://localhost:${PORT}`);
  console.log(`📱 Open the URL in your browser to access the app`);
  console.log(`🛑 Press Ctrl+C to stop the server`);
});
