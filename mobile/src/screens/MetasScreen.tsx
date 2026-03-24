// ══════════════════════════════════════════════════════════
// METAS SCREEN
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppHeader, GoalProgress } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { Goal, Client, Commission } from '../types';
import { formatCurrency, calculateGoalPercentage } from '../utils/helpers';
import { COMMISSION_PERCENTAGE } from '../config/data';

export const MetasScreen: React.FC = () => {
  const totalVendas = 48550;
  
  const commission: Commission = {
    percentual: COMMISSION_PERCENTAGE,
    valorBase: totalVendas,
    valorComissao: totalVendas * COMMISSION_PERCENTAGE,
    mes: 'Junho',
  };

  const goals: Goal[] = [
    {
      nome: 'Herbicidas & Defensivos',
      valorAtual: 14200,
      valorMeta: 18000,
      porcentagem: calculateGoalPercentage(14200, 18000),
      categoria: 'herbicidas',
    },
    {
      nome: 'Sementes',
      valorAtual: 22500,
      valorMeta: 25000,
      porcentagem: calculateGoalPercentage(22500, 25000),
      categoria: 'sementes',
    },
    {
      nome: 'Fertilizantes',
      valorAtual: 8100,
      valorMeta: 15000,
      porcentagem: calculateGoalPercentage(8100, 15000),
      categoria: 'fertilizantes',
    },
    {
      nome: 'Meta geral',
      valorAtual: 48550,
      valorMeta: 60000,
      porcentagem: calculateGoalPercentage(48550, 60000),
      categoria: 'geral',
    },
  ];

  const clients: Client[] = [
    {
      iniciais: 'BV',
      nome: 'Faz. Boa Vista',
      detalhe: 'R$ 14.200 — 4 pedidos',
      status: 'ativo',
    },
    {
      iniciais: 'SJ',
      nome: 'Faz. São João',
      detalhe: 'R$ 12.400 — 2 pedidos',
      status: 'ativo',
    },
    {
      iniciais: 'ES',
      nome: 'Faz. Esperança',
      detalhe: 'R$ 4.100 — 1 pedido',
      status: 'ativo',
    },
    {
      iniciais: 'AL',
      nome: 'Faz. Aliança',
      detalhe: 'Última compra: Maio/25',
      status: 'sem-compra',
    },
    {
      iniciais: 'HZ',
      nome: 'Faz. Horizonte',
      detalhe: 'Proposta aberta — R$ 24.000',
      status: 'pendente',
    },
  ];

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
          <View style={globalStyles.card}>
            {goals.map((goal, index) => (
              <View key={index}>
                <GoalProgress goal={goal} />
                {index < goals.length - 1 && <View style={{ height: 0 }} />}
              </View>
            ))}
          </View>

          {/* Clientes */}
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
});
