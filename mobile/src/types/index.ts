// ══════════════════════════════════════════════════════════
// TIPOS GLOBAIS - AGROVENDAS
// ══════════════════════════════════════════════════════════

export type FarmStatus = 'visitado' | 'pendente' | 'urgente';

export interface Farm {
  id: string;
  nome: string;
  proprietario: string;
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

export interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: 'herbicida' | 'semente' | 'fertilizante' | 'fungicida' | 'outro';
  ativo?: boolean;
}

export interface Goal {
  id: string;
  nome: string;
  valorMeta: number;
  categoria?: string;
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
