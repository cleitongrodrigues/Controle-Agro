import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  AppHeader,
  ConfirmModal,
  SearchBar,
  UsuarioFormModal,
} from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Usuario } from '../types';

interface UsuarioListScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const UsuarioListScreen: React.FC<UsuarioListScreenProps> = ({
  visible,
  onClose,
}) => {
  const { usuarios = [], addUsuario, updateUsuario, deleteUsuario } = useApp();
  const { showToast } = useToast();

  const [formVisible, setFormVisible] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Usuario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddUsuario = () => {
    setEditingUsuario(null);
    setFormVisible(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormVisible(true);
  };

  const handleSaveUsuario = async (usuario: Usuario) => {
    try {
      if (editingUsuario) {
        await updateUsuario(usuario.id, usuario);
        showToast('Usuário atualizado com sucesso!', 'success');
      } else {
        await addUsuario(usuario);
        showToast('Usuário cadastrado com sucesso!', 'success');
      }
      setFormVisible(false);
      setEditingUsuario(null);
    } catch (error) {
      showToast('Erro ao salvar usuário', 'error');
    }
  };

  const confirmDeleteUsuario = (usuario: Usuario) => {
    setDeleteConfirm(usuario);
  };

  const handleDeleteUsuario = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUsuario(deleteConfirm.id);
      showToast('Usuário removido com sucesso!', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast('Erro ao remover usuário', 'error');
    }
  };

  const filteredUsuarios = useMemo(() => {
    if (!searchQuery) return usuarios;
    const query = searchQuery.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.cargo?.toLowerCase().includes(query)
    );
  }, [usuarios, searchQuery]);

  const getNivelLabel = (nivel: Usuario['nivel']) => {
    const labels = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      vendedor: 'Vendedor',
    };
    return labels[nivel];
  };

  const getNivelColor = (nivel: Usuario['nivel']) => {
    const colors = {
      admin: Colors.red[600],
      supervisor: Colors.amber[600],
      vendedor: Colors.green[600],
    };
    return colors[nivel];
  };

  if (!visible) return null;

  return (
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
      <AppHeader
        title="Controle de Usuários"
        subtitle="Gerencie vendedores e permissões"
        onBack={onClose}
      />

      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          {/* Cabeçalho com botão de novo usuário */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddUsuario}
            >
              <Text style={styles.addButtonText}>➕ Novo Usuário</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de busca */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por nome, email ou cargo..."
            />
          </View>

          {/* Lista de usuários */}
          {filteredUsuarios.length === 0 ? (
            <View style={globalStyles.card}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'Nenhum usuário encontrado'
                  : 'Nenhum usuário cadastrado'}
              </Text>
            </View>
          ) : (
              filteredUsuarios.map((usuario) => (
              <View key={usuario.id} style={styles.usuarioCard}>
                <View style={styles.usuarioHeader}>
                  <View style={styles.usuarioTitleRow}>
                    <Text style={styles.usuarioNome}>{usuario.nome}</Text>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getNivelColor(usuario.nivel) },
                      ]}
                    >
                      <Text style={styles.badgeText}>
                        {getNivelLabel(usuario.nivel)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.usuarioBody}>
                  <View style={styles.usuarioDetailRow}>
                    <Text style={styles.usuarioIcon}>📧</Text>
                    <Text style={styles.usuarioDetail}>{usuario.email}</Text>
                  </View>
                  {usuario.telefone && (
                    <View style={styles.usuarioDetailRow}>
                      <Text style={styles.usuarioIcon}>📱</Text>
                      <Text style={styles.usuarioDetail}>{usuario.telefone}</Text>
                    </View>
                  )}
                  {usuario.cargo && (
                    <View style={styles.usuarioDetailRow}>
                      <Text style={styles.usuarioIcon}>💼</Text>
                      <Text style={styles.usuarioDetail}>{usuario.cargo}</Text>
                    </View>
                  )}
                  {!usuario.ativo && (
                    <View style={styles.inativoTag}>
                      <Text style={styles.inativoText}>🔒 Inativo</Text>
                    </View>
                  )}
                </View>

                <View style={styles.usuarioFooter}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUsuario(usuario)}
                  >
                    <Text style={styles.editButtonIcon}>✏️</Text>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDeleteUsuario(usuario)}
                  >
                    <Text style={styles.deleteButtonIcon}>🗑️</Text>
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal de formulário */}
      <UsuarioFormModal
        visible={formVisible}
        usuario={editingUsuario}
        onSave={handleSaveUsuario}
        onCancel={() => {
          setFormVisible(false);
          setEditingUsuario(null);
        }}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        visible={!!deleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja remover o usuário "${deleteConfirm?.nome}"?`}
        onConfirm={handleDeleteUsuario}
        onCancel={() => setDeleteConfirm(null)}
      />
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
    backgroundColor: Colors.white,
    zIndex: 1000,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.green[600],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.gray[700],
    fontSize: FontSizes.md,
  },
  usuarioCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  usuarioHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  usuarioTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usuarioNome: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.gray[900],
    flex: 1,
    marginRight: Spacing.sm,
  },
  usuarioBody: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  usuarioDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  usuarioIcon: {
    fontSize: 16,
    width: 24,
  },
  usuarioDetail: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  inativoTag: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.red[600] + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  inativoText: {
    color: Colors.red[600],
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  usuarioFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.xs,
    borderRightWidth: 1,
    borderRightColor: Colors.gray[100],
  },
  editButtonIcon: {
    fontSize: 16,
  },
  editButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  deleteButtonIcon: {
    fontSize: 16,
  },
  deleteButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.red[600],
  },
});
