const express = require("express");
const usuarioRoutes = require("./routes/usuarios/usuarioRoutes");
const fazendaRoutes = require("./routes/fazendas/fazendaRoutes");
const produtoRoutes = require("./routes/produtos/produtoRoutes");
const vendaRoutes = require("./routes/venda/vendaRoutes");

const app = express();

app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/fazendas", fazendaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/vendas", vendaRoutes);

module.exports = app;