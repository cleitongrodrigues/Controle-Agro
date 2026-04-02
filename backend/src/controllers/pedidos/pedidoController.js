const db = require('../../database/connection.js');

module.exports = {
    async listarTodos(req, res) {
        try {
            const pedidosResult = await db.query(
                'SELECT * FROM pedidos ORDER BY data DESC, criado_em DESC'
            );

            if (pedidosResult.rows.length === 0) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Pedidos listados com sucesso',
                    dados: [],
                    nItens: 0
                });
            }

            const ids = pedidosResult.rows.map(p => p.id);
            const itensResult = await db.query(
                'SELECT * FROM itens_pedido WHERE pedido_id = ANY($1) ORDER BY pedido_id, id',
                [ids]
            );

            const dados = pedidosResult.rows.map(pedido => ({
                ...pedido,
                itens: itensResult.rows.filter(item => item.pedido_id === pedido.id)
            }));

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Pedidos listados com sucesso',
                dados,
                nItens: pedidosResult.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar pedidos',
                dados: error.message
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const pedidoResult = await db.query(
                'SELECT * FROM pedidos WHERE id = $1', [id]
            );

            if (pedidoResult.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Pedido não encontrado'
                });
            }

            const itensResult = await db.query(
                'SELECT * FROM itens_pedido WHERE pedido_id = $1 ORDER BY id', [id]
            );

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Pedido encontrado',
                dados: { ...pedidoResult.rows[0], itens: itensResult.rows }
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar pedido',
                dados: error.message
            });
        }
    },

    async criarPedido(req, res) {
        const client = await db.connect();
        try {
            const { fazenda_id, fazenda_nome, valor_total, desconto, desconto_tipo, valor_final, data, itens } = req.body;

            await client.query('BEGIN');

            const pedidoResult = await client.query(
                `INSERT INTO pedidos (fazenda_id, fazenda_nome, valor_total, desconto, desconto_tipo, valor_final, data)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [fazenda_id, fazenda_nome, valor_total, desconto ?? null, desconto_tipo ?? null, valor_final ?? null, data]
            );
            const pedido = pedidoResult.rows[0];

            const itensInseridos = [];
            for (const item of itens) {
                const itemResult = await client.query(
                    `INSERT INTO itens_pedido (pedido_id, produto_id, produto, categoria, quantidade, valor_unitario, valor_total, desconto, desconto_tipo, valor_com_desconto)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                    [pedido.id, item.produto_id, item.produto, item.categoria,
                     item.quantidade, item.valor_unitario, item.valor_total,
                     item.desconto ?? null, item.desconto_tipo ?? null, item.valor_com_desconto ?? null]
                );
                itensInseridos.push(itemResult.rows[0]);
            }

            await client.query('COMMIT');

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Pedido criado com sucesso',
                dados: { ...pedido, itens: itensInseridos }
            });
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar pedido',
                dados: error.message
            });
        } finally {
            client.release();
        }
    },

    async atualizarPedido(req, res) {
        const client = await db.connect();
        try {
            const { id } = req.params;
            const { fazenda_id, fazenda_nome, valor_total, desconto, desconto_tipo, valor_final, data, itens } = req.body;

            await client.query('BEGIN');

            const pedidoResult = await client.query(
                `UPDATE pedidos SET fazenda_id = $1, fazenda_nome = $2, valor_total = $3, desconto = $4, desconto_tipo = $5, valor_final = $6, data = $7
                 WHERE id = $8 RETURNING *`,
                [fazenda_id, fazenda_nome, valor_total, desconto ?? null, desconto_tipo ?? null, valor_final ?? null, data, id]
            );

            if (pedidoResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Pedido não encontrado'
                });
            }

            await client.query('DELETE FROM itens_pedido WHERE pedido_id = $1', [id]);

            const itensInseridos = [];
            for (const item of itens) {
                const itemResult = await client.query(
                    `INSERT INTO itens_pedido (pedido_id, produto_id, produto, categoria, quantidade, valor_unitario, valor_total, desconto, desconto_tipo, valor_com_desconto)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                    [id, item.produto_id, item.produto, item.categoria,
                     item.quantidade, item.valor_unitario, item.valor_total,
                     item.desconto ?? null, item.desconto_tipo ?? null, item.valor_com_desconto ?? null]
                );
                itensInseridos.push(itemResult.rows[0]);
            }

            await client.query('COMMIT');

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Pedido atualizado com sucesso',
                dados: { ...pedidoResult.rows[0], itens: itensInseridos }
            });
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar pedido',
                dados: error.message
            });
        } finally {
            client.release();
        }
    },

    async deletarPedido(req, res) {
        try {
            const { id } = req.params;
            const result = await db.query('DELETE FROM pedidos WHERE id = $1', [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Pedido não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Pedido deletado com sucesso'
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao deletar pedido',
                dados: error.message
            });
        }
    }
};
