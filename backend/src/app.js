const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuarios/usuarioRoutes");
const fazendaRoutes = require("./routes/fazendas/fazendaRoutes");
const produtoRoutes = require("./routes/produtos/produtoRoutes");
const vendaRoutes = require("./routes/venda/vendaRoutes");
const metasRoutes = require("./routes/metas/metaRoutes");
const responsavelRoutes = require("./routes/responsaveis/responsavelRoutes");
const historicoRoutes = require("./routes/historico_venda/historicoRoutes");
const pedidoRoutes = require("./routes/pedidos/pedidoRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Rota pública
app.use("/auth", authRoutes);

// Rotas protegidas
app.use("/usuarios", authMiddleware, usuarioRoutes);
app.use("/fazendas", authMiddleware, fazendaRoutes);
app.use("/produtos", authMiddleware, produtoRoutes);
app.use("/vendas", authMiddleware, vendaRoutes);
app.use("/metas", authMiddleware, metasRoutes);
app.use("/responsaveis", authMiddleware, responsavelRoutes);
app.use("/historico_venda", authMiddleware, historicoRoutes);
app.use("/pedidos", authMiddleware, pedidoRoutes);

module.exports = app;