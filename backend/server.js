const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(express.json());
app.use(cors()); 

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

const db = require('./db.js');

app.get('/api/data', async (req, res) => {
  try {
    const data = await db.any('SELECT * FROM vgsales LIMIT 1000');

    if (Array.isArray(data)) {
      res.json(data);
    } else {
      console.error('Error fetching data: Unexpected data format');
      res.status(500).json({ error: 'Unexpected data format' });
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
