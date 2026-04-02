-- Aumentar o tamanho da coluna senha para comportar o hash bcrypt (60 chars)
ALTER TABLE usuarios ALTER COLUMN senha TYPE VARCHAR(60);
