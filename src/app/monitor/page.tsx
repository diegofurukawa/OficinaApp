'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import StatsCards from '@/components/StatsCards';
import VehicleModal from '@/components/VehicleModal';

export default function MonitorPage() {
  const [veiculos, setVeiculos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadVeiculos(), loadStats()]);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadVeiculos = async () => {
    const response = await fetch('/api/veiculos');
    if (!response.ok) throw new Error('Erro ao carregar veículos');
    const data = await response.json();
    setVeiculos(data);
  };

  const loadStats = async () => {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Erro ao carregar estatísticas');
    const data = await response.json();
    setStats(data);
  };

  const filtrarVeiculos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterTipo) params.append('tipo', filterTipo);
      if (filterStatus) params.append('status', filterStatus);
      
      const response = await fetch(`/api/veiculos?${params}`);
      if (!response.ok) throw new Error('Erro ao filtrar');
      
      const data = await response.json();
      setVeiculos(data);
    } catch (err) {
      setError('Erro ao filtrar veículos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVeiculo = () => {
    setSelectedVeiculo(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditVeiculo = async (placa) => {
    try {
      const response = await fetch(`/api/veiculos/${placa}`);
      if (!response.ok) throw new Error('Erro ao buscar veículo');
      
      const veiculo = await response.json();
      setSelectedVeiculo(veiculo);
      setModalMode('edit');
      setModalOpen(true);
    } catch (err) {
      setError('Erro ao carregar veículo para edição');
    }
  };

  const handleViewDetails = async (placa) => {
    try {
      const response = await fetch(`/api/veiculos/${placa}`);
      if (!response.ok) throw new Error('Erro ao buscar veículo');
      
      const veiculo = await response.json();
      setSelectedVeiculo(veiculo);
      setModalMode('view');
      setModalOpen(true);
    } catch (err) {
      setError('Erro ao carregar detalhes do veículo');
    }
  };

  const handleSaveVeiculo = async (formData) => {
    try {
      const url = modalMode === 'create' 
        ? '/api/veiculos' 
        : `/api/veiculos/${formData.placa}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar veículo');
      }

      await loadData();
      setModalOpen(false);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verde': return 'bg-green-500';
      case 'amarelo': return 'bg-yellow-500';
      case 'azul': return 'bg-blue-500';
      case 'vermelho': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  // Nova função para determinar estado geral do veículo
  const getEstadoGeral = (veiculo) => {
    // CONCLUÍDO: Pintura finalizada + Peças disponíveis
    if (veiculo.pintura_finalizada && veiculo.pecas_disponiveis) {
      return {
        estado: 'concluido',
        cor: 'from-green-600 to-green-800',
        bgBadge: 'bg-green-200',
        textBadge: 'text-green-800',
        iconColor: 'text-green-600'
      };
    }
    
    // EM ANDAMENTO: Peças OK + Tinta OK + Em pintura
    if (veiculo.pecas_disponiveis && veiculo.tinta_acertada && veiculo.em_pintura) {
      return {
        estado: 'andamento',
        cor: 'from-blue-600 to-blue-800',
        bgBadge: 'bg-blue-200',
        textBadge: 'text-blue-800',
        iconColor: 'text-blue-600'
      };
    }
    
    // PENDENTE: Qualquer item em falta
    return {
      estado: 'pendente',
      cor: 'from-yellow-500 to-yellow-700',
      bgBadge: 'bg-yellow-200',
      textBadge: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    };
  };

  // Função atualizada para status individual (nova ordem)
  const getVeiculoStatus = (veiculo) => ({
    // 1. Todas as peças disponíveis
    statusPecas: veiculo.pecas_disponiveis ? 'verde' : 'amarelo',
    textoPecas: veiculo.pecas_disponiveis ? 'Todas as Peças Disponíveis' : 'Aguardando Peças',
    
    // 2. Tinta acertada
    statusTinta: veiculo.tinta_acertada ? 'amarelo' : 'vermelho',
    textoTinta: veiculo.tinta_acertada ? 'Tinta Acertada' : 'Aguardando Acerto de Tinta',
    
    // 3. Em pintura
    statusPintura: veiculo.em_pintura ? 'azul' : 'cinza',
    textoPintura: veiculo.em_pintura ? 'Em Pintura' : 'Pintura Não Iniciada',
    
    // 4. Pintura finalizada
    statusFinalizada: veiculo.pintura_finalizada ? 'verde' : 'cinza',
    textoFinalizada: veiculo.pintura_finalizada ? 'Pintura Finalizada' : 'Pintura Não Concluída'
  });

  if (loading && veiculos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right font-bold text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Filtros */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTipo={filterTipo}
        setFilterTipo={setFilterTipo}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onFilter={filtrarVeiculos}
      />

      {/* Estatísticas */}
      <StatsCards stats={stats} />

      {/* Cabeçalho da lista */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Veículos na Oficina</h2>
        <Link
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Veículo
        </Link>
      </div>

      {/* Lista de veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {veiculos.map((veiculo) => {
          const estadoGeral = getEstadoGeral(veiculo);
          const status = getVeiculoStatus(veiculo);
          const isSeguradora = veiculo.tipo === 'seguradora';
          
          return (
            <div key={veiculo.placa} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 card-hover">
              {/* Header baseado no estado geral */}
              <div className={`bg-gradient-to-r ${estadoGeral.cor} px-6 py-4 flex justify-between items-center`}>
                <div>
                  <h3 className="text-white font-bold text-lg uppercase">{veiculo.placa}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-block bg-white text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">
                      {isSeguradora ? 'Seguradora' : 'Particular'}
                    </span>
                    <span className={`inline-block ${estadoGeral.bgBadge} ${estadoGeral.textBadge} text-xs px-2 py-1 rounded-full font-semibold`}>
                      {estadoGeral.estado === 'concluido' ? 'Concluído' : 
                       estadoGeral.estado === 'andamento' ? 'Em Andamento' : 'Pendente'}
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${estadoGeral.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-gray-500 text-sm">Veículo</h4>
                  <p className="text-gray-800 font-medium uppercase">{veiculo.modelo} {veiculo.ano} - {veiculo.cor}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-gray-500 text-sm">Cliente{isSeguradora ? '/Seguradora' : ''}</h4>
                  <p className="text-gray-800 font-medium uppercase">
                    {isSeguradora && veiculo.sinistro 
                      ? `${veiculo.cliente} (Sinistro #${veiculo.sinistro})`
                      : veiculo.cliente
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-gray-500 text-sm">Entrada</h4>
                    <p className="text-gray-800 font-medium">{formatarData(veiculo.data_entrada)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-500 text-sm">Previsão</h4>
                    <p className="text-gray-800 font-medium">{formatarData(veiculo.previsao_entrega)}</p>
                  </div>
                </div>

                {/* Status em nova ordem */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusPecas)} mr-2`}></div>
                    <span className="text-sm">{status.textoPecas}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusTinta)} mr-2`}></div>
                    <span className="text-sm">{status.textoTinta}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusPintura)} mr-2`}></div>
                    <span className="text-sm">{status.textoPintura}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusFinalizada)} mr-2`}></div>
                    <span className="text-sm">{status.textoFinalizada}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-between">
                <button 
                  onClick={() => handleEditVeiculo(veiculo.placa)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Editar
                </button>
                <button 
                  onClick={() => handleViewDetails(veiculo.placa)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Detalhes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado vazio */}
      {!loading && veiculos.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum veículo</h3>
          <p className="mt-1 text-sm text-gray-500">Comece cadastrando um novo veículo.</p>
          <div className="mt-6">
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
            >
              Cadastrar Primeiro Veículo
            </Link>
          </div>
        </div>
      )}

      {/* Modal */}
      <VehicleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        veiculo={selectedVeiculo}
        onSave={handleSaveVeiculo}
      />

      {/* Botão flutuante mobile */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Link
          href="/"
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}