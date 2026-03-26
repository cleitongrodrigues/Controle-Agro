-- =====================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - CONTROLE AGRO
-- PostgreSQL
-- =====================================================

-- Criar EXTENSION para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TIPOS ENUM
-- =====================================================

-- Status das fazendas
CREATE TYPE status_fazenda AS ENUM ('visitado', 'pendente', 'urgente');

-- Categoria de produtos
CREATE TYPE categoria_produto AS ENUM ('herbicida', 'semente', 'fertilizante', 'fungicida', 'outro');

-- Tipo de desconto
CREATE TYPE tipo_desconto AS ENUM ('percentual', 'valor');

-- Status de clientes
CREATE TYPE status_cliente AS ENUM ('ativo', 'sem-compra', 'pendente');

-- Nível de acesso de usuários
CREATE TYPE nivel_usuario AS ENUM ('admin', 'supervisor', 'vendedor');

-- =====================================================
-- TABELA: usuarios
-- =====================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cargo VARCHAR(100),
    nivel nivel_usuario NOT NULL DEFAULT 'vendedor',
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_usuarios_nivel ON usuarios(nivel);

-- =====================================================
-- TABELA: fazendas
-- =====================================================

CREATE TABLE fazendas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    proprietario VARCHAR(255) NOT NULL,
    hectares DECIMAL(10, 2) NOT NULL CHECK (hectares >= 0),
    localizacao TEXT NOT NULL,
    telefone VARCHAR(20),
    status status_fazenda NOT NULL DEFAULT 'pendente',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_fazendas_nome ON fazendas(nome);
CREATE INDEX idx_fazendas_status ON fazendas(status);
CREATE INDEX idx_fazendas_localizacao ON fazendas USING gin(to_tsvector('portuguese', localizacao));

-- =====================================================
-- TABELA: produtos
-- =====================================================

CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL UNIQUE,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    categoria categoria_produto NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);

-- =====================================================
-- TABELA: vendas
-- =====================================================

CREATE TABLE vendas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    fazenda_nome VARCHAR(255) NOT NULL,
    produto VARCHAR(255) NOT NULL,
    quantidade DECIMAL(10, 3) NOT NULL CHECK (quantidade > 0),
    valor_unitario DECIMAL(10, 2) NOT NULL CHECK (valor_unitario >= 0),
    valor_total DECIMAL(10, 2) NOT NULL CHECK (valor_total >= 0),
    desconto DECIMAL(10, 2) CHECK (desconto >= 0),
    desconto_tipo tipo_desconto,
    valor_com_desconto DECIMAL(10, 2) CHECK (valor_com_desconto >= 0),
    categoria categoria_produto,
    data DATE NOT NULL,
    sincronizado BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_vendas_fazenda_id ON vendas(fazenda_id);
CREATE INDEX idx_vendas_data ON vendas(data DESC);
CREATE INDEX idx_vendas_sincronizado ON vendas(sincronizado);
CREATE INDEX idx_vendas_categoria ON vendas(categoria);
CREATE INDEX idx_vendas_produto ON vendas(produto);

-- =====================================================
-- TABELA: metas
-- =====================================================

CREATE TABLE metas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    valor_meta DECIMAL(10, 2) NOT NULL CHECK (valor_meta > 0),
    categoria VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_metas_ativo ON metas(ativo);
CREATE INDEX idx_metas_categoria ON metas(categoria);

-- =====================================================
-- TABELA: clientes
-- =====================================================

CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iniciais VARCHAR(10) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    detalhe TEXT,
    status status_cliente NOT NULL DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_status ON clientes(status);

-- =====================================================
-- TABELA: historico_vendas_fazenda
-- =====================================================

CREATE TABLE historico_vendas_fazenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    produto VARCHAR(255) NOT NULL,
    valor VARCHAR(50) NOT NULL,
    nota TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_historico_fazenda_id ON historico_vendas_fazenda(fazenda_id);
CREATE INDEX idx_historico_data ON historico_vendas_fazenda(data DESC);

-- =====================================================
-- COMENTÁRIOS NAS TABELAS E COLUNAS
-- =====================================================

COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON TABLE fazendas IS 'Tabela de fazendas cadastradas';
COMMENT ON TABLE produtos IS 'Tabela de produtos disponíveis para venda';
COMMENT ON TABLE vendas IS 'Tabela de vendas realizadas';
COMMENT ON TABLE metas IS 'Tabela de metas de vendas';
COMMENT ON TABLE clientes IS 'Tabela de clientes (não ativamente usado no frontend ainda)';
COMMENT ON TABLE historico_vendas_fazenda IS 'Histórico de vendas por fazenda';

COMMENT ON COLUMN vendas.fazenda_nome IS 'Nome da fazenda denormalizado para performance';
COMMENT ON COLUMN vendas.sincronizado IS 'Flag indicando se a venda foi sincronizada com o sistema offline';
COMMENT ON COLUMN vendas.categoria IS 'Categoria do produto vendido (adicionado baseado no uso no frontend)';

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir usuário administrador padrão (senha: admin123 - ALTERE EM PRODUÇÃO!)
-- INSERT INTO usuarios (nome, email, senha, cargo) 
-- VALUES ('Administrador', 'admin@controleagro.com', 'HASH_DA_SENHA_AQUI', 'Administrador');

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
