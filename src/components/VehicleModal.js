'use client';

import { useState, useEffect } from 'react';

export default function VehicleModal({ 
  isOpen, 
  onClose, 
  mode, // 'create', 'edit', 'view'
  veiculo = null,
  onSave 
}) {
  const [formData, setFormData] = useState({
    placa: '',
    tipo: 'particular',
    modelo: '',
    ano: '',
    cor: '',
    cliente: '',
    sinistro: '',
    data_entrada: '',
    previsao_entrega: '',
    tinta_acertada: false,
    em_pintura: false,
    pintura_finalizada: false,
    pecas_disponiveis: false,
    observacoes: ''
  });

  useEffect(() => {
    if (veiculo && (mode === 'edit' || mode === 'view')) {
      // Mapear campos do banco para o frontend
      setFormData({
        placa: veiculo.placa || '',
        tipo: veiculo.tipo || 'particular',
        modelo: veiculo.modelo || '',
        ano: veiculo.ano || '',
        cor: veiculo.cor || '',
        cliente: veiculo.cliente || '',
        sinistro: veiculo.sinistro || '',
        data_entrada: veiculo.data_entrada || '',
        previsao_entrega: veiculo.previsao_entrega || '',
        tinta_acertada: veiculo.tinta_acertada || false,
        em_pintura: veiculo.em_pintura || false,
        pintura_finalizada: veiculo.pintura_finalizada || false,
        pecas_disponiveis: veiculo.pecas_disponiveis || false,
        observacoes: veiculo.observacoes || ''
      });
    } else if (mode === 'create') {
      setFormData({
        placa: '',
        tipo: 'particular',
        modelo: '',
        ano: '',
        cor: '',
        cliente: '',
        sinistro: '',
        data_entrada: new Date().toISOString().split('T')[0],
        previsao_entrega: '',
        tinta_acertada: false,
        em_pintura: false,
        pintura_finalizada: false,
        pecas_disponiveis: false,
        observacoes: ''
      });
    }
  }, [veiculo, mode]);

  // NOVA FUNÇÃO: Status em Cascata
  const updateCascadeStatus = (field, checked, currentData) => {
    let newData = { ...currentData, [field]: checked };
    
    // Ordem lógica: pecas_disponiveis → tinta_acertada → em_pintura → pintura_finalizada
    
    if (field === 'pecas_disponiveis' && checked) {
      // Se marcar peças, automaticamente marcar tinta
      newData.tinta_acertada = true;
    }
    
    if (field === 'tinta_acertada' && checked) {
      // Se marcar tinta, automaticamente marcar peças
      newData.pecas_disponiveis = true;
    }
    
    if (field === 'em_pintura' && checked) {
      // Se marcar em pintura, automaticamente marcar tinta e peças
      newData.pecas_disponiveis = true;
      newData.tinta_acertada = true;
    }
    
    if (field === 'pintura_finalizada' && checked) {
      // Se marcar finalizada, automaticamente marcar todos anteriores
      newData.pecas_disponiveis = true;
      newData.tinta_acertada = true;
      newData.em_pintura = true;
    }
    
    // Lógica reversa: ao desmarcar, desmarcar posteriores
    if (field === 'pecas_disponiveis' && !checked) {
      // Se desmarcar peças, desmarcar tinta, pintura e finalizada
      newData.tinta_acertada = false;
      newData.em_pintura = false;
      newData.pintura_finalizada = false;
    }
    
    if (field === 'tinta_acertada' && !checked) {
      // Se desmarcar tinta, desmarcar pintura e finalizada
      newData.em_pintura = false;
      newData.pintura_finalizada = false;
    }
    
    if (field === 'em_pintura' && !checked) {
      // Se desmarcar em pintura, desmarcar finalizada
      newData.pintura_finalizada = false;
    }
    
    return newData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && ['tinta_acertada', 'em_pintura', 'pintura_finalizada', 'pecas_disponiveis'].includes(name)) {
      // Aplicar lógica cascata para status
      const newFormData = updateCascadeStatus(name, checked, formData);
      setFormData(newFormData);
    } else {
      // Para outros campos, comportamento normal
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Adicionar Novo Veículo';
      case 'edit': return `Editar Veículo ${formData.placa.toUpperCase()}`;
      case 'view': return `Detalhes do Veículo ${formData.placa.toUpperCase()}`;
      default: return 'Veículo';
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Função para exibir texto em uppercase
  const displayText = (text) => {
    return text ? text.toUpperCase() : '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-xl">{getModalTitle()}</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {mode === 'view' ? (
            // Modo visualização - EXIBIR EM UPPERCASE
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-gray-500 text-sm">Placa</h4>
                  <p className="text-gray-800 font-medium">{displayText(formData.placa)}</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Tipo</h4>
                  <p className="text-gray-800 font-medium">{formData.tipo === 'seguradora' ? 'Seguradora' : 'Particular'}</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Veículo</h4>
                  <p className="text-gray-800 font-medium">{displayText(formData.modelo)} {formData.ano} - {displayText(formData.cor)}</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Cliente{formData.tipo === 'seguradora' ? '/Seguradora' : ''}</h4>
                  <p className="text-gray-800 font-medium">
                    {formData.tipo === 'seguradora' && formData.sinistro 
                      ? `${displayText(formData.cliente)} (Sinistro #${formData.sinistro})`
                      : displayText(formData.cliente)
                    }
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Entrada</h4>
                  <p className="text-gray-800 font-medium">{formatarData(formData.data_entrada)}</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm">Previsão</h4>
                  <p className="text-gray-800 font-medium">{formatarData(formData.previsao_entrega)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-700 font-medium mb-3">Status Atual</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${formData.pecas_disponiveis ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className="text-sm">{formData.pecas_disponiveis ? 'Todas as Peças Disponíveis' : 'Aguardando Peças'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${formData.tinta_acertada ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className="text-sm">{formData.tinta_acertada ? 'Tinta Acertada' : 'Aguardando Acerto de Tinta'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${formData.pintura_finalizada ? 'bg-green-500' : formData.em_pintura ? 'bg-yellow-500' : 'bg-gray-300'} mr-2`}></div>
                    <span className="text-sm">
                      {formData.pintura_finalizada ? 'Pintura Concluída' : formData.em_pintura ? 'Em Pintura' : 'Pintura Não Iniciada'}
                    </span>
                  </div>
                </div>
              </div>

              {formData.observacoes && (
                <div className="mb-6">
                  <h4 className="text-gray-700 font-medium mb-3">Observações</h4>
                  <p className="text-gray-600">{displayText(formData.observacoes)}</p>
                </div>
              )}
            </div>
          ) : (
            // Modo criação/edição
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Placa</label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ABC-1234"
                    required
                    disabled={mode === 'edit'}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="particular">Particular</option>
                    <option value="seguradora">Seguradora</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Marca/Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Honda Civic"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Ano</label>
                  <input
                    type="text"
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2022"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Cor</label>
                  <input
                    type="text"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Preto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Cliente/Seguradora</label>
                  <input
                    type="text"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do cliente ou seguradora"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nº Sinistro (se seguradora)</label>
                  <input
                    type="text"
                    name="sinistro"
                    value={formData.sinistro}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Data de Entrada</label>
                  <input
                    type="date"
                    name="data_entrada"
                    value={formData.data_entrada}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Previsão de Entrega</label>
                  <input
                    type="date"
                    name="previsao_entrega"
                    value={formData.previsao_entrega}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-700 font-medium mb-3">Status - Ordem Lógica</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-700">
                    <strong>Cascata Automática:</strong> Ao marcar um status, os anteriores serão marcados automaticamente. 
                    Ao desmarcar, os posteriores serão desmarcados.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="pecas_disponiveis"
                      name="pecas_disponiveis"
                      checked={formData.pecas_disponiveis}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="pecas_disponiveis" className="font-medium">1. Todas as peças disponíveis</label>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="tinta_acertada"
                      name="tinta_acertada"
                      checked={formData.tinta_acertada}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="tinta_acertada" className="font-medium">2. Tinta acertada</label>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="em_pintura"
                      name="em_pintura"
                      checked={formData.em_pintura}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="em_pintura" className="font-medium">3. Em pintura</label>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="pintura_finalizada"
                      name="pintura_finalizada"
                      checked={formData.pintura_finalizada}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="pintura_finalizada" className="font-medium">4. Pintura finalizada</label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Observações adicionais sobre o veículo..."
                />
              </div>
            </form>
          )}

          {/* Footer com botões */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </button>
            {mode !== 'view' && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {mode === 'create' ? 'Adicionar Veículo' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}