-- =====================================================
-- Migration 006: Remover tabela vendas
-- A tabela vendas foi substituída por pedidos + itens_pedido
-- Executar no Neon: https://console.neon.tech
-- =====================================================

DROP TABLE IF EXISTS vendas CASCADE;
