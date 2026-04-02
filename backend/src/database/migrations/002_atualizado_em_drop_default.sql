-- Migration 002: Remove DEFAULT CURRENT_TIMESTAMP de atualizado_em em todas as tabelas
-- atualizado_em deve ser NULL ao criar, e só receber valor ao atualizar

ALTER TABLE usuarios    ALTER COLUMN atualizado_em DROP DEFAULT;
ALTER TABLE fazendas    ALTER COLUMN atualizado_em DROP DEFAULT;
ALTER TABLE produtos    ALTER COLUMN atualizado_em DROP DEFAULT;
ALTER TABLE responsaveis ALTER COLUMN atualizado_em DROP DEFAULT;
ALTER TABLE vendas      ALTER COLUMN atualizado_em DROP DEFAULT;
ALTER TABLE metas       ALTER COLUMN atualizado_em DROP DEFAULT;

-- Opcional: zerar registros existentes (remova o comentário se quiser resetar)
-- UPDATE usuarios     SET atualizado_em = NULL;
-- UPDATE fazendas     SET atualizado_em = NULL;
-- UPDATE produtos     SET atualizado_em = NULL;
-- UPDATE responsaveis SET atualizado_em = NULL;
-- UPDATE vendas       SET atualizado_em = NULL;
-- UPDATE metas        SET atualizado_em = NULL;
