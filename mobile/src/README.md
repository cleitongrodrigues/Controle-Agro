# 📱 AgroVendas - Estrutura do Projeto

## 📂 Estrutura de Pastas

```
mobile/src/
├── components/          # Componentes reutilizáveis
│   ├── AppHeader.tsx       # Cabeçalho do app com avatar e status offline
│   ├── MetricCard.tsx      # Card de métricas (visitas, pendências)
│   ├── FarmItem.tsx        # Item da lista de fazendas
│   ├── SaleItem.tsx        # Item da lista de vendas
│   ├── GoalProgress.tsx    # Barra de progresso de metas
│   ├── BarterCard.tsx      # Card de equivalência em sacas de soja
│   └── index.ts            # Exportações
│
├── screens/             # Telas principais do app
│   ├── MapaScreen.tsx      # Tela de mapa com rotas e fazendas
│   ├── VendasScreen.tsx    # Tela de registro de vendas
│   ├── RelatorioScreen.tsx # Tela de relatórios mensais
│   ├── MetasScreen.tsx     # Tela de metas e comissões
│   └── index.ts            # Exportações
│
├── navigation/          # Configuração de rotas (a implementar)
│
├── services/            # Chamadas de API e sincronização (a implementar)
│
├── hooks/               # Custom hooks React (a implementar)
│
├── utils/               # Funções utilitárias
│   └── helpers.ts          # Formatação, cálculos, geradores
│
├── types/               # Definições TypeScript
│   └── index.ts            # Tipos globais (Farm, Sale, Product, etc.)
│
├── contexts/            # Gerenciamento de estado
│   └── AppContext.tsx      # Context API para vendas e sincronização
│
├── styles/              # Estilos globais
│   └── global.ts           # Estilos compartilhados
│
└── config/              # Configurações e dados
    ├── theme.ts            # Cores, espaçamentos, bordas, sombras
    └── data.ts             # Dados mockados (fazendas, produtos)
```

## 🎨 Funcionalidades Migradas

### ✅ Componentes
- **AppHeader**: Cabeçalho com título dinâmico, avatar e status de sincronização
- **MetricCard**: Cards de métricas com suporte a variante de alerta
- **FarmItem**: Item de fazenda com status visual (visitado/pendente/urgente)
- **SaleItem**: Item de venda com valor em R$ e sacas de soja
- **GoalProgress**: Barra de progresso animada para metas
- **BarterCard**: Cálculo visual de equivalência em sacas de soja

### 📺 Telas
1. **Mapa**: Visualização de rotas, métricas e lista de fazendas
2. **Vendas**: Formulário de registro e lista de vendas do mês
3. **Relatório**: Resumo mensal com opções de exportação
4. **Metas**: Comissões e progresso por categoria

### 🛠️ Utilidades
- Formatação de moeda (BRL)
- Cálculo de equivalência em sacas de soja (barter)
- Cálculo de comissões
- Formatação de datas
- Gerador de IDs únicos

### 🎨 Design System
- **Cores**: Paleta verde (agro), âmbar, vermelho e cinza
- **Espaçamentos**: Sistema consistente (xs, sm, md, lg, xl, xxl)
- **Bordas**: Arredondamentos padronizados
- **Sombras**: Dois níveis (sm, lg)
- **Tipografia**: Tamanhos consistentes

## 🚀 Próximos Passos

### Navegação
- [ ] Implementar navegação com React Navigation
- [ ] Bottom tabs para as 4 telas principais
- [ ] Modal para histórico de fazendas

### Funcionalidades
- [ ] Implementar seletor de fazendas e produtos
- [ ] Adicionar persistência local (AsyncStorage)
- [ ] Implementar sincronização offline-first
- [ ] Adicionar exportação de relatórios (PDF, Excel, WhatsApp)
- [ ] Implementar modal de histórico de fazendas

### UX/UI
- [ ] Adicionar toast notifications
- [ ] Implementar pull-to-refresh
- [ ] Adicionar loading states
- [ ] Implementar formulários com validação

### Otimizações
- [ ] Criar custom hooks para lógica compartilhada
- [ ] Implementar memoização onde necessário
- [ ] Adicionar testes unitários

## 📝 Observações

O código foi migrado do protótipo HTML/CSS para React Native mantendo:
- ✅ Toda a estrutura visual
- ✅ Lógica de cálculos (barter, comissões)
- ✅ Dados mockados
- ✅ Sistema de design consistente
- ✅ Organização por funcionalidade

A estrutura está preparada para fácil manutenção e escalabilidade!

#### Lembrar de criar um lembrete sobre a frequencia de compra de um cliente