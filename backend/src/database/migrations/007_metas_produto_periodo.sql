-- =====================================================
-- Migration 007: Adicionar filtro por produto e período nas metas
-- Executar no Neon: https://console.neon.tech
-- =====================================================

-- Tipo de filtro da meta
CREATE TYPE tipo_filtro_meta AS ENUM ('geral', 'categoria', 'produto');

ALTER TABLE metas
  ADD COLUMN tipo_filtro tipo_filtro_meta NOT NULL DEFAULT 'geral',
  ADD COLUMN produto_id  UUID REFERENCES produtos(id) ON DELETE SET NULL,
  ADD COLUMN produto_nome VARCHAR(80),
  ADD COLUMN data_inicio DATE,
  ADD COLUMN data_fim    DATE;
