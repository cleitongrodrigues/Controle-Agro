// ══════════════════════════════════════════════════════════
// TIPOS GLOBAIS - AGROVENDAS
// ══════════════════════════════════════════════════════════

export type FarmStatus = 'visitado' | 'pendente' | 'urgente';

export interface Farm {
  id: string;
  nome: string;
  responsavel: string;
  hectares: number;
  localizacao: string;
  telefone?: string;
  status: FarmStatus;
  latitude?: number;
  longitude?: number;
}

export interface SaleHistoryItem {
  data: string;
  produto: string;
  valor: string;
  nota?: string;
}

export interface Sale {
  id: string;
  fazendaId: string;
  fazendaNome: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  desconto?: number;
  descontoTipo?: 'percentual' | 'valor';
  valorComDesconto?: number;
  data: string;
  sincronizado: boolean;
}

export interface ItemPedido {
  id: string;
  pedidoId: string;
  produtoId: string;
  produto: string;
  categoria: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  desconto?: number;
  descontoTipo?: 'percentual' | 'valor';
  valorComDesconto?: number;
}

export interface Pedido {
  id: string;
  fazendaId: string;
  fazendaNome: string;
  itens: ItemPedido[];
  valorTotal: number;
  desconto?: number;
  descontoTipo?: 'percentual' | 'valor';
  valorFinal?: number;
  data: string;
  sincronizado: boolean;
}

export interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: 'herbicida' | 'semente' | 'fertilizante' | 'fungicida' | 'outro';
  ativo?: boolean;
}

export type GoalTipoFiltro = 'geral' | 'categoria' | 'produto';

export interface Goal {
  id: string;
  nome: string;
  valorMeta: number;
  tipoFiltro: GoalTipoFiltro;
  categoria?: string;
  produtoId?: string;
  produtoNome?: string;
  dataInicio?: string;
  dataFim?: string;
  ativo: boolean;
}

export type UsuarioNivel = 'admin' | 'supervisor' | 'vendedor';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  nivel: UsuarioNivel;
  ativo: boolean;
}

export interface Client {
  iniciais: string;
  nome: string;
  detalhe: string;
  status: 'ativo' | 'sem-compra' | 'pendente';
}

export interface MonthlyReport {
  visitasRealizadas: number;
  clientesAtendidos: number;
  herbicidas: number;
  sementes: number;
  fertilizantes: number;
  outros: number;
  total: number;
}

export interface Commission {
  percentual: number;
  valorBase: number;
  valorComissao: number;
  mes: string;
}

export interface Metric {
  label: string;
  value: string | number;
  subtitle: string;
  variant?: 'default' | 'warning';
}
