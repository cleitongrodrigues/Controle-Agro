// ══════════════════════════════════════════════════════════
// DATA - DADOS MOCKADOS AGROVENDAS
// ══════════════════════════════════════════════════════════

import { Farm, Product, SaleHistoryItem } from '../types';

export const FARMS: Farm[] = [
  {
    id: '1',
    nome: 'Faz. Boa Vista',
    proprietario: 'Ronaldo Ferreira',
    hectares: 1200,
    localizacao: 'MT-246, km 18',
    status: 'visitado',
  },
  {
    id: '2',
    nome: 'Faz. São João',
    proprietario: 'Carlos Mota',
    hectares: 800,
    localizacao: 'Rodovia BR-163, km 42',
    status: 'visitado',
  },
  {
    id: '3',
    nome: 'Faz. Esperança',
    proprietario: 'Maria Silva',
    hectares: 600,
    localizacao: 'Estrada Esperança, s/n',
    status: 'visitado',
  },
  {
    id: '4',
    nome: 'Faz. Aliança',
    proprietario: 'José Alves',
    hectares: 420,
    localizacao: 'Estrada Aliança s/n',
    status: 'pendente',
  },
  {
    id: '5',
    nome: 'Faz. Horizonte',
    proprietario: 'Roberto Lima',
    hectares: 1800,
    localizacao: 'Rod. Estadual 208, km 7',
    status: 'urgente',
  },
  {
    id: '6',
    nome: 'Faz. Vitória',
    proprietario: 'Paulo Santos',
    hectares: 950,
    localizacao: 'MT-170, km 32',
    status: 'visitado',
  },
  {
    id: '7',
    nome: 'Faz. Progresso',
    proprietario: 'Ana Paula Costa',
    hectares: 680,
    localizacao: 'Linha 10, lote 45',
    status: 'pendente',
  },
  {
    id: '8',
    nome: 'Faz. Santa Clara',
    proprietario: 'João Batista',
    hectares: 1500,
    localizacao: 'BR-242, km 85',
    status: 'visitado',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    nome: 'Herbicida Roundup 20L',
    preco: 185,
    categoria: 'herbicida',
  },
  {
    id: '2',
    nome: 'Semente Soja RR2 50kg',
    preco: 412.50,
    categoria: 'semente',
  },
  {
    id: '3',
    nome: 'Fertilizante NPK 20kg',
    preco: 82,
    categoria: 'fertilizante',
  },
  {
    id: '4',
    nome: 'Fungicida Opera 1L',
    preco: 310,
    categoria: 'fungicida',
  },
  {
    id: '5',
    nome: 'Semente Milho DKB 30F35',
    preco: 520,
    categoria: 'semente',
  },
  {
    id: '6',
    nome: 'Herbicida Atrazina 20L',
    preco: 165,
    categoria: 'herbicida',
  },
  {
    id: '7',
    nome: 'Adubo Ureia 50kg',
    preco: 140,
    categoria: 'fertilizante',
  },
  {
    id: '8',
    nome: 'Inseticida Connect 1L',
    preco: 285,
    categoria: 'herbicida',
  },
  {
    id: '9',
    nome: 'Semente Algodão BM3 25kg',
    preco: 890,
    categoria: 'semente',
  },
  {
    id: '10',
    nome: 'Calcário Dolomítico 50kg',
    preco: 45,
    categoria: 'fertilizante',
  },
  {
    id: '11',
    nome: 'Outro (digitar manualmente)',
    preco: 0,
    categoria: 'outro',
  },
];

export const FARM_HISTORY: Record<string, SaleHistoryItem[]> = {
  '1': [
    {
      data: '12/06',
      produto: 'Herbicida Roundup 20L × 10',
      valor: 'R$ 3.700',
      nota: 'Pagamento via barter — 23 sacas soja',
    },
    {
      data: '03/05',
      produto: 'Semente Milho DKB 230 × 20',
      valor: 'R$ 5.200',
      nota: 'Entrega feita pelo armazém',
    },
    {
      data: '14/04',
      produto: 'Fertilizante NPK 20kg × 50',
      valor: 'R$ 4.100',
      nota: 'Parcelado em 3x',
    },
  ],
  '2': [
    {
      data: '05/06',
      produto: 'Soja RR2 50kg × 20',
      valor: 'R$ 8.250',
      nota: 'Pedido recorrente — confirmou próximo mês',
    },
    {
      data: '20/04',
      produto: 'Herbicida Opera 1L × 5',
      valor: 'R$ 1.850',
      nota: 'Aplicou ele mesmo',
    },
  ],
  '4': [
    {
      data: '28/04',
      produto: 'Herbicida 20L × 5',
      valor: 'R$ 1.850',
      nota: 'Pediu orçamento fungicida para próxima safra — pendente!',
    },
    {
      data: '10/03',
      produto: 'Semente Soja RR2 × 10',
      valor: 'R$ 4.125',
      nota: 'Sem pendências',
    },
  ],
  '5': [
    {
      data: 'Proposta aberta',
      produto: 'Semente Algodão BM3 × 30',
      valor: 'R$ 24.000',
      nota: '⚠️ Proposta VENCE em 2 dias! Ligar hoje.',
    },
  ],
};

export const SOJA_PRICE_PER_SACK = 160; // R$ por saca de 60kg
export const COMMISSION_PERCENTAGE = 0.06; // 6%
