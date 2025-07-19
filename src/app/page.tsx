'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    setFormData(prev => ({
      ...prev,
      data_entrada: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/veiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar veículo');
      }

      // Sucesso - redirecionar para Monitor
      router.push('/monitor');
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao salvar veículo');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Cadastro de Veículo</h1>
        
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
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-gray-700 font-medium mb-3">Status Inicial</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tinta_acertada"
                  name="tinta_acertada"
                  checked={formData.tinta_acertada}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="tinta_acertada">Tinta já acertada</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pecas_disponiveis"
                  name="pecas_disponiveis"
                  checked={formData.pecas_disponiveis}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="pecas_disponiveis">Todas as peças disponíveis</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="em_pintura"
                  name="em_pintura"
                  checked={formData.em_pintura}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="em_pintura">Em pintura</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pintura_finalizada"
                  name="pintura_finalizada"
                  checked={formData.pintura_finalizada}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="pintura_finalizada">Pintura finalizada</label>
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
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}