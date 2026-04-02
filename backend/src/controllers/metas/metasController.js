const db = require('../../database/connection.js');

module.exports = {
    async listarTodos(req, res) {
        try {
            const sql = 'SELECT * FROM metas';
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Metas listadas com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar metas',
                dados: error.message
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const sql = 'SELECT * FROM metas WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Meta não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Meta encontrada',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar meta',
                dados: error.message
            });
        }
    },

    async criarMeta(req, res){
        try {
            const { nome, valor_meta, categoria, ativo, tipo_filtro, produto_id, produto_nome, data_inicio, data_fim } = req.body;
            const sql = `INSERT INTO metas (nome, valor_meta, categoria, ativo, tipo_filtro, produto_id, produto_nome, data_inicio, data_fim)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
            const result = await db.query(sql, [
                nome, valor_meta, categoria ?? null, ativo !== undefined ? ativo : true,
                tipo_filtro ?? 'geral', produto_id ?? null, produto_nome ?? null,
                data_inicio ?? null, data_fim ?? null
            ]);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Meta criada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar meta',
                dados: error.message
            });
        }
    },

    async atualizarMeta(req, res) {
        try {
            const { id } = req.params;
            const { nome, valor_meta, categoria, ativo, tipo_filtro, produto_id, produto_nome, data_inicio, data_fim } = req.body;
            const sql = `UPDATE metas SET nome = $1, valor_meta = $2, categoria = $3, ativo = $4,
                         tipo_filtro = $5, produto_id = $6, produto_nome = $7,
                         data_inicio = $8, data_fim = $9, atualizado_em = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *`;
            const result = await db.query(sql, [
                nome, valor_meta, categoria ?? null, ativo,
                tipo_filtro ?? 'geral', produto_id ?? null, produto_nome ?? null,
                data_inicio ?? null, data_fim ?? null, id
            ]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Meta não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Meta atualizada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar meta',
                dados: error.message
            });
        }
    },

    async deletarMeta(req, res){
        try {
            const { id } = req.params;
            const sql = 'DELETE FROM metas WHERE id = $1 RETURNING *';
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Meta não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Meta deletada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao deletar meta',
                dados: error.message
            });
        }
    }
};