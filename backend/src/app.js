const express = require("express");
const usuarioRoutes = require("./routes/usuarios/usuarioRoutes");

const app = express();

app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);

module.exports = app;