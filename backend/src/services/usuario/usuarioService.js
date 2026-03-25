const usuarioRepository = require("../../repositories/usuarios/usuarioRepository");

exports.getAll = () => {
  return usuarioRepository.findAll();
};

exports.getById = (id) => {
  return usuarioRepository.findById(id);
};

exports.create = (data) => {
  return usuarioRepository.create(data);
};

exports.update = (id, data) => {
  return usuarioRepository.update(id, data);
};

exports.remove = (id) => {
  return usuarioRepository.delete(id);
};