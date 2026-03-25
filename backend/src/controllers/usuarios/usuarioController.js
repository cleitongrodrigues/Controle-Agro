const userService = require("../../services/usuario/usuarioService");

exports.getAll = (req, res) => {
  try {
    const users = userService.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};