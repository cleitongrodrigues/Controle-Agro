-- Migration 008: Renomeia coluna proprietario para responsavel na tabela fazendas
-- e remove a tabela responsaveis (não mais utilizada)

ALTER TABLE fazendas RENAME COLUMN proprietario TO responsavel;

DROP TABLE IF EXISTS responsaveis CASCADE;
