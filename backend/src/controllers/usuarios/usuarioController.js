let users = [];

exports.getAll = (req, res) => {
  res.json(users);
};

exports.getById = (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => String(u.id) === String(id));
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
};

exports.create = (req, res) => {
  const data = req.body || {};
  const newUser = { id: Date.now(), ...data };
  users.push(newUser);
  res.status(201).json(newUser);
};

exports.update = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => String(u.id) === String(id));
  if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
};

exports.remove = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => String(u.id) === String(id));
  if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });
  const [deleted] = users.splice(index, 1);
  res.json(deleted);
};