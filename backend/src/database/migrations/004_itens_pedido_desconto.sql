-- =====================================================
-- Migration 004: Adicionar campos de desconto em itens_pedido
-- Executar no Neon: https://console.neon.tech
-- =====================================================

ALTER TABLE itens_pedido
  ADD COLUMN desconto DECIMAL(10, 2) CHECK (desconto >= 0),
  ADD COLUMN desconto_tipo tipo_desconto,
  ADD COLUMN valor_com_desconto DECIMAL(10, 2) CHECK (valor_com_desconto >= 0);
