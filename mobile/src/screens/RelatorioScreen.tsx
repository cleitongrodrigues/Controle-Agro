// ══════════════════════════════════════════════════════════
// RELATÓRIO SCREEN
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader, LoadingOverlay } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { formatCurrency } from '../utils/helpers';
import { MonthlyReport } from '../types';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

export const RelatorioScreen: React.FC = () => {
  const { sales, loading: appLoading } = useApp();
  const { showToast } = useToast();
  
  const [options, setOptions] = useState({
    fotos: true,
    assinaturas: true,
    pendencias: false,
    barter: true,
  });
  const [exporting, setExporting] = useState(false);

  // Calcular relatório a partir das vendas reais
  const report: MonthlyReport = useMemo(() => {
    // Vendas mockadas para demonstração
    const mockHerbicidas = 14200;
    const mockSementes = 22500;
    const mockFertilizantes = 8100;
    const mockOutros = 3750;

    // Vendas reais do Context
    const totalFromSales = sales.reduce((sum, sale) => sum + sale.valorTotal, 0);
    const farmsVisited = new Set(sales.map(s => s.fazendaId)).size;

    return {
      visitasRealizadas: Math.max(18, farmsVisited),
      clientesAtendidos: Math.max(12, farmsVisited),
      herbicidas: mockHerbicidas,
      sementes: mockSementes,
      fertilizantes: mockFertilizantes,
      outros: mockOutros + totalFromSales,
      total: mockHerbicidas + mockSementes + mockFertilizantes + mockOutros + totalFromSales,
    };
  }, [sales]);

  const handleExport = async (type: string) => {
    setExporting(true);
    
    // Simular exportação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setExporting(false);
    showToast(`${type} gerado com sucesso!`, 'success');
  };

  return (
    <View style={globalStyles.container}>
      <AppHeader 
        title="Relatório Mensal" 
        subtitle="Gerado automaticamente"
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Resumo de junho 2025</Text>
          
          <View style={globalStyles.card}>
            {/* Report Box */}
            {appLoading ? (
              <Text style={styles.loadingText}>Carregando dados...</Text>
            ) : (
              <View style={styles.reportBox}>
                <Text style={styles.reportTitle}>
                  Relatório Mensal — Cooperativa Agro Centro-Oeste
                </Text>
                
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Visitas realizadas</Text>
                  <Text style={styles.reportValue}>{report.visitasRealizadas}</Text>
                </View>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Clientes atendidos</Text>
                  <Text style={styles.reportValue}>{report.clientesAtendidos}</Text>
                </View>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Herbicidas & defensivos</Text>
                  <Text style={styles.reportValue}>{formatCurrency(report.herbicidas)}</Text>
                </View>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Sementes</Text>
                  <Text style={styles.reportValue}>{formatCurrency(report.sementes)}</Text>
                </View>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Fertilizantes</Text>
                  <Text style={styles.reportValue}>{formatCurrency(report.fertilizantes)}</Text>
                </View>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Outros</Text>
                  <Text style={styles.reportValue}>{formatCurrency(report.outros)}</Text>
                </View>
                
                <View style={styles.reportTotal}>
                  <Text style={styles.reportTotalLabel}>Total do mês</Text>
                  <Text style={styles.reportTotalValue}>{formatCurrency(report.total)}</Text>
                </View>
              </View>
            )}

            {/* Opções */}
            <View style={{ marginVertical: 16 }}>
              <Text style={globalStyles.cardLabel}>Incluir no relatório:</Text>
              
              <TouchableOpacity 
                style={styles.checkRow}
                onPress={() => setOptions({ ...options, fotos: !options.fotos })}
              >
                <View style={[styles.checkbox, options.fotos && styles.checkboxChecked]}>
                  {options.fotos && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Fotos de visitas</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkRow}
                onPress={() => setOptions({ ...options, assinaturas: !options.assinaturas })}
              >
                <View style={[styles.checkbox, options.assinaturas && styles.checkboxChecked]}>
                  {options.assinaturas && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Assinaturas digitais</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkRow}
                onPress={() => setOptions({ ...options, pendencias: !options.pendencias })}
              >
                <View style={[styles.checkbox, options.pendencias && styles.checkboxChecked]}>
                  {options.pendencias && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Pendências e propostas abertas</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkRow}
                onPress={() => setOptions({ ...options, barter: !options.barter })}
              >
                <View style={[styles.checkbox, options.barter && styles.checkboxChecked]}>
                  {options.barter && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Cálculo de barter</Text>
              </TouchableOpacity>
            </View>

            {/* Botões de Exportação */}
            <Text style={globalStyles.cardLabel}>Exportar e enviar:</Text>
            <View style={styles.exportGrid}>
              <TouchableOpacity 
                style={styles.btnExport}
                onPress={() => handleExport('PDF')}
              >
                <Text style={styles.btnExportText}>📄 PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnExport}
                onPress={() => handleExport('Excel')}
              >
                <Text style={styles.btnExportText}>📊 Excel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btnExport, styles.btnWhatsApp]}
                onPress={() => handleExport('WhatsApp')}
              >
                <Text style={[styles.btnExportText, { color: Colors.white }]}>📲 WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btnExport, styles.btnEmail]}
                onPress={() => handleExport('E-mail')}
              >
                <Text style={[styles.btnExportText, { color: Colors.white }]}>📧 E-mail</Text>
              </TouchableOpacity>
            </View>
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
  loadingText: {
    textAlign: 'center',
    color: Colors.gray[500],
    fontSize: FontSizes.sm,
    paddingVertical: Spacing.lg,
  },
  reportBox: {
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    padding: 16,
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  reportLabel: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
  },
  reportValue: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[900],
    fontVariant: ['tabular-nums'],
  },
  reportTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: Colors.gray[300],
  },
  reportTotalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  reportTotalValue: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.green[700],
    fontVariant: ['tabular-nums'],
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.green[600],
    borderColor: Colors.green[600],
  },
  checkmark: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  checkLabel: {
    fontSize: FontSizes.base,
    color: Colors.gray[700],
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  btnExport: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 13,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWhatsApp: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  btnEmail: {
    backgroundColor: Colors.green[800],
    borderColor: Colors.green[800],
  },
  btnExportText: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[700],
  },
});
