const db = require('../../database/connection.js');

module.exports = {
    async ListasTodas(req, res) {
        try {
            const sql = `SELECT * FROM fazendas`;
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Fazendas listadas com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar fazendas',
                dados: error.message                
            });
        }
    },

    async ListarPorId(req, res){
        try {
            const { id } = req.params;
            const sql = `SELECT * FROM fazendas WHERE id = $1`;
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Fazenda não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Fazenda encontrada',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar fazenda',
                dados: error.message
            });
        }
    },

    async CriarFazenda(req, res) {
        try {
            const { nome, responsavel, hectares, localizacao, telefone,
                    status, latitude, longitude } = req.body;
            const sql = `INSERT INTO fazendas (nome, responsavel, hectares, localizacao, telefone,
                                               status, latitude, longitude)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

            const result = await db.query(sql, [nome, responsavel, hectares, localizacao, telefone,
                                          status, latitude, longitude]);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Fazenda criada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar fazenda',
                dados: error.message
            });
        }
    },

    async AtualizarFazenda(req, res) {
        try {
            const { id } = req.params;
            const { nome, responsavel, hectares, localizacao, telefone,
                    status, latitude, longitude } = req.body;
            const sql = `UPDATE fazendas SET nome = $1, responsavel = $2, hectares = $3, localizacao = $4,
                        telefone = $5, status = $6, latitude = $7, longitude = $8, atualizado_em = CURRENT_TIMESTAMP
                        WHERE id = $9 RETURNING *`;

            const result = await db.query(sql, [nome, responsavel, hectares, localizacao, telefone,
                                          status, latitude, longitude, id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Fazenda não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Fazenda atualizada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar fazenda',
                dados: error.message
            });
        }
    },

    async RemoverFazenda(req, res) {
        try {
            const { id } = req.params;
            const sql = `DELETE FROM fazendas WHERE id = $1`;
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Fazenda não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Fazenda removida com sucesso'
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao remover fazenda',
                dados: error.message
            });
        }
    }
};