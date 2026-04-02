// ----------------------------------------------------------
// APP CONTEXT - GERENCIAMENTO DE ESTADO
// ----------------------------------------------------------

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Sale, Farm, Product, Goal, Usuario, Pedido, ItemPedido } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

// -- Mappers snake_case ? camelCase ---------------------

function farmFromApi(r: any): Farm {
  return {
    id: r.id,
    nome: r.nome,
    proprietario: r.proprietario,
    hectares: Number(r.hectares),
    localizacao: r.localizacao,
    telefone: r.telefone,
    status: r.status,
    latitude: r.latitude != null ? Number(r.latitude) : undefined,
    longitude: r.longitude != null ? Number(r.longitude) : undefined,
  };
}

function itemPedidoFromApi(r: any, pedidoId: string): ItemPedido {
  return {
    id: r.id,
    pedidoId,
    produtoId: r.produto_id ?? '',
    produto: r.produto,
    categoria: r.categoria ?? '',
    quantidade: Number(r.quantidade),
    valorUnitario: Number(r.valor_unitario),
    valorTotal: Number(r.valor_total),
    desconto: r.desconto != null ? Number(r.desconto) : undefined,
    descontoTipo: r.desconto_tipo ?? undefined,
    valorComDesconto: r.valor_com_desconto != null ? Number(r.valor_com_desconto) : undefined,
  };
}

function pedidoFromApi(r: any): Pedido {
  return {
    id: r.id,
    fazendaId: r.fazenda_id,
    fazendaNome: r.fazenda_nome,
    itens: (r.itens ?? []).map((item: any) => itemPedidoFromApi(item, r.id)),
    valorTotal: Number(r.valor_total),
    desconto: r.desconto != null ? Number(r.desconto) : undefined,
    descontoTipo: r.desconto_tipo ?? undefined,
    valorFinal: r.valor_final != null ? Number(r.valor_final) : undefined,
    data: r.data,
    sincronizado: r.sincronizado ?? true,
  };
}

function pedidoToApi(p: Omit<Pedido, 'id' | 'sincronizado'> & Partial<Pick<Pedido, 'id' | 'sincronizado'>> & { itens: Omit<ItemPedido, 'id' | 'pedidoId'>[] }) {
  return {
    fazenda_id: p.fazendaId,
    fazenda_nome: p.fazendaNome,
    valor_total: p.valorTotal,
    desconto: p.desconto ?? null,
    desconto_tipo: p.descontoTipo ?? null,
    valor_final: p.valorFinal ?? null,
    data: p.data,
    sincronizado: p.sincronizado ?? false,
    itens: p.itens.map(item => ({
      produto_id: item.produtoId || null,
      produto: item.produto,
      categoria: item.categoria || null,
      quantidade: item.quantidade,
      valor_unitario: item.valorUnitario,
      valor_total: item.valorTotal,
      desconto: item.desconto ?? null,
      desconto_tipo: item.descontoTipo ?? null,
      valor_com_desconto: item.valorComDesconto ?? null,
    })),
  };
}

function goalFromApi(r: any): Goal {
  return {
    id: r.id,
    nome: r.nome,
    valorMeta: Number(r.valor_meta),
    tipoFiltro: r.tipo_filtro ?? 'geral',
    categoria: r.categoria ?? undefined,
    produtoId: r.produto_id ?? undefined,
    produtoNome: r.produto_nome ?? undefined,
    dataInicio: r.data_inicio ?? undefined,
    dataFim: r.data_fim ?? undefined,
    ativo: r.ativo,
  };
}

function goalToApi(g: Omit<Goal, 'id'>) {
  return {
    nome: g.nome,
    valor_meta: g.valorMeta,
    tipo_filtro: g.tipoFiltro,
    categoria: g.categoria ?? null,
    produto_id: g.produtoId ?? null,
    produto_nome: g.produtoNome ?? null,
    data_inicio: g.dataInicio ?? null,
    data_fim: g.dataFim ?? null,
    ativo: g.ativo,
  };
}

function farmToApi(f: Omit<Farm, 'id'>) {
  return {
    nome: f.nome,
    proprietario: f.proprietario,
    hectares: f.hectares,
    localizacao: f.localizacao,
    telefone: f.telefone,
    status: f.status,
    latitude: f.latitude,
    longitude: f.longitude,
  };
}

function productFromApi(r: any): Product {
  return {
    id: r.id,
    nome: r.nome,
    preco: Number(r.preco),
    categoria: r.categoria,
    ativo: r.ativo ?? true,
  };
}

// -- Interface do contexto -------------------------------

type NewPedidoPayload = Omit<Pedido, 'id' | 'sincronizado'> & { itens: Omit<ItemPedido, 'id' | 'pedidoId'>[] };

interface AppContextData {
  pedidos: Pedido[];
  sales: Sale[];  // derived from pedidos — for backward compat
  farms: Farm[];
  products: Product[];
  goals: Goal[];
  usuarios: Usuario[];
  addPedido: (pedido: NewPedidoPayload) => Promise<void>;
  updatePedido: (id: string, pedido: NewPedidoPayload) => Promise<void>;
  deletePedido: (id: string) => Promise<void>;
  addFarm: (farm: Omit<Farm, 'id'>) => Promise<void>;
  updateFarm: (id: string, farm: Farm) => Promise<void>;
  deleteFarm: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addUsuario: (usuario: Omit<Usuario, 'id'> & { senha: string }) => Promise<void>;
  updateUsuario: (id: string, usuario: Partial<Usuario> & { senha?: string }) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
  loading: boolean;
  recarregar: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega dados quando autenticado, limpa quando deslogado
  useEffect(() => {
    if (isAuthenticated) {
      recarregar();
    } else {
      setPedidos([]);
      setFarms([]);
      setProducts([]);
      setGoals([]);
      setUsuarios([]);
    }
  }, [isAuthenticated]);

  async function recarregar() {
    try {
      setLoading(true);
      const [resPedidos, resFazendas, resProdutos, resMetas, resUsuarios] = await Promise.all([
        api.get<{ dados: any[] }>('/pedidos'),
        api.get<{ dados: any[] }>('/fazendas'),
        api.get<{ dados: any[] }>('/produtos'),
        api.get<{ dados: any[] }>('/metas'),
        api.get<{ dados: any[] }>('/usuarios'),
      ]);
      setPedidos(resPedidos.dados.map(pedidoFromApi));
      setFarms(resFazendas.dados.map(farmFromApi));
      setProducts(resProdutos.dados.map(productFromApi));
      setGoals(resMetas.dados.map(goalFromApi));
      setUsuarios(resUsuarios.dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  // -- Pedidos --------------------------------------------

  const sales: Sale[] = useMemo(() =>
    pedidos.flatMap(p =>
      p.itens.map(item => ({
        id: item.id,
        fazendaId: p.fazendaId,
        fazendaNome: p.fazendaNome,
        produto: item.produto,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
        data: p.data,
        sincronizado: p.sincronizado,
      } as Sale))
    ),
    [pedidos]
  );

  const addPedido = async (pedido: NewPedidoPayload) => {
    const res = await api.post<{ dados: any }>('/pedidos', pedidoToApi(pedido));
    setPedidos(prev => [pedidoFromApi(res.dados), ...prev]);
  };

  const updatePedido = async (id: string, pedido: NewPedidoPayload) => {
    const res = await api.put<{ dados: any }>(`/pedidos/${id}`, pedidoToApi(pedido));
    setPedidos(prev => prev.map(p => p.id === id ? pedidoFromApi(res.dados) : p));
  };

  const deletePedido = async (id: string) => {
    await api.delete(`/pedidos/${id}`);
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  // -- Fazendas -------------------------------------------

  const addFarm = async (farm: Omit<Farm, 'id'>) => {
    const res = await api.post<{ dados: any }>('/fazendas', farmToApi(farm));
    setFarms(prev => [farmFromApi(res.dados), ...prev]);
  };

  const updateFarm = async (id: string, farm: Farm) => {
    const res = await api.put<{ dados: any }>(`/fazendas/${id}`, farmToApi(farm));
    setFarms(prev => prev.map(f => f.id === id ? farmFromApi(res.dados) : f));
  };

  const deleteFarm = async (id: string) => {
    await api.delete(`/fazendas/${id}`);
    setFarms(prev => prev.filter(f => f.id !== id));
  };

  // -- Produtos -------------------------------------------

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const res = await api.post<{ dados: any }>('/produtos', {
      nome: product.nome,
      preco: product.preco,
      categoria: product.categoria,
      ativo: product.ativo ?? true,
    });
    setProducts(prev => [productFromApi(res.dados), ...prev]);
  };

  const updateProduct = async (id: string, product: Product) => {
    const res = await api.put<{ dados: any }>(`/produtos/${id}`, {
      nome: product.nome,
      preco: product.preco,
      categoria: product.categoria,
      ativo: product.ativo ?? true,
    });
    setProducts(prev => prev.map(p => p.id === id ? productFromApi(res.dados) : p));
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/produtos/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // -- Metas ----------------------------------------------

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    const res = await api.post<{ dados: any }>('/metas', goalToApi(goal));
    setGoals(prev => [goalFromApi(res.dados), ...prev]);
  };

  const updateGoal = async (id: string, goal: Goal) => {
    const res = await api.put<{ dados: any }>(`/metas/${id}`, goalToApi(goal));
    setGoals(prev => prev.map(g => g.id === id ? goalFromApi(res.dados) : g));
  };

  const deleteGoal = async (id: string) => {
    await api.delete(`/metas/${id}`);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // -- Usu�rios -------------------------------------------

  const addUsuario = async (usuario: Omit<Usuario, 'id'> & { senha: string }) => {
    const res = await api.post<{ dados: any }>('/usuarios', usuario);
    setUsuarios(prev => [res.dados, ...prev]);
  };

  const updateUsuario = async (id: string, usuario: Partial<Usuario> & { senha?: string }) => {
    const res = await api.put<{ dados: any }>(`/usuarios/${id}`, usuario);
    setUsuarios(prev => prev.map(u => u.id === id ? res.dados : u));
  };

  const deleteUsuario = async (id: string) => {
    await api.delete(`/usuarios/${id}`);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider value={{
      pedidos, sales, farms, products, goals, usuarios,
      addPedido, updatePedido, deletePedido,
      addFarm, updateFarm, deleteFarm,
      addProduct, updateProduct, deleteProduct,
      addGoal, updateGoal, deleteGoal,
      addUsuario, updateUsuario, deleteUsuario,
      loading,
      recarregar,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
