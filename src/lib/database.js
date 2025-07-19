// src/lib/database.js
import Database from 'better-sqlite3';
import path from 'path';

let db = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'oficina.db');
    db = new Database(dbPath);
    
    // Configurações para performance
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    
    // Inicializar tabelas
    initializeDatabase();
  }
  
  return db;
}

function initializeDatabase() {
  const createTableQuery = `
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
    )
  `;
  
  const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON veiculos(placa);
    CREATE INDEX IF NOT EXISTS idx_veiculos_tipo ON veiculos(tipo);
    CREATE INDEX IF NOT EXISTS idx_veiculos_data_entrada ON veiculos(data_entrada);
    CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(tinta_acertada, em_pintura, pintura_finalizada, pecas_disponiveis);
  `;
  
  db.exec(createTableQuery);
  db.exec(createIndexQuery);
}

// Preparar statements para performance
export function getStatements() {
  const db = getDatabase();
  
  return {
    // CRUD básico
    insertVeiculo: db.prepare(`
      INSERT INTO veiculos (
        placa, tipo, modelo, ano, cor, cliente, sinistro,
        data_entrada, previsao_entrega, tinta_acertada, em_pintura,
        pintura_finalizada, pecas_disponiveis, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    selectAllVeiculos: db.prepare(`
      SELECT * FROM veiculos ORDER BY data_entrada DESC
    `),
    
    selectVeiculoByPlaca: db.prepare(`
      SELECT * FROM veiculos WHERE placa = ?
    `),
    
    updateVeiculo: db.prepare(`
      UPDATE veiculos SET
        tipo = ?, modelo = ?, ano = ?, cor = ?, cliente = ?, sinistro = ?,
        previsao_entrega = ?, tinta_acertada = ?, em_pintura = ?,
        pintura_finalizada = ?, pecas_disponiveis = ?, observacoes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE placa = ?
    `),
    
    deleteVeiculo: db.prepare(`
      DELETE FROM veiculos WHERE placa = ?
    `),
    
    // Estatísticas
    getStats: db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN NOT pecas_disponiveis THEN 1 ELSE 0 END) as aguardando_pecas,
        SUM(CASE WHEN em_pintura AND NOT pintura_finalizada THEN 1 ELSE 0 END) as em_pintura,
        SUM(CASE WHEN pintura_finalizada AND pecas_disponiveis THEN 1 ELSE 0 END) as finalizados
      FROM veiculos
    `),
    
    getFinalizadosMes: db.prepare(`
      SELECT COUNT(*) as finalizados_mes
      FROM veiculos 
      WHERE pintura_finalizada = TRUE 
      AND pecas_disponiveis = TRUE
      AND data_entrada >= date('now', 'start of month')
    `),
    
    // Filtros expandidos
    searchVeiculos: db.prepare(`
      SELECT * FROM veiculos 
      WHERE (
        ? = '' OR 
        placa LIKE ? OR 
        cliente LIKE ? OR 
        modelo LIKE ? OR 
        (sinistro IS NOT NULL AND sinistro LIKE ?)
      )
      AND (? = '' OR tipo = ?)
      AND (
        ? = '' OR
        (? = 'aguardando_tinta' AND tinta_acertada = FALSE) OR
        (? = 'aguardando_pecas' AND pecas_disponiveis = FALSE) OR
        (? = 'em_pintura' AND em_pintura = TRUE AND pintura_finalizada = FALSE) OR
        (? = 'finalizado' AND pintura_finalizada = TRUE AND pecas_disponiveis = TRUE)
      )
      ORDER BY data_entrada DESC
    `)
  };
}