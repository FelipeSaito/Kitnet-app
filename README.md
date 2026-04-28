# 🏠 Casas Kitnet Manager

Aplicativo mobile de gestão de kitnets com tema **Dark Luxury**.
Desenvolvido em **React Native + Expo + TypeScript + Expo Router**.

---

## 🚀 Como rodar

### 1. Instale as dependências
```bash
npm install
```

### 2. Inicie o projeto
```bash
npx expo start
```

### 3. Rode no dispositivo
- **iOS**: escaneie o QR Code com o app **Expo Go**
- **Android**: escaneie o QR Code com o app **Expo Go**
- **Emulador Android**: pressione `a` no terminal
- **Simulador iOS**: pressione `i` no terminal (macOS apenas)

---

## 📁 Estrutura de arquivos

```
casas-kitnet-manager/
├── app/
│   ├── _layout.tsx              # Root layout + fontes
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom Navigation Bar
│   │   ├── index.tsx            # Dashboard / Home
│   │   ├── kitnets.tsx          # Lista de kitnets
│   │   ├── tenants.tsx          # Inquilinos
│   │   ├── finance.tsx          # Financeiro
│   │   └── settings.tsx         # Configurações
│   └── kitnet/
│       ├── [id].tsx             # Detalhes da kitnet
│       ├── new.tsx              # Cadastrar nova kitnet
│       └── [id]/
│           └── edit.tsx         # Editar kitnet
│
├── components/
│   ├── index.tsx                # Header, SearchInput, RegionTabs,
│   │                            # PrimaryButton, InputField,
│   │                            # SummaryCard, TenantListItem, PaymentListItem
│   ├── KitnetCard.tsx           # Card do grid de kitnets
│   └── StatusBadge.tsx          # Badge de status colorida
│
├── constants/
│   └── theme.ts                 # Colors, Spacing, Radius, Typography
│
├── data/
│   └── mockData.ts              # Dados mockados (kitnets, pagamentos, inquilinos)
│
└── types/
    └── index.ts                 # TypeScript types
```

---

## 🎨 Design System

| Token | Valor |
|---|---|
| Background | `#0a0a0a` |
| Surface | `#1A1A15` |
| Gold (accent) | `#FFC928` |
| Texto principal | `#EBE1D1` |
| Texto secundário | `#D2C5AC` |
| Texto terciário | `#9B8F79` |
| Input bg | `#2A2A24` |
| Borda | `#4E4633` |

**Fontes:**
- `Noto Serif Bold` — título "Casas"
- `Inter` (400 / 500 / 600 / 700) — tudo mais

---

## 🔌 Próximos passos para conectar com back-end

1. Substitua as importações de `../../data/mockData` por chamadas à sua API
2. Adicione `React Query` ou `SWR` para cache e revalidação
3. Configure autenticação (ex: JWT com `expo-secure-store`)
4. Use `expo-notifications` para alertas de vencimento

---

## 📱 Telas implementadas

| Tela | Status |
|---|---|
| Dashboard com grid por região | ✅ |
| Busca e filtro por região | ✅ |
| Detalhes da kitnet | ✅ |
| Formulário de cadastro/edição | ✅ |
| Lista de inquilinos | ✅ |
| Resumo financeiro | ✅ |
| Configurações | ✅ |
| Bottom Navigation | ✅ |
| Integração WhatsApp | ✅ |



