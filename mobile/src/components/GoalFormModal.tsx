// ══════════════════════════════════════════════════════════
// GOAL FORM MODAL - Formulário de Meta
// ══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Goal, GoalTipoFiltro } from '../types';
import { generateId, parseDecimal, sanitizeDecimalInput, formatDateISO } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import { ProductPickerModal } from './ProductPickerModal';

interface GoalFormModalProps {
  visible: boolean;
  goal?: Goal | null;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

const CATEGORIAS: { label: string; value: string }[] = [
  { label: 'Herbicida', value: 'herbicida' },
  { label: 'Semente', value: 'semente' },
  { label: 'Fertilizante', value: 'fertilizante' },
  { label: 'Fungicida', value: 'fungicida' },
  { label: 'Outro', value: 'outro' },
];

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  visible,
  goal,
  onSave,
  onCancel,
}) => {
  const { products } = useApp();

  const [nome, setNome] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<GoalTipoFiltro>('geral');
  const [categoria, setCategoria] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [produtoNome, setProdutoNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productModalVisible, setProductModalVisible] = useState(false);

  useEffect(() => {
    if (goal) {
      setNome(goal.nome);
      setValorMeta(sanitizeDecimalInput(goal.valorMeta.toString()));
      setTipoFiltro(goal.tipoFiltro ?? 'geral');
      setCategoria(goal.categoria || '');
      setProdutoId(goal.produtoId || '');
      setProdutoNome(goal.produtoNome || '');
      setDataInicio(goal.dataInicio || '');
      setDataFim(goal.dataFim || '');
      setAtivo(goal.ativo);
    } else {
      resetForm();
    }
  }, [goal, visible]);

  const resetForm = () => {
    setNome('');
    setValorMeta('');
    setTipoFiltro('geral');
    setCategoria('');
    setProdutoId('');
    setProdutoNome('');
    setDataInicio('');
    setDataFim('');
    setAtivo(true);
    setErrors({});
  };

  const formatDateInput = (value: string): string => {
    // Formata enquanto digita: DD/MM/AAAA
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const parseDateInput = (value: string): string | undefined => {
    // Converte DD/MM/AAAA → AAAA-MM-DD para salvar
    const parts = value.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return undefined;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';

    const valor = parseDecimal(valorMeta);
    if (!valorMeta || valor <= 0) newErrors.valorMeta = 'Valor deve ser maior que zero';

    if (tipoFiltro === 'categoria' && !categoria) newErrors.categoria = 'Selecione uma categoria';
    if (tipoFiltro === 'produto' && !produtoId) newErrors.produto = 'Selecione um produto';

    if (dataInicio && !parseDateInput(dataInicio)) newErrors.dataInicio = 'Data inválida (DD/MM/AAAA)';
    if (dataFim && !parseDateInput(dataFim)) newErrors.dataFim = 'Data inválida (DD/MM/AAAA)';
    if (dataInicio && dataFim) {
      const ini = parseDateInput(dataInicio);
      const fim = parseDateInput(dataFim);
      if (ini && fim && fim <= ini) newErrors.dataFim = 'Data fim deve ser após a data início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const goalData: Goal = {
      id: goal?.id || generateId(),
      nome: nome.trim(),
      valorMeta: parseDecimal(valorMeta),
      tipoFiltro,
      categoria: tipoFiltro === 'categoria' ? categoria : undefined,
      produtoId: tipoFiltro === 'produto' ? produtoId : undefined,
      produtoNome: tipoFiltro === 'produto' ? produtoNome : undefined,
      dataInicio: parseDateInput(dataInicio),
      dataFim: parseDateInput(dataFim),
      ativo,
    };

    onSave(goalData);
    resetForm();
    onCancel();
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ScrollView style={styles.content}>
            <Text style={styles.title}>{goal ? 'Editar Meta' : 'Nova Meta'}</Text>
            <Text style={styles.subtitle}>
              {goal ? 'Altere os dados da meta' : 'Defina uma nova meta de vendas'}
            </Text>

            {/* Nome */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome da meta *</Text>
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                value={nome}
                onChangeText={t => { setNome(t); setErrors(prev => ({ ...prev, nome: '' })); }}
                placeholder="Ex: Herbicidas do mês"
                placeholderTextColor={Colors.gray[400]}
              />
              {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
            </View>

            {/* Valor da meta */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Valor da meta (R$) *</Text>
              <TextInput
                style={[styles.input, errors.valorMeta && styles.inputError]}
                value={valorMeta}
                onChangeText={t => { setValorMeta(sanitizeDecimalInput(t)); setErrors(prev => ({ ...prev, valorMeta: '' })); }}
                placeholder="18000"
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.gray[400]}
              />
              {errors.valorMeta ? <Text style={styles.errorText}>{errors.valorMeta}</Text> : null}
            </View>

            {/* Tipo de filtro */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rastrear vendas de</Text>
              <View style={styles.tipoRow}>
                {(['geral', 'categoria', 'produto'] as GoalTipoFiltro[]).map(tipo => (
                  <TouchableOpacity
                    key={tipo}
                    style={[styles.tipoBtn, tipoFiltro === tipo && styles.tipoBtnActive]}
                    onPress={() => {
                      setTipoFiltro(tipo);
                      setErrors(prev => ({ ...prev, categoria: '', produto: '' }));
                    }}
                  >
                    <Text style={[styles.tipoBtnText, tipoFiltro === tipo && styles.tipoBtnTextActive]}>
                      {tipo === 'geral' ? 'Todos os produtos' : tipo === 'categoria' ? 'Por categoria' : 'Produto específico'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categoria — só aparece quando tipoFiltro === 'categoria' */}
            {tipoFiltro === 'categoria' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Categoria *</Text>
                <View style={styles.categoriaRow}>
                  {CATEGORIAS.map(cat => (
                    <TouchableOpacity
                      key={cat.value}
                      style={[styles.catBtn, categoria === cat.value && styles.catBtnActive]}
                      onPress={() => { setCategoria(cat.value); setErrors(prev => ({ ...prev, categoria: '' })); }}
                    >
                      <Text style={[styles.catBtnText, categoria === cat.value && styles.catBtnTextActive]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}
              </View>
            )}

            {/* Produto específico — só aparece quando tipoFiltro === 'produto' */}
            {tipoFiltro === 'produto' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Produto *</Text>
                <TouchableOpacity
                  style={[styles.selectorBtn, errors.produto && styles.inputError]}
                  onPress={() => setProductModalVisible(true)}
                >
                  <Text style={produtoId ? styles.selectorBtnText : styles.selectorBtnPlaceholder}>
                    {produtoNome || 'Selecionar produto...'}
                  </Text>
                  <Text style={styles.selectorIcon}>›</Text>
                </TouchableOpacity>
                {errors.produto ? <Text style={styles.errorText}>{errors.produto}</Text> : null}
              </View>
            )}

            {/* Período */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Período de apuração (opcional)</Text>
              <Text style={styles.helpText}>Se não informado, considera o mês atual</Text>
              <View style={styles.periodoRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>Início</Text>
                  <TextInput
                    style={[styles.input, errors.dataInicio && styles.inputError]}
                    value={dataInicio}
                    onChangeText={t => { setDataInicio(formatDateInput(t)); setErrors(prev => ({ ...prev, dataInicio: '' })); }}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray[400]}
                  />
                  {errors.dataInicio ? <Text style={styles.errorText}>{errors.dataInicio}</Text> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>Fim</Text>
                  <TextInput
                    style={[styles.input, errors.dataFim && styles.inputError]}
                    value={dataFim}
                    onChangeText={t => { setDataFim(formatDateInput(t)); setErrors(prev => ({ ...prev, dataFim: '' })); }}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray[400]}
                  />
                  {errors.dataFim ? <Text style={styles.errorText}>{errors.dataFim}</Text> : null}
                </View>
              </View>
            </View>

            {/* Status */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusOptions}>
                <TouchableOpacity
                  style={[styles.statusButton, ativo && styles.statusButtonActive]}
                  onPress={() => setAtivo(true)}
                >
                  <Text style={[styles.statusButtonText, ativo && styles.statusButtonTextActive]}>Ativa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusButton, !ativo && styles.statusButtonActive]}
                  onPress={() => setAtivo(false)}
                >
                  <Text style={[styles.statusButtonText, !ativo && styles.statusButtonTextActive]}>Inativa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botões */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleClose}>
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSave}>
                <Text style={styles.buttonPrimaryText}>{goal ? 'Salvar' : 'Criar meta'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <ProductPickerModal
        visible={productModalVisible}
        products={products}
        onSelect={p => {
          setProdutoId(p.id);
          setProdutoNome(p.nome);
          setErrors(prev => ({ ...prev, produto: '' }));
          setProductModalVisible(false);
        }}
        onClose={() => setProductModalVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    ...Shadows.lg,
  },
  content: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginBottom: Spacing.xl,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
  },
  subLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.gray[500],
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.red[600],
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.red[600],
    marginTop: 4,
  },
  helpText: {
    fontSize: FontSizes.xs,
    color: Colors.gray[500],
    marginBottom: Spacing.sm,
  },
  tipoRow: {
    gap: Spacing.xs,
  },
  tipoBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginBottom: 4,
  },
  tipoBtnActive: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.green[50],
  },
  tipoBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  tipoBtnTextActive: {
    color: Colors.green[800],
    fontWeight: '600',
  },
  categoriaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  catBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
  },
  catBtnActive: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.green[50],
  },
  catBtnText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    fontWeight: '500',
  },
  catBtnTextActive: {
    color: Colors.green[800],
    fontWeight: '600',
  },
  selectorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    backgroundColor: Colors.white,
  },
  selectorBtnText: {
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    flex: 1,
  },
  selectorBtnPlaceholder: {
    fontSize: FontSizes.base,
    color: Colors.gray[400],
    flex: 1,
  },
  selectorIcon: {
    fontSize: 20,
    color: Colors.gray[400],
    fontWeight: '300',
  },
  periodoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.green[50],
  },
  statusButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  statusButtonTextActive: {
    color: Colors.green[800],
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.gray[100],
  },
  buttonPrimary: {
    backgroundColor: Colors.green[700],
  },
  buttonSecondaryText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  buttonPrimaryText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.white,
  },
});

