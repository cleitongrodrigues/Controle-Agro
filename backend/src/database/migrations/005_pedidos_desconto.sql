-- =====================================================
-- Migration 005: Adicionar desconto geral em pedidos
-- Executar no Neon: https://console.neon.tech
-- =====================================================

ALTER TABLE pedidos
  ADD COLUMN desconto DECIMAL(10, 2) CHECK (desconto >= 0),
  ADD COLUMN desconto_tipo tipo_desconto,
  ADD COLUMN valor_final DECIMAL(10, 2) CHECK (valor_final >= 0);
