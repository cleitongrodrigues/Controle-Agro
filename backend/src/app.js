const express = require("express");
const usuarioRoutes = require("./routes/usuarios/usuarioRoutes");
const fazendaRoutes = require("./routes/fazendas/fazendaRoutes");

const app = express();

app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/fazendas", fazendaRoutes);

module.exports = app;