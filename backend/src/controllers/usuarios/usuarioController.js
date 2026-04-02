const db = require('../../database/connection.js');
const bcrypt = require('bcryptjs');

module.exports = {
    async ListarTodos(req, res) {
        try {
            const sql = 'SELECT id, nome, email, telefone, cargo, nivel, ativo, criado_em, atualizado_em FROM usuarios';
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuários listados com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar usuários',
                dados: error.message                
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const sql = 'SELECT id, nome, email, telefone, cargo, nivel, ativo, criado_em, atualizado_em FROM usuarios WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário encontrado',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar usuário',
                dados: error.message                
            });
        }
    },

    async criarUsuario(req, res) {
        try {
            const { nome, email, senha, telefone, cargo, nivel } = req.body;
            const senhaHash = await bcrypt.hash(senha, 10);
            const sql = `INSERT INTO usuarios (nome, email, senha, telefone, cargo, nivel) 
                         VALUES ($1, $2, $3, $4, $5, $6)
                         RETURNING id, nome, email, telefone, cargo, nivel, ativo, criado_em`;
            const result = await db.query(sql, [nome, email, senhaHash, telefone, cargo, nivel || 'vendedor']);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário criado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar usuário',
                dados: error.message                
            });
        }
    },

    async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, telefone, cargo, nivel } = req.body;
            const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;

            // Se senha não foi enviada, não atualiza o campo
            const sql = senhaHash
                ? 'UPDATE usuarios SET nome = $1, email = $2, senha = $3, telefone = $4, cargo = $5, nivel = $6, atualizado_em = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id, nome, email, telefone, cargo, nivel, ativo, atualizado_em'
                : 'UPDATE usuarios SET nome = $1, email = $2, telefone = $3, cargo = $4, nivel = $5, atualizado_em = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id, nome, email, telefone, cargo, nivel, ativo, atualizado_em';
            const params = senhaHash
                ? [nome, email, senhaHash, telefone, cargo, nivel, id]
                : [nome, email, telefone, cargo, nivel, id];
            const result = await db.query(sql, params);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar usuário',
                dados: error.message                
            });
        }
    },

    async removerUsuario(req, res) {
        try {
            const { id } = req.params;
            const sql = 'DELETE FROM usuarios WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário removido com sucesso'
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao remover usuário',
                dados: error.message                
            });
        }
    }
};