const db = require('../../database/connection.js');

module.exports = {
    async obterTodos(req, res) {
        try {
            const sql = 'SELECT * FROM produtos';
            const result = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Produtos listados com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar produtos',
                dados: error.message                
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const sql = 'SELECT * FROM produtos WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Produto não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Produto encontrado',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar produto',
                dados: error.message                
            });
        }
    },

    async criar(req, res) {
        try {
            const { nome, preco, categoria, ativo } = req.body;
            const sql = 'INSERT INTO produtos (nome, preco, categoria, ativo) VALUES ($1, $2, $3, $4) RETURNING *';
            const result = await db.query(sql, [nome, preco, categoria, ativo !== undefined ? ativo : true]);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Produto criado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar produto',
                dados: error.message
            });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, preco, categoria, ativo } = req.body;
            const sql = 'UPDATE produtos SET nome = $1, preco = $2, categoria = $3, ativo = $4, atualizado_em = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *';
            const result = await db.query(sql, [nome, preco, categoria, ativo, id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Produto não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Produto atualizado com sucesso',
                dados: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar produto',
                dados: error.message
            });
        }
    },

    async remover(req, res) {
        try {
            const { id } = req.params;
            const sql = 'DELETE FROM produtos WHERE id = $1';
            const result = await db.query(sql, [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Produto não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Produto removido com sucesso'
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao remover produto',
                dados: error.message
            });
        }
    }
};