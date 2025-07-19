// src/app/api/veiculos/[placa]/route.js
import { getStatements } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET - Buscar veículo por placa
export async function GET(request, { params }) {
  try {
    const { placa } = await params;
    const statements = getStatements();
    
    // Buscar com placa em lowercase
    const veiculo = statements.selectVeiculoByPlaca.get(placa.toLowerCase());
    
    if (!veiculo) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }
    
    // Formatear dados para frontend
    const veiculoFormatado = {
      ...veiculo,
      tinta_acertada: Boolean(veiculo.tinta_acertada),
      em_pintura: Boolean(veiculo.em_pintura),
      pintura_finalizada: Boolean(veiculo.pintura_finalizada),
      pecas_disponiveis: Boolean(veiculo.pecas_disponiveis)
    };
    
    return NextResponse.json(veiculoFormatado);
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar veículo
export async function PUT(request, { params }) {
  try {
    const { placa } = await params;
    const data = await request.json();
    const statements = getStatements();
    
    const placaLower = placa.toLowerCase();
    
    // Verificar se veículo existe
    const existing = statements.selectVeiculoByPlaca.get(placaLower);
    if (!existing) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }
    
    // Validação básica
    const requiredFields = ['tipo', 'modelo', 'ano', 'cor', 'cliente'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Campo ${field} é obrigatório` },
          { status: 400 }
        );
      }
    }
    
    // Validar tipo
    if (!['particular', 'seguradora'].includes(data.tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser "particular" ou "seguradora"' },
        { status: 400 }
      );
    }
    
    // Converter campos para lowercase
    const modeloLower = data.modelo?.toLowerCase() || '';
    const corLower = data.cor?.toLowerCase() || '';
    const clienteLower = data.cliente?.toLowerCase() || '';
    const observacoesLower = data.observacoes?.toLowerCase() || '';
    
    // Atualizar veículo com campos corretos
    const result = statements.updateVeiculo.run(
      data.tipo,
      modeloLower,
      data.ano,
      corLower,
      clienteLower,
      data.sinistro || null,
      data.previsao_entrega || null,
      data.tinta_acertada ? 1 : 0,
      data.em_pintura ? 1 : 0,
      data.pintura_finalizada ? 1 : 0,
      data.pecas_disponiveis ? 1 : 0,
      observacoesLower || null,
      placaLower
    );
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Nenhuma alteração realizada' },
        { status: 400 }
      );
    }
    
    // Retornar veículo atualizado
    const veiculoAtualizado = statements.selectVeiculoByPlaca.get(placaLower);
    
    return NextResponse.json({
      ...veiculoAtualizado,
      tinta_acertada: Boolean(veiculoAtualizado.tinta_acertada),
      em_pintura: Boolean(veiculoAtualizado.em_pintura),
      pintura_finalizada: Boolean(veiculoAtualizado.pintura_finalizada),
      pecas_disponiveis: Boolean(veiculoAtualizado.pecas_disponiveis)
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Remover veículo
export async function DELETE(request, { params }) {
  try {
    const { placa } = await params;
    const statements = getStatements();
    
    const placaLower = placa.toLowerCase();
    
    // Verificar se veículo existe
    const existing = statements.selectVeiculoByPlaca.get(placaLower);
    if (!existing) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }
    
    // Deletar veículo
    const result = statements.deleteVeiculo.run(placaLower);
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Erro ao deletar veículo' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Veículo removido com sucesso',
      placa: placaLower
    });
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}