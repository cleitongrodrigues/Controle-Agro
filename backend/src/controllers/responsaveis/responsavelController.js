const db = require('../../database/connection.js');

module.exports = {
    async listarTodos(req, res) {
        try {
            const sql = `
                SELECT r.*, f.nome AS fazenda_nome
                FROM responsaveis r
                JOIN fazendas f ON f.id = r.fazenda_id
                ORDER BY f.nome, r.principal DESC, r.nome
            `;
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Responsáveis listados com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar responsáveis',
                dados: error.message
            });
        }
    },

    async listarPorFazenda(req, res) {
        try {
            const { fazenda_id } = req.params;
            const sql = `
                SELECT * FROM responsaveis
                WHERE fazenda_id = $1
                ORDER BY principal DESC, nome
            `;
            const result = await db.query(sql, [fazenda_id]);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Responsáveis da fazenda listados com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar responsáveis da fazenda',
                dados: error.message
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const sql = 'SELECT * FROM responsaveis WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Responsável não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Responsável encontrado',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar responsável',
                dados: error.message
            });
        }
    },

    async criar(req, res) {
        try {
            const { fazenda_id, nome, telefone, cargo, principal } = req.body;
            const sql = `
                INSERT INTO responsaveis (fazenda_id, nome, telefone, cargo, principal)
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            const result = await db.query(sql, [
                fazenda_id,
                nome,
                telefone,
                cargo,
                principal !== undefined ? principal : false
            ]);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Responsável criado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar responsável',
                dados: error.message
            });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { fazenda_id, nome, telefone, cargo, principal } = req.body;
            const sql = `
                UPDATE responsaveis
                SET fazenda_id = $1, nome = $2, telefone = $3, cargo = $4,
                    principal = $5, atualizado_em = CURRENT_TIMESTAMP
                WHERE id = $6 RETURNING *
            `;
            const result = await db.query(sql, [fazenda_id, nome, telefone, cargo, principal, id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Responsável não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Responsável atualizado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar responsável',
                dados: error.message
            });
        }
    },

    async remover(req, res) {
        try {
            const { id } = req.params;
            const sql = 'DELETE FROM responsaveis WHERE id = $1 RETURNING *';
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Responsável não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Responsável removido com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao remover responsável',
                dados: error.message
            });
        }
    }
};
