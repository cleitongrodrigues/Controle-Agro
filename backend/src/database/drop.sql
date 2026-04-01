-- =====================================================
-- DROP DE TODAS AS TABELAS (ordem respeita as FKs)
-- =====================================================

DROP TABLE IF EXISTS historico_vendas_fazenda CASCADE;
DROP TABLE IF EXISTS vendas CASCADE;
DROP TABLE IF EXISTS metas CASCADE;
DROP TABLE IF EXISTS responsaveis CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS fazendas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =====================================================
-- DROP DOS TIPOS ENUM
-- =====================================================

DROP TYPE IF EXISTS status_fazenda CASCADE;
DROP TYPE IF EXISTS categoria_produto CASCADE;
DROP TYPE IF EXISTS tipo_desconto CASCADE;
DROP TYPE IF EXISTS nivel_usuario CASCADE;
