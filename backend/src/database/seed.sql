-- =====================================================
-- SEED: Usuário administrador inicial
-- Senha padrão: 86123545
-- =====================================================

INSERT INTO usuarios (nome, email, senha, telefone, cargo, nivel, ativo)
VALUES (
    'Cleiton',
    'cleitoungr66@gmail.com',
    '$2b$10$3ueE.nZV.d4Zbh40Y86Ft.SCSOAHFfBYRHZmQhtFHpYDxjZXkbFKG',
    '14998579399',
    'Administrador',
    'admin',
    true
);
