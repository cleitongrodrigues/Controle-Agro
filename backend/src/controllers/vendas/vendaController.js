const db = require('../../database/connection.js');

module.exports = {
    async ListarTodos(req, res){
        try {
            const sql = 'SELECT * FROM vendas';
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Vendas listadas com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar vendas',
                dados: error.message
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const sql = 'SELECT * FROM vendas WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Venda não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Venda encontrada',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar venda',
                dados: error.message
            });
        }
    },

    async criarVenda(req, res){
        try {
            const { fazenda_id, fazenda_nome, produto, quantidade, valor_unitario,
                    valor_total, desconto, desconto_tipo, valor_com_desconto, categoria, data,
                    sincronizado, criado_em, atualizado_em } = req.body;
            const sql = `INSERT INTO vendas (fazenda_id, fazenda_nome, produto, quantidade, valor_unitario,
                         valor_total, desconto, desconto_tipo, valor_com_desconto, categoria, data,
                         sincronizado, criado_em, atualizado_em)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
            
            const result = await db.query(sql, [fazenda_id, fazenda_nome, produto, quantidade, valor_unitario,
                valor_total, desconto, desconto_tipo, valor_com_desconto, categoria, data,
                sincronizado, criado_em, atualizado_em]);
            
            return res.status(201).json({
                sucesso: true,
                mensagem: 'Venda criada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar venda',
                dados: error.message
            });
        }
    },

    async atualizarVenda(req, res){
        try {
            const { id } = req.params;
            const { fazenda_id, fazenda_nome, produto, quantidade, valor_unitario,
                    valor_total, desconto, desconto_tipo, valor_com_desconto, categoria, data,
                    sincronizado, atualizado_em } = req.body;

            const sql = `UPDATE vendas SET fazenda_id = $1, fazenda_nome = $2, produto = $3, quantidade = $4, valor_unitario = $5,
                         valor_total = $6, desconto = $7, desconto_tipo = $8, valor_com_desconto = $9, categoria = $10, data = $11,
                         sincronizado = $12, atualizado_em = CURRENT_TIMESTAMP WHERE id = $13 RETURNING *`;

            const result = await db.query(sql, [fazenda_id, fazenda_nome, produto, quantidade, valor_unitario,
                valor_total, desconto, desconto_tipo, valor_com_desconto, categoria, data,
                sincronizado, atualizado_em, id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Venda não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Venda atualizada com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar venda',
                dados: error.message
            });
        }
    },

    async deletarVenda(req, res){
        try {
            const { id } = req.params;
            const sql = 'DELETE FROM vendas WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Venda não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Venda deletada com sucesso'
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao deletar venda',
                dados: error.message
            });
        }
    }
};