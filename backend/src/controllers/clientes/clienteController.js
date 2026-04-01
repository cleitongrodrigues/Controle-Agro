const db = require('../../database/connection.js');

module.exports = {
    async listarTodos(req, res){
        try {
            const sql = 'SELECT * FROM clientes';
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Clientes listados com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar clientes',
                dados: error.message
            });
        }
    },

    async buscarPorId(req, res){
        try {
            const { id } = req.params;
            const sql = 'SELECT * FROM clientes WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Cliente não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Cliente encontrado',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar cliente',
                dados: error.message
            });
        }
    },

    async criarCliente(req, res){
        try{
            const { iniciais, nome, detalhe, status, criado_em, atualizado_em } = req.body;
            const sql = `INSERT INTO clientes (iniciais, nome, detalhe, status, criado_em, atualizado_em)
                         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const result = await db.query(sql, [iniciais, nome, detalhe, status || 'ativo', criado_em || new Date(), atualizado_em || new Date()]);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Cliente criado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar cliente',
                dados: error.message
            });
        }
    },

    async atualizarCliente(req, res){
        try{
            const { id } = req.params;
            const { iniciais, nome, detalhe, status, atualizado_em } = req.body;
            const sql = `UPDATE clientes SET iniciais = $1, nome = $2, detalhe = $3, status = $4, atualizado_em = $5
                         WHERE id = $6 RETURNING *`;
            const result = await db.query(sql, [iniciais, nome, detalhe, status, atualizado_em || new Date(), id]);

            if (result.rowCount === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Cliente não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Cliente atualizado com sucesso',
                dados: result.rows[0]
            });
        } catch (error){
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar cliente',
                dados: error.message
            });
        }
    },

    async deletarCliente(req, res){
        try {
            const { id } = req.params;
            const sql = 'DELETE FROM clientes WHERE id = $1 RETURNING *';
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0){
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Cliente não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Cliente deletado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao deletar cliente',
                dados: error.message
            });
        }
    }
};