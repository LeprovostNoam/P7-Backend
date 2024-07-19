const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

app.post('/api/auth/signup', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
