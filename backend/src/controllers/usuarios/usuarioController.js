const db = require('../../database/connection.js');

module.exports = {
    async ListarUsuarios(req, res) {
        try {
            const sql = 'SELECT * FROM usuarios';
            const usuarios = await db.query(sql);
            const nItens = usuarios[0].length;

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuários listados com sucesso',
                dados: usuarios[0],
                nItens
            });
        } catch {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar usuários',
                dados: error.message                
            });
        }
    }
};