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
      case 'vermelho': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 card-hover">
      {/* Header Colorido com Gradiente */}
      <div className={`${
        isSeguradora 
          ? 'bg-gradient-to-r from-blue-600 to-blue-800' 
          : 'bg-gradient-to-r from-green-600 to-green-800'
      } px-6 py-4 flex justify-between items-center`}>
        <div>
          <h3 className="text-white font-bold text-lg">{veiculo.placa}</h3>
          <span className={`inline-block ${
            isSeguradora 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-green-200 text-green-800'
          } text-xs px-2 py-1 rounded-full font-semibold mt-1`}>
            {isSeguradora ? 'Seguradora' : 'Particular'}
          </span>
        </div>
        <div className="bg-white rounded-full p-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" 
               className={`h-6 w-6 ${isSeguradora ? 'text-blue-600' : 'text-green-600'}`} 
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
          <p className="text-gray-800 font-semibold text-lg">{veiculo.modelo} {veiculo.ano} - {veiculo.cor}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-gray-500 text-sm font-medium">Cliente{isSeguradora ? '/Seguradora' : ''}</h4>
          <p className="text-gray-800 font-medium">
            {isSeguradora && veiculo.sinistro 
              ? `${veiculo.cliente} (Sinistro #${veiculo.sinistro})`
              : veiculo.cliente
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-gray-500 text-sm font-medium">Entrada</h4>
            <p className="text-gray-800 font-semibold">{formatarData(veiculo.dataEntrada)}</p>
          </div>
          <div>
            <h4 className="text-gray-500 text-sm font-medium">Previsão</h4>
            <p className="text-gray-800 font-semibold">{formatarData(veiculo.previsao)}</p>
          </div>
        </div>

        {/* Status com bolinhas coloridas */}
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(veiculo.statusTinta)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{veiculo.textoTinta}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(veiculo.statusPintura)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{veiculo.textoPintura}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(veiculo.statusPecas)} mr-3 shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700">{veiculo.textoPecas}</span>
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