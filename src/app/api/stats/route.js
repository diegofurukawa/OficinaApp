// src/app/api/stats/route.js
import { getStatements } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET - Buscar estatísticas do dashboard
export async function GET() {
  try {
    const statements = getStatements();
    
    // Buscar estatísticas principais
    const stats = statements.getStats.get();
    
    // Buscar finalizados do mês
    const finalizadosMes = statements.getFinalizadosMes.get();
    
    const result = {
      total: stats.total || 0,
      aguardandoPecas: stats.aguardando_pecas || 0,
      emPintura: stats.em_pintura || 0,
      finalizados: stats.finalizados || 0,
      finalizadosMes: finalizadosMes.finalizados_mes || 0
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}