-- src/lib/schema.sql
-- Tabela principal de veículos
CREATE TABLE IF NOT EXISTS veiculos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  placa TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('particular', 'seguradora')),
  modelo TEXT NOT NULL,
  ano TEXT NOT NULL,
  cor TEXT NOT NULL,
  cliente TEXT NOT NULL,
  sinistro TEXT,
  data_entrada DATE NOT NULL,
  previsao_entrega DATE,
  tinta_acertada BOOLEAN DEFAULT FALSE,
  em_pintura BOOLEAN DEFAULT FALSE,
  pintura_finalizada BOOLEAN DEFAULT FALSE,
  pecas_disponiveis BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON veiculos(placa);
CREATE INDEX IF NOT EXISTS idx_veiculos_tipo ON veiculos(tipo);
CREATE INDEX IF NOT EXISTS idx_veiculos_data_entrada ON veiculos(data_entrada);
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(tinta_acertada, em_pintura, pintura_finalizada, pecas_disponiveis);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS update_veiculos_timestamp 
AFTER UPDATE ON veiculos
FOR EACH ROW
BEGIN
  UPDATE veiculos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Dados de exemplo (opcional)
-- INSERT OR IGNORE INTO veiculos (
--   placa, tipo, modelo, ano, cor, cliente, sinistro,
--   data_entrada, previsao_entrega, tinta_acertada, em_pintura,
--   pintura_finalizada, pecas_disponiveis, observacoes
-- ) VALUES 
-- ('ABC-1234', 'seguradora', 'Honda Civic', '2020', 'Preto', 'Porto Seguro', '12345',
--  '2024-01-15', '2024-01-22', true, true, false, false, 'Cliente solicitou urgência'),
-- ('DEF-5678', 'particular', 'Toyota Corolla', '2021', 'Prata', 'João Silva', null,
--  '2024-01-12', '2024-01-19', true, false, true, true, 'Pagamento 50% entrada'),
-- ('GHI-9012', 'seguradora', 'Jeep Compass', '2022', 'Branco', 'Bradesco Seguros', '78901',
--  '2024-01-10', '2024-01-25', false, false, false, false, 'Aguardando aprovação seguradora');