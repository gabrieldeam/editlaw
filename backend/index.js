const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ message: 'API do EditLaw funcionando!' });
});


app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
