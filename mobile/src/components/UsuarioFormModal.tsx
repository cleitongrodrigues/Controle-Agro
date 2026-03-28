import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Usuario, UsuarioNivel } from '../types';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';

interface UsuarioFormModalProps {
  visible: boolean;
  usuario?: Usuario | null;
  onSave: (usuario: Usuario) => void;
  onCancel: () => void;
}

export const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({
  visible,
  usuario,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [nivel, setNivel] = useState<UsuarioNivel>('vendedor');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTelefone(usuario.telefone || '');
      setCargo(usuario.cargo || '');
      setNivel(usuario.nivel);
      setAtivo(usuario.ativo);
    } else {
      setNome('');
      setEmail('');
      setTelefone('');
      setCargo('');
      setNivel('vendedor');
      setAtivo(true);
    }
  }, [usuario, visible]);

  const handleSave = () => {
    if (!nome.trim() || !email.trim()) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const novoUsuario: Usuario = {
      id: usuario?.id || Date.now().toString(),
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim() || undefined,
      cargo: cargo.trim() || undefined,
      nivel,
      ativo,
    };

    onSave(novoUsuario);
  };

  const niveis: { value: UsuarioNivel; label: string }[] = [
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'admin', label: 'Administrador' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </Text>

          <ScrollView style={styles.form}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nome <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome completo"
                placeholderTextColor={Colors.gray[300]}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@exemplo.com"
                placeholderTextColor={Colors.gray[300]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Telefone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                placeholder="(11) 99999-9999"
                placeholderTextColor={Colors.gray[300]}
                keyboardType="phone-pad"
              />
            </View>

            {/* Cargo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cargo</Text>
              <TextInput
                style={styles.input}
                value={cargo}
                onChangeText={setCargo}
                placeholder="Ex: Vendedor Pleno"
                placeholderTextColor={Colors.gray[300]}
              />
            </View>

            {/* Nível de Acesso */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nível de Acesso <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.nivelContainer}>
                {niveis.map((n) => (
                  <TouchableOpacity
                    key={n.value}
                    style={[
                      styles.nivelButton,
                      nivel === n.value && styles.nivelButtonActive,
                    ]}
                    onPress={() => setNivel(n.value)}
                  >
                    <Text
                      style={[
                        styles.nivelButtonText,
                        nivel === n.value && styles.nivelButtonTextActive,
                      ]}
                    >
                      {n.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ativo */}
            <View style={styles.inputGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Usuário Ativo</Text>
                <Switch
                  value={ativo}
                  onValueChange={setAtivo}
                  trackColor={{ false: Colors.gray[100], true: Colors.green[600] }}
                  thumbColor={ativo ? Colors.white : Colors.white}
                />
              </View>
            </View>
          </ScrollView>

          {/* Ações */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.gray[900],
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  form: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.red[600],
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.gray[900],
  },
  nivelContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  nivelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  nivelButtonActive: {
    backgroundColor: Colors.green[600],
    borderColor: Colors.green[600],
  },
  nivelButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    fontWeight: '600',
  },
  nivelButtonTextActive: {
    color: Colors.white,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.green[600],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.white,
  },
});
