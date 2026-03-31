const express = require("express");
const usuarioRoutes = require("./routes/usuarios/usuarioRoutes");
const fazendaRoutes = require("./routes/fazendas/fazendaRoutes");
const produtoRoutes = require("./routes/produtos/produtoRoutes");
const vendaRoutes = require("./routes/venda/vendaRoutes");
const metasRoutes = require("./routes/metas/metaRoutes");
const clienteRoutes = require("./routes/clientes/clienteRoutes");

const app = express();

app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/fazendas", fazendaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/vendas", vendaRoutes);
app.use("/metas", metasRoutes);
app.use("/clientes", clienteRoutes);

module.exports = app;