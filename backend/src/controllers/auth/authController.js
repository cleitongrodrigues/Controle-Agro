const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../database/connection.js');

module.exports = {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'E-mail e senha são obrigatórios'
                });
            }

            const result = await db.query(
                'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Credenciais inválidas'
                });
            }

            const usuario = result.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Credenciais inválidas'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    nivel: usuario.nivel
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    cargo: usuario.cargo,
                    nivel: usuario.nivel
                }
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao realizar login',
                erro: error.message
            });
        }
    },

    async me(req, res) {
        try {
            const result = await db.query(
                'SELECT id, nome, email, cargo, nivel, ativo, criado_em FROM usuarios WHERE id = $1',
                [req.usuarioId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar dados do usuário',
                erro: error.message
            });
        }
    }
};
