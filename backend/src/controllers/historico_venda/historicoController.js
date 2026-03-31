const db = require('../../database/connection.js');

module.exports = {
    async listarHistorico(req, res){
        try {
            const sql = 'SELECT * FROM historico_venda';
            const result = await db.query(sql);
            
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Histórico de vendas listado com sucesso',
                dados: result.rows,
                nItens: result.rowCount
            });
        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar histórico de vendas',
                erro: error.message
            });
        }
    }
};