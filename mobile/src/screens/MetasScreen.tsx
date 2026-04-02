// ══════════════════════════════════════════════════════════
// METAS SCREEN
// ══════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppHeader, GoalProgress } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { Goal, Client, Commission } from '../types';
import { formatCurrency, calculateGoalPercentage } from '../utils/helpers';
import { COMMISSION_PERCENTAGE } from '../config/data';
import { useApp } from '../contexts/AppContext';

export const MetasScreen: React.FC = () => {
  const { goals = [], sales = [], farms = [] } = useApp();

  // Calcular total de vendas do mês atual
  const totalVendas = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return sales
      .filter(sale => {
        const saleDate = new Date(sale.data);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .reduce((sum, sale) => sum + (sale.valorComDesconto ?? sale.valorTotal), 0);
  }, [sales]);

  // Calcular vendas por categoria
  const salesByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryTotals: Record<string, number> = {};

    sales
      .filter(sale => {
        const saleDate = new Date(sale.data);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .forEach(sale => {
        const category = sale.categoria?.toLowerCase() || 'geral';
        categoryTotals[category] = (categoryTotals[category] || 0) + (sale.valorComDesconto ?? sale.valorTotal);
      });

    return categoryTotals;
  }, [sales]);

  // Retorna o valor atual de vendas para uma meta, respeitando filtro e período
  const calcularValorAtual = (goal: Goal): number => {
    const filtrarPorPeriodo = (data: string): boolean => {
      if (!goal.dataInicio && !goal.dataFim) {
        // Sem período definido: usa mês atual
        const now = new Date();
        const d = new Date(data);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (goal.dataInicio && data < goal.dataInicio) return false;
      if (goal.dataFim && data > goal.dataFim) return false;
      return true;
    };

    return sales
      .filter(sale => filtrarPorPeriodo(sale.data))
      .filter(sale => {
        if (goal.tipoFiltro === 'produto') return sale.produto === goal.produtoNome;
        if (goal.tipoFiltro === 'categoria') return sale.categoria?.toLowerCase() === goal.categoria?.toLowerCase();
        return true; // 'geral'
      })
      .reduce((sum, sale) => sum + (sale.valorComDesconto ?? sale.valorTotal), 0);
  };

  // Mapear metas com valores calculados
  const goalsWithProgress = useMemo(() => {
    return goals
      .filter(goal => goal.ativo)
      .map(goal => {
        const valorAtual = calcularValorAtual(goal);
        const porcentagem = calculateGoalPercentage(valorAtual, goal.valorMeta);

        return {
          ...goal,
          valorAtual,
          porcentagem,
        };
      });
  }, [goals, sales]);
  
  const commission: Commission = {
    percentual: COMMISSION_PERCENTAGE,
    valorBase: totalVendas,
    valorComissao: totalVendas * COMMISSION_PERCENTAGE,
    mes: new Date().toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()),
  };

  // Calcular vendas por fazenda no mês atual
  const farmStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const stats: Record<string, { total: number; count: number; lastSale?: string }> = {};

    sales
      .filter(sale => {
        const saleDate = new Date(sale.data);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .forEach(sale => {
        if (!stats[sale.fazendaId]) {
          stats[sale.fazendaId] = { total: 0, count: 0 };
        }
        stats[sale.fazendaId].total += sale.valorComDesconto;
        stats[sale.fazendaId].count += 1;
        
        if (!stats[sale.fazendaId].lastSale || sale.data > stats[sale.fazendaId].lastSale!) {
          stats[sale.fazendaId].lastSale = sale.data;
        }
      });

    return stats;
  }, [sales]);

  // Criar lista de clientes com base nas fazendas
  const clients: Client[] = useMemo(() => {
    return farms.map(farm => {
      const stats = farmStats[farm.id];
      const initials = farm.nome
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      if (stats && stats.count > 0) {
        return {
          iniciais: initials,
          nome: farm.nome,
          detalhe: `${formatCurrency(stats.total)} — ${stats.count} ${stats.count === 1 ? 'venda' : 'vendas'}`,
          status: 'ativo' as const,
        };
      }

      return {
        iniciais: initials,
        nome: farm.nome,
        detalhe: 'Sem vendas este mês',
        status: 'sem-compra' as const,
      };
    }).sort((a, b) => {
      // Clientes ativos primeiro
      if (a.status === 'ativo' && b.status !== 'ativo') return -1;
      if (a.status !== 'ativo' && b.status === 'ativo') return 1;
      return a.nome.localeCompare(b.nome);
    });
  }, [farms, farmStats]);

  return (
    <View style={globalStyles.container}>
      <AppHeader 
        title="Metas & Comissões" 
        subtitle="Controle exclusivo seu"
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          {/* Comissão Hero */}
          <View style={styles.commissionHero}>
            <View style={styles.commDecor} />
            <Text style={styles.commLabel}>Comissão estimada — {commission.mes}</Text>
            <Text style={styles.commValue}>
              {formatCurrency(commission.valorComissao)}
            </Text>
            <Text style={styles.commSub}>
              {commission.percentual * 100}% sobre {formatCurrency(commission.valorBase)} vendidos
            </Text>
          </View>

          {/* Metas */}
          <Text style={globalStyles.sectionTitle}>Progresso por categoria</Text>
          {goalsWithProgress.length > 0 ? (
            <View style={globalStyles.card}>
              {goalsWithProgress.map((goal, index) => (
                <View key={index}>
                  <GoalProgress goal={goal} />
                  {index < goalsWithProgress.length - 1 && <View style={{ height: 0 }} />}
                </View>
              ))}
            </View>
          ) : (
            <View style={globalStyles.card}>
              <Text style={styles.emptyText}>
                Nenhuma meta configurada. Crie suas metas na tela de configurações.
              </Text>
            </View>
          )}

          {/* Clientes */}
          {clients.length > 0 && (
            <>
              <Text style={globalStyles.sectionTitle}>Clientes — compras no mês</Text>
              <View style={globalStyles.card}>
                {clients.map((client, index) => (
                  <View key={index}>
                    <View style={styles.clientRow}>
                      <View style={styles.clientInit}>
                        <Text style={styles.clientInitText}>{client.iniciais}</Text>
                      </View>
                      <View style={styles.clientBody}>
                        <Text style={styles.clientName}>{client.nome}</Text>
                        <Text style={styles.clientDetail}>{client.detalhe}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        client.status === 'ativo' && styles.statusOk,
                        client.status === 'sem-compra' && styles.statusNo,
                        client.status === 'pendente' && styles.statusPend,
                      ]}>
                        <Text style={styles.statusText}>
                          {client.status === 'ativo' ? 'Ativo' :
                           client.status === 'sem-compra' ? 'Sem compra' :
                           'Pendente'}
                        </Text>
                      </View>
                    </View>
                    {index < clients.length - 1 && <View style={{ height: 0 }} />}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  commissionHero: {
    backgroundColor: Colors.green[800],
    borderRadius: BorderRadius.md,
    padding: 20,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  commDecor: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -40 }],
    width: 80,
    height: 80,
    opacity: 0.05,
  },
  commLabel: {
    fontSize: FontSizes.base,
    color: Colors.green[200],
    marginBottom: 6,
  },
  commValue: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.green[50],
    fontVariant: ['tabular-nums'],
    lineHeight: 42,
  },
  commSub: {
    fontSize: FontSizes.base,
    color: Colors.green[200],
    marginTop: 6,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  clientInit: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.green[50],
    borderWidth: 1.5,
    borderColor: Colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientInitText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.green[700],
  },
  clientBody: {
    flex: 1,
  },
  clientName: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[900],
  },
  clientDetail: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  statusOk: {
    backgroundColor: Colors.green[50],
  },
  statusNo: {
    backgroundColor: Colors.red[100],
  },
  statusPend: {
    backgroundColor: Colors.amber[100],
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
