// ══════════════════════════════════════════════════════════
// UTILS - FORMATAÇÃO E CÁLCULOS
// ══════════════════════════════════════════════════════════

/**
 * Converte string numérica para float, aceitando vírgula como separador decimal (pt-BR)
 */
export const parseDecimal = (value: string): number => {
  return parseFloat(value.replace(',', '.')) || 0;
};

/**
 * Sanitiza input numérico: só permite dígitos e até 2 casas decimais (vírgula ou ponto)
 */
export const sanitizeDecimalInput = (value: string): string => {
  // Permite apenas dígitos e separador decimal (vírgula ou ponto)
  const cleaned = value.replace(/[^0-9,.]/g, '').replace('.', ',');
  // Garante no máximo uma vírgula e no máximo 2 dígitos após ela
  const parts = cleaned.split(',');
  if (parts.length > 2) return parts[0] + ',' + parts[1].slice(0, 2);
  if (parts[1] !== undefined) return parts[0] + ',' + parts[1].slice(0, 2);
  return parts[0];
};

/**
 * Formata valor monetário para BRL
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Formata valor monetário sem símbolo
 */
export const formatCurrencyValue = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Calcula valor total de venda
 */
export const calculateSaleTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

/**
 * Calcula comissão
 */
export const calculateCommission = (totalSales: number, percentage: number): number => {
  return totalSales * percentage;
};

/**
 * Calcula porcentagem de meta
 */
export const calculateGoalPercentage = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100);
};

/**
 * Formata data para padrão brasileiro
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

/**
 * Gera ID único simples
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
