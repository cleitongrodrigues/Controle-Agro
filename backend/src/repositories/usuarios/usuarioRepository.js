let users = [];

exports.findAll = () => users;

exports.findById = (id) => users.find(u => u.id == id);

exports.create = (data) => {
  const newUser = { id: Date.now(), ...data };
  users.push(newUser);
  return newUser;
};

exports.update = (id, data) => {
  const index = users.findIndex(u => u.id == id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...data };
  return users[index];
};

exports.delete = (id) => {
  const existing = users.find(u => u.id == id);
  if (!existing) return null;
  users = users.filter(u => u.id != id);
  return existing;
};