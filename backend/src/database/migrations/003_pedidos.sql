-- =====================================================
-- Migration 003: Criar tabelas de pedidos com múltiplos itens
-- Executar no Neon: https://console.neon.tech
-- =====================================================

-- Tabela principal do pedido (cabeçalho)
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    fazenda_nome VARCHAR(80) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL CHECK (valor_total >= 0),
    data DATE NOT NULL,
    sincronizado BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pedidos_fazenda_id ON pedidos(fazenda_id);
CREATE INDEX idx_pedidos_data ON pedidos(data DESC);
CREATE INDEX idx_pedidos_sincronizado ON pedidos(sincronizado);

-- Tabela de itens do pedido (linha por produto)
CREATE TABLE itens_pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
    produto VARCHAR(80) NOT NULL,
    categoria categoria_produto,
    quantidade DECIMAL(10, 3) NOT NULL CHECK (quantidade > 0),
    valor_unitario DECIMAL(10, 2) NOT NULL CHECK (valor_unitario >= 0),
    valor_total DECIMAL(10, 2) NOT NULL CHECK (valor_total >= 0)
);

CREATE INDEX idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
