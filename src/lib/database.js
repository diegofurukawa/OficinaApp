// src/lib/database.js - Versão Turso
import { createClient } from '@libsql/client';

let db = null;

export function getDatabase() {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    // Inicializar tabelas
    initializeDatabase();
  }
  
  return db;
}

async function initializeDatabase() {
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
  
  await db.executeMultiple(createTableQuery + '; ' + createIndexQuery);
}

// Statements adaptados para Turso
export function getStatements() {
  const database = getDatabase();
  
  return {
    // CRUD básico
    insertVeiculo: {
      run: async (...params) => {
        const result = await database.execute({
          sql: `INSERT INTO veiculos (
            placa, tipo, modelo, ano, cor, cliente, sinistro,
            data_entrada, previsao_entrega, tinta_acertada, em_pintura,
            pintura_finalizada, pecas_disponiveis, observacoes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: params
        });
        return result;
      }
    },
    
    selectAllVeiculos: {
      all: async () => {
        const result = await database.execute('SELECT * FROM veiculos ORDER BY data_entrada DESC');
        return result.rows;
      }
    },
    
    selectVeiculoByPlaca: {
      get: async (placa) => {
        const result = await database.execute({
          sql: 'SELECT * FROM veiculos WHERE placa = ?',
          args: [placa]
        });
        return result.rows[0] || null;
      }
    },
    
    updateVeiculo: {
      run: async (...params) => {
        const result = await database.execute({
          sql: `UPDATE veiculos SET
            tipo = ?, modelo = ?, ano = ?, cor = ?, cliente = ?, sinistro = ?,
            previsao_entrega = ?, tinta_acertada = ?, em_pintura = ?,
            pintura_finalizada = ?, pecas_disponiveis = ?, observacoes = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE placa = ?`,
          args: params
        });
        return { changes: result.rowsAffected };
      }
    },
    
    deleteVeiculo: {
      run: async (placa) => {
        const result = await database.execute({
          sql: 'DELETE FROM veiculos WHERE placa = ?',
          args: [placa]
        });
        return { changes: result.rowsAffected };
      }
    },
    
    // Estatísticas
    getStats: {
      get: async () => {
        const result = await database.execute(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN NOT pecas_disponiveis THEN 1 ELSE 0 END) as aguardando_pecas,
            SUM(CASE WHEN em_pintura AND NOT pintura_finalizada THEN 1 ELSE 0 END) as em_pintura,
            SUM(CASE WHEN pintura_finalizada AND pecas_disponiveis THEN 1 ELSE 0 END) as finalizados
          FROM veiculos
        `);
        return result.rows[0];
      }
    },
    
    getFinalizadosMes: {
      get: async () => {
        const result = await database.execute(`
          SELECT COUNT(*) as finalizados_mes
          FROM veiculos 
          WHERE pintura_finalizada = TRUE 
          AND pecas_disponiveis = TRUE
          AND data_entrada >= date('now', 'start of month')
        `);
        return result.rows[0];
      }
    },
    
    // Filtros expandidos
    searchVeiculos: {
      all: async (...params) => {
        const result = await database.execute({
          sql: `SELECT * FROM veiculos 
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
          ORDER BY data_entrada DESC`,
          args: params
        });
        return result.rows;
      }
    }
  };
}