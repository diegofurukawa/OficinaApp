export type Veiculo = {
  placa: string;
  modelo: string;
  ano: number;
  cor: string;
  cliente: string;
  sinistro?: string;
  data_entrada: string;
  previsao_entrega: string;
  pintura_finalizada: boolean;
  pecas_disponiveis: boolean;
  tinta_acertada: boolean;
  em_pintura: boolean;
  tipo: 'particular' | 'seguradora';
};
