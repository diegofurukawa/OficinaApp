// src/app/api/veiculos/route.js - Versão com Filtro Inteligente
import { getStatements } from '@/lib/database';
import { NextResponse } from 'next/server';

// GET - Listar veículos com filtro inteligente
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tipo = searchParams.get('tipo') || '';
    const status = searchParams.get('status') || '';
    const incluirFinalizados = searchParams.get('incluirFinalizados') === 'true';
    
    const statements = getStatements();
    
    let veiculos;
    
    // Se não há filtros E não quer incluir finalizados, usar query otimizada
    if (!search && !tipo && !status && !incluirFinalizados) {
      veiculos = await statements.selectVeiculosAtivos.all();
    } else {
      // Usar busca completa com filtros
      const searchTerm = `%${search}%`;
      veiculos = await statements.searchVeiculos.all(
        search,     // Parâmetro 1: check se search é vazio
        searchTerm, // Parâmetro 2: busca em placa
        searchTerm, // Parâmetro 3: busca em cliente  
        searchTerm, // Parâmetro 4: busca em modelo
        searchTerm, // Parâmetro 5: busca em sinistro
        tipo,       // Parâmetro 6: check se tipo é vazio
        tipo,       // Parâmetro 7: filtro tipo
        status,     // Parâmetro 8: check se status é vazio
        status,     // Parâmetro 9: aguardando_tinta
        status,     // Parâmetro 10: aguardando_pecas
        status,     // Parâmetro 11: em_pintura
        status,     // Parâmetro 12: finalizado
        incluirFinalizados // Parâmetro 13: incluir finalizados
      );
    }
    
    // Transformar dados para frontend
    const veiculosFormatados = veiculos.map(veiculo => ({
      ...veiculo,
      tinta_acertada: Boolean(veiculo.tinta_acertada),
      em_pintura: Boolean(veiculo.em_pintura),
      pintura_finalizada: Boolean(veiculo.pintura_finalizada),
      pecas_disponiveis: Boolean(veiculo.pecas_disponiveis)
    }));
    
    return NextResponse.json(veiculosFormatados);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo veículo
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validação básica
    const requiredFields = ['placa', 'tipo', 'modelo', 'ano', 'cor', 'cliente', 'data_entrada'];
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
    
    const statements = getStatements();
    
    // Verificar se placa já existe
    const placaLower = data.placa?.toLowerCase() || '';
    const existing = await statements.selectVeiculoByPlaca.get(placaLower);
    if (existing) {
      return NextResponse.json(
        { error: 'Placa já cadastrada' },
        { status: 409 }
      );
    }
    
    // Converter campos para lowercase
    const modeloLower = data.modelo?.toLowerCase() || '';
    const corLower = data.cor?.toLowerCase() || '';
    const clienteLower = data.cliente?.toLowerCase() || '';
    const observacoesLower = data.observacoes?.toLowerCase() || '';
    
    // Inserir veículo com campos corretos
    await statements.insertVeiculo.run(
      placaLower,
      data.tipo,
      modeloLower,
      data.ano,
      corLower,
      clienteLower,
      data.sinistro || null,
      data.data_entrada,
      data.previsao_entrega || null,
      data.tinta_acertada ? 1 : 0,
      data.em_pintura ? 1 : 0,
      data.pintura_finalizada ? 1 : 0,
      data.pecas_disponiveis ? 1 : 0,
      observacoesLower || null
    );
    
    // Buscar veículo criado
    const novoVeiculo = await statements.selectVeiculoByPlaca.get(placaLower);
    
    return NextResponse.json(novoVeiculo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Placa já cadastrada' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}