export default function VehicleCard({ 
  veiculo, 
  onEdit, 
  onDetails 
}) {
  const isSeguradora = veiculo.tipo === 'seguradora';
  
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

  const estadoGeral = getEstadoGeral(veiculo);
  const status = getVeiculoStatus(veiculo);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 card-hover">
      {/* Header Colorido baseado no estado geral */}
      <div className={`bg-gradient-to-r ${estadoGeral.cor} px-6 py-4 flex justify-between items-center`}>
        <div>
                            <h3 className="text-white font-bold text-lg uppercase">{veiculo.placa}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`inline-block ${isSeguradora ? 'bg-white text-gray-800' : 'bg-white text-gray-800'} text-xs px-2 py-1 rounded-full font-semibold`}>
              {isSeguradora ? 'Seguradora' : 'Particular'}
            </span>
            <span className={`inline-block ${estadoGeral.bgBadge} ${estadoGeral.textBadge} text-xs px-2 py-1 rounded-full font-semibold`}>
              {estadoGeral.estado === 'concluido' ? 'Concluído' : 
               estadoGeral.estado === 'andamento' ? 'Em Andamento' : 'Pendente'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-full p-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" 
               className={`h-6 w-6 ${estadoGeral.iconColor}`} 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-gray-500 text-sm font-medium">Veículo</h4>
          <p className="text-gray-800 font-semibold text-lg uppercase">{veiculo.modelo} {veiculo.ano} - {veiculo.cor}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-gray-500 text-sm font-medium">Cliente{isSeguradora ? '/Seguradora' : ''}</h4>
          <p className="text-gray-800 font-medium uppercase">
            {isSeguradora && veiculo.sinistro 
              ? `${veiculo.cliente} (Sinistro #${veiculo.sinistro})`
              : veiculo.cliente
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-gray-500 text-sm font-medium">Entrada</h4>
            <p className="text-gray-800 font-semibold">{formatarData(veiculo.dataEntrada || veiculo.data_entrada)}</p>
          </div>
          <div>
            <h4 className="text-gray-500 text-sm font-medium">Previsão</h4>
            <p className="text-gray-800 font-semibold">{formatarData(veiculo.previsao || veiculo.previsao_entrega)}</p>
          </div>
        </div>

        {/* Status em nova ordem */}
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusPecas)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{status.textoPecas}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusTinta)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{status.textoTinta}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusPintura)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{status.textoPintura}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(status.statusFinalizada)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{status.textoFinalizada}</span>
          </div>
        </div>
      </div>

      {/* Footer com botões */}
      <div className="px-6 py-4 bg-gray-50 flex justify-between border-t border-gray-100">
        <button 
          onClick={() => onEdit(veiculo.placa)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Editar
        </button>
        <button 
          onClick={() => onDetails(veiculo.placa)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Detalhes
        </button>
      </div>
    </div>
  );
}