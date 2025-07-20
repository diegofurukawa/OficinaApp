export default function FilterBar({ 
  searchTerm, 
  setSearchTerm, 
  filterTipo, 
  setFilterTipo, 
  filterStatus, 
  setFilterStatus,
  incluirFinalizados = false,
  setIncluirFinalizados,
  onFilter 
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col gap-4">
        {/* Linha 1: Input de busca */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por placa, cliente ou modelo..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        {/* Linha 2: Filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="particular">Particular</option>
              <option value="seguradora">Seguradora</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="aguardando_tinta">Aguardando Tinta</option>
              <option value="aguardando_pecas">Aguardando Peças</option>
              <option value="em_pintura">Em Pintura</option>
              <option value="finalizado">Finalizado</option>
            </select>

            {/* NOVO: Checkbox Incluir Finalizados */}
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
              <input
                type="checkbox"
                id="incluirFinalizados"
                checked={incluirFinalizados}
                onChange={(e) => setIncluirFinalizados(e.target.checked)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="incluirFinalizados" className="text-sm text-gray-700 cursor-pointer">
                Incluir Finalizados
              </label>
            </div>
          </div>

          <button
            onClick={onFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
}