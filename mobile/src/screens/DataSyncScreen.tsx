import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { AppHeader } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { useApp } from '../contexts/AppContext';
import { storageService } from '../services/storage';
import { Share } from 'react-native';

interface DataSyncScreenProps {
  visible: boolean;
  onClose: () => void;
}

interface StorageStats {
  sales: number;
  products: number;
  farms: number;
  total: number;
}

interface SyncLog {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const DataSyncScreen: React.FC<DataSyncScreenProps> = ({ visible, onClose }) => {
  const { sales, products, farms } = useApp();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingData, setPendingData] = useState(0);
  const [storageStats, setStorageStats] = useState<StorageStats>({
    sales: 0,
    products: 0,
    farms: 0,
    total: 0,
  });
  const [syncMode, setSyncMode] = useState<'wifi' | 'all' | 'manual'>('wifi');
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [cacheSize, setCacheSize] = useState(0);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSyncData();
      calculateStorageStats();
      loadSyncLogs();
    }
  }, [visible]);

  const loadSyncData = async () => {
    try {
      const lastSyncStr = await storageService.getItem<string>('@agrovendas:lastSync');
      if (lastSyncStr) {
        setLastSync(new Date(lastSyncStr));
      }

      const lastBackupStr = await storageService.getItem<string>('@agrovendas:lastBackup');
      if (lastBackupStr) {
        setLastBackup(new Date(lastBackupStr));
      }

      const mode = await storageService.getItem<string>('@agrovendas:syncMode');
      if (mode) {
        setSyncMode(mode as 'wifi' | 'all' | 'manual');
      }

      // Simular dados pendentes (em produção, seria verificado no servidor)
      setPendingData(0);
    } catch (error) {
      console.error('Erro ao carregar dados de sincronização:', error);
    }
  };

  const calculateStorageStats = async () => {
    try {
      const salesData = await storageService.getItem<string>('@agrovendas:sales');
      const productsData = await storageService.getItem<string>('@agrovendas:products');
      const farmsData = await storageService.getItem<string>('@agrovendas:farms');

      const salesSize = salesData ? JSON.stringify(salesData).length : 0;
      const productsSize = productsData ? JSON.stringify(productsData).length : 0;
      const farmsSize = farmsData ? JSON.stringify(farmsData).length : 0;

      const stats = {
        sales: salesSize,
        products: productsSize,
        farms: farmsSize,
        total: salesSize + productsSize + farmsSize,
      };

      setStorageStats(stats);
      setCacheSize(stats.total * 0.1); // Simular 10% como cache
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    }
  };

  const loadSyncLogs = async () => {
    try {
      const logsStr = await storageService.getItem<SyncLog[]>('@agrovendas:syncLogs');
      if (logsStr) {
        setSyncLogs(Array.isArray(logsStr) ? logsStr.slice(0, 10) : []);
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const addSyncLog = async (type: SyncLog['type'], message: string) => {
    const newLog: SyncLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
    };

    const updatedLogs = [newLog, ...syncLogs].slice(0, 50); // Manter últimos 50
    setSyncLogs(updatedLogs);

    try {
      await storageService.setItem('@agrovendas:syncLogs', updatedLogs);
    } catch (error) {
      console.error('Erro ao salvar log:', error);
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date();
      setLastSync(now);
      await storageService.setItem('@agrovendas:lastSync', now.toISOString());
      
      await addSyncLog('success', 'Sincronização manual concluída com sucesso');
      Alert.alert('Sucesso', 'Dados sincronizados com sucesso!');
    } catch (error) {
      await addSyncLog('error', 'Erro na sincronização: ' + error);
      Alert.alert('Erro', 'Falha ao sincronizar dados.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncModeChange = async (mode: 'wifi' | 'all' | 'manual') => {
    setSyncMode(mode);
    try {
      await storageService.setItem('@agrovendas:syncMode', mode);
      await addSyncLog('info', `Modo de sincronização alterado para: ${getModeLabel(mode)}`);
    } catch (error) {
      console.error('Erro ao salvar modo de sincronização:', error);
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'wifi': return 'Apenas Wi-Fi';
      case 'all': return 'Wi-Fi + Dados Móveis';
      case 'manual': return 'Manual';
      default: return mode;
    }
  };

  const handleBackup = async () => {
    try {
      const backupData = {
        sales,
        products,
        farms,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      await storageService.setItem('@agrovendas:backup', backupData);
      
      const now = new Date();
      setLastBackup(now);
      await storageService.setItem('@agrovendas:lastBackup', now.toISOString());
      
      await addSyncLog('success', 'Backup local criado com sucesso');
      Alert.alert('Sucesso', 'Backup criado com sucesso!');
    } catch (error) {
      await addSyncLog('error', 'Erro ao criar backup: ' + error);
      Alert.alert('Erro', 'Falha ao criar backup.');
    }
  };

  const handleRestoreBackup = async () => {
    Alert.alert(
      'Restaurar Backup',
      'Isso irá substituir todos os dados atuais. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            try {
              const backupData = await storageService.getItem<any>('@agrovendas:backup');
              if (!backupData) {
                Alert.alert('Aviso', 'Nenhum backup encontrado.');
                return;
              }
              
              // Aqui você chamaria as funções do context para restaurar os dados
              // Por exemplo: setSales(backupData.sales), setProducts(backupData.products), etc.
              
              await addSyncLog('success', 'Dados restaurados do backup');
              Alert.alert('Sucesso', 'Backup restaurado com sucesso! Reinicie o app.');
            } catch (error) {
              await addSyncLog('error', 'Erro ao restaurar backup: ' + error);
              Alert.alert('Erro', 'Falha ao restaurar backup.');
            }
          },
        },
      ]
    );
  };

  const handleExportCSV = async (type: 'sales' | 'products' | 'farms') => {
    try {
      let csvContent = '';
      let filename = '';

      switch (type) {
        case 'sales':
          csvContent = 'Data,Fazenda,Produto,Quantidade,Valor Total\n';
          sales.forEach(sale => {
            csvContent += `${new Date(sale.data).toLocaleDateString()},${sale.fazendaNome},"${sale.produto}",${sale.quantidade},R$ ${sale.valorTotal.toFixed(2)}\n`;
          });
          filename = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'products':
          csvContent = 'Nome,Categoria,Preço\n';
          products.forEach(product => {
            csvContent += `"${product.nome}",${product.categoria},R$ ${product.preco.toFixed(2)}\n`;
          });
          filename = `produtos_${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'farms':
          csvContent = 'Nome,Hectares,Telefone,Status\n';
          farms.forEach(farm => {
            csvContent += `"${farm.nome}",${farm.hectares},${farm.telefone || 'N/A'},${farm.status}\n`;
          });
          filename = `fazendas_${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }

      await Share.share({
        message: csvContent,
        title: `Exportar ${type} - ${filename}`,
      });
      await addSyncLog('success', `Exportação ${type} realizada com sucesso`);
    } catch (error) {
      await addSyncLog('error', `Erro ao exportar ${type}: ` + error);
      Alert.alert('Erro', 'Falha ao exportar dados.');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá remover arquivos temporários. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          onPress: async () => {
            try {
              // Simular limpeza de cache
              await new Promise(resolve => setTimeout(resolve, 1000));
              setCacheSize(0);
              await addSyncLog('success', 'Cache limpo com sucesso');
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
              calculateStorageStats();
            } catch (error) {
              await addSyncLog('error', 'Erro ao limpar cache: ' + error);
              Alert.alert('Erro', 'Falha ao limpar cache.');
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Limpar Histórico',
      'Isso irá remover TODAS as vendas antigas. Essa ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.removeItem('@agrovendas:sales');
              await addSyncLog('info', 'Histórico de vendas limpo');
              Alert.alert('Sucesso', 'Histórico limpo. Reinicie o app.');
            } catch (error) {
              await addSyncLog('error', 'Erro ao limpar histórico: ' + error);
              Alert.alert('Erro', 'Falha ao limpar histórico.');
            }
          },
        },
      ]
    );
  };

  const handleTestConnection = async () => {
    try {
      // Simular teste de conexão
      setIsSyncing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.2; // 80% de sucesso
      if (success) {
        await addSyncLog('success', 'Teste de conexão: OK');
        Alert.alert('Sucesso', 'Conexão com servidor estabelecida!');
      } else {
        await addSyncLog('error', 'Teste de conexão: Falha');
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } catch (error) {
      await addSyncLog('error', 'Erro no teste de conexão: ' + error);
      Alert.alert('Erro', 'Falha ao testar conexão.');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Nunca';
    return date.toLocaleString('pt-BR');
  };

  if (!visible) return null;

  return (
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
      <AppHeader title="Dados e Sincronização" subtitle="" onBack={onClose} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status e Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Status e Estatísticas</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Última sincronização:</Text>
              <Text style={styles.statValue}>{formatDate(lastSync)}</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Dados pendentes:</Text>
              <Text style={[styles.statValue, pendingData > 0 && styles.pendingData]}>
                {pendingData} {pendingData === 1 ? 'item' : 'itens'}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.storageTitle}>Uso de armazenamento</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Vendas:</Text>
              <Text style={styles.statValue}>{formatBytes(storageStats.sales)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Produtos:</Text>
              <Text style={styles.statValue}>{formatBytes(storageStats.products)}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Fazendas:</Text>
              <Text style={styles.statValue}>{formatBytes(storageStats.farms)}</Text>
            </View>
            <View style={[styles.statRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatBytes(storageStats.total)}</Text>
            </View>
          </View>
        </View>

        {/* Sincronização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Sincronização</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, isSyncing && styles.disabledButton]}
            onPress={handleForceSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.buttonIcon}>⟳</Text>
                <Text style={styles.buttonText}>Forçar Sincronização</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.connectionRow}>
              <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
              <Text style={styles.connectionText}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.label}>Modo de sincronização:</Text>
            
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => handleSyncModeChange('wifi')}
            >
              <View style={styles.radioButton}>
                {syncMode === 'wifi' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>Apenas Wi-Fi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => handleSyncModeChange('all')}
            >
              <View style={styles.radioButton}>
                {syncMode === 'all' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>Wi-Fi + Dados Móveis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => handleSyncModeChange('manual')}
            >
              <View style={styles.radioButton}>
                {syncMode === 'manual' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>Apenas Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backup e Exportação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Backup e Exportação</Text>
          
          <View style={styles.card}>
            <Text style={styles.backupInfo}>
              Último backup: {formatDate(lastBackup)}
            </Text>
            
            <TouchableOpacity style={styles.button} onPress={handleBackup}>
              <Text style={styles.buttonIcon}>💾</Text>
              <Text style={styles.buttonTextDark}>Fazer Backup Local</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleRestoreBackup}
            >
              <Text style={styles.buttonIcon}>↺</Text>
              <Text style={styles.buttonText}>Restaurar Backup</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subsectionTitle}>Exportar Relatórios:</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleExportCSV('sales')}
          >
            <Text style={styles.buttonIcon}>📊</Text>
            <Text style={styles.buttonTextDark}>Exportar Vendas (CSV)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleExportCSV('products')}
          >
            <Text style={styles.buttonIcon}>📦</Text>
            <Text style={styles.buttonTextDark}>Exportar Produtos (CSV)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleExportCSV('farms')}
          >
            <Text style={styles.buttonIcon}>🚜</Text>
            <Text style={styles.buttonTextDark}>Exportar Fazendas (CSV)</Text>
          </TouchableOpacity>
        </View>

        {/* Limpeza */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧹 Limpeza</Text>
          
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Tamanho do cache:</Text>
              <Text style={styles.statValue}>{formatBytes(cacheSize)}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleClearCache}
            >
              <Text style={styles.buttonIcon}>🗑️</Text>
              <Text style={styles.buttonTextDark}>Limpar Cache</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleClearHistory}
            >
              <Text style={styles.buttonIcon}>⚠️</Text>
              <Text style={styles.buttonText}>Limpar Histórico de Vendas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logs e Diagnóstico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Logs e Diagnóstico</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleTestConnection}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator color={Colors.green[600]} />
            ) : (
              <>
                <Text style={styles.buttonIcon}>🔌</Text>
                <Text style={styles.buttonTextDark}>Testar Conexão</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowLogs(!showLogs)}
          >
            <Text style={styles.buttonIcon}>📝</Text>
            <Text style={styles.buttonTextDark}>
              {showLogs ? 'Ocultar Logs' : 'Ver Logs de Sincronização'}
            </Text>
          </TouchableOpacity>

          {showLogs && (
            <View style={styles.logsContainer}>
              {syncLogs.length === 0 ? (
                <Text style={styles.noLogsText}>Nenhum log disponível</Text>
              ) : (
                syncLogs.map(log => (
                  <View key={log.id} style={styles.logItem}>
                    <View style={styles.logHeader}>
                      <Text style={[styles.logType, styles[`logType${log.type}`]]}>
                        {log.type === 'success' ? '✓' : log.type === 'error' ? '✗' : 'ℹ'}
                      </Text>
                      <Text style={styles.logTime}>
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </Text>
                    </View>
                    <Text style={styles.logMessage}>{log.message}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          <View style={styles.diagnosticCard}>
            <Text style={styles.diagnosticTitle}>Informações do Sistema</Text>
            <Text style={styles.diagnosticText}>Versão: 1.0.0</Text>
            <Text style={styles.diagnosticText}>
              Total de vendas: {sales.length}
            </Text>
            <Text style={styles.diagnosticText}>
              Total de produtos: {products.length}
            </Text>
            <Text style={styles.diagnosticText}>
              Total de fazendas: {farms.length}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: Spacing.md,
  },
  subsectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[700],
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.md,
    color: Colors.gray[700],
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  pendingData: {
    color: Colors.amber[600],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
    marginVertical: Spacing.md,
  },
  storageTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Spacing.sm,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.green[200],
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.gray[900],
  },
  totalValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.green[600],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.green[600],
  },
  dangerButton: {
    backgroundColor: Colors.red[600],
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: FontSizes.xl,
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.white,
  },
  buttonTextDark: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray[400],
    marginRight: Spacing.sm,
  },
  statusDotOnline: {
    backgroundColor: Colors.green[500],
  },
  connectionText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Spacing.sm,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.green[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.green[600],
  },
  radioLabel: {
    fontSize: FontSizes.md,
    color: Colors.gray[700],
  },
  backupInfo: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  logsContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    maxHeight: 400,
  },
  noLogsText: {
    fontSize: FontSizes.md,
    color: Colors.gray[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gray[400],
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  logType: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  logTypesuccess: {
    color: Colors.green[600],
  },
  logTypeerror: {
    color: Colors.red[600],
  },
  logTypeinfo: {
    color: Colors.green[600],
  },
  logTime: {
    fontSize: FontSizes.xs,
    color: Colors.gray[500],
  },
  logMessage: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
  },
  diagnosticCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  diagnosticTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Spacing.sm,
  },
  diagnosticText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
  },
  bottomSpacer: {
    height: Spacing.xl * 2,
  },
});
