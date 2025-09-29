# Nexus Tech - Sistema de Gestão Mottu

![React Native](https://img.shields.io/badge/React_Native-0.72.6-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-49.0.15-000020?style=for-the-badge&logo=expo&logoColor=white)

## 📱 Nome do App

**Nexus Tech - Sistema de Gestão Mottu**

Aplicação móvel desenvolvida em React Native com TypeScript para gerenciamento completo de motos e filiais da Mottu, com sistema de autenticação e vinculação automática de motos a usuários.

---

## 🎯 Proposta e Funcionalidades

### Proposta
Sistema móvel profissional para gerenciamento de frotas de motocicletas e filiais da Mottu, permitindo cadastro, edição e visualização de motos com controle de propriedade por usuário e relacionamento hierárquico com filiais.

### Funcionalidades Principais

#### ✅ **Sistema de Autenticação JWT**
- Login seguro com email e senha
- Cadastro de novos usuários com role ADMIN
- Logout funcional com limpeza de sessão
- Persistência de sessão com AsyncStorage
- Token JWT com expiração controlada

#### ✅ **Dashboard Inteligente**
- Visão geral com estatísticas em tempo real
- Contadores gerais de motos e filiais
- Cards de estatísticas com status das motos
- Ações rápidas para navegação
- Informações do usuário logado

#### ✅ **Gestão Completa de Motos**
- **CRUD completo**: Create, Read, Update, Delete
- Vinculação automática ao usuário logado
- Validação de placa no formato brasileiro (ABC-1234)
- Status predefinidos: Disponível, Em uso, Manutenção, Indisponível
- Filtros por status e filial
- Toggle para visualizar "Todas as Motos" ou "Minhas Motos"
- Controle de propriedade: edição apenas das próprias motos
- Indicadores visuais de proprietário

#### ✅ **Gestão Completa de Filiais**
- **CRUD completo**: Create, Read, Update, Delete
- Visualização hierárquica: filiais com suas motos aninhadas
- Estrutura expandível para ver motos por filial
- Validação de endereço completo
- Contador de motos por filial
- Interface intuitiva com cards expansíveis

#### ✅ **Interface Profissional**
- **Tema Claro/Escuro**: Alternância suave entre temas
- Design seguindo Material Design Guidelines
- Cores corporativas: branco e cinza (Nexus Tech)
- Animações e transições fluidas
- Componentes reutilizáveis e consistentes
- Feedback visual para todas as operações
- Loading states e error handling

#### ✅ **Integração API Java**
- Comunicação completa com backend Java/Spring Boot
- Interceptors Axios para token automático
- Tratamento de erros HTTP (401, 403, 404, 422, 500)
- Refresh automático quando necessário
- Headers configurados: Authorization Bearer
- Validação de permissões por role

#### ✅ **Recursos Técnicos**
- TypeScript com tipagem completa
- Context API para gerenciamento de estado global
- React Navigation com navegação tipada
- Validação de formulários com feedback
- AsyncStorage para persistência local
- Error Boundary para tratamento global de erros
- Arquitetura escalável e organizada

---

## 📂 Estrutura de Pastas
```
├── src/
│ ├── components/ 
│ │ ├── common/
│ │ │ ├── Header.tsx 
│ │ │ ├── LoadingSpinner.tsx
│ │ │ ├── Toast.tsx 
│ │ │ └── ErrorBoundary.tsx
│ │ ├── forms/ 
│ │ │ ├── LoginForm.tsx
│ │ │ └── RegisterForm.tsx
│ │ └── ui/ 
│ │ ├── Button.tsx 
│ │ ├── Card.tsx
│ │ └── Input.tsx 
│ │
│ ├── screens/ 
│ │ ├── auth/ 
│ │ │ ├── LoginScreen.tsx
│ │ │ └── RegisterScreen.tsx
│ │ ├── dashboard/ 
│ │ │ └── DashboardScreen.tsx
│ │ ├── motos/ 
│ │ │ └── MotosScreen.tsx
│ │ ├── filiais/ 
│ │ │ └── FiliaisScreen.tsx
│ │ └── forms/ 
│ │ ├── MotoFormScreen.tsx
│ │ └── FilialFormScreen.tsx
│ │
│ ├── navigation/ 
│ │ ├── AuthStack.tsx 
│ │ ├── MainTabs.tsx 
│ │ ├── RootStack.tsx 
│ │ ├── NavigationContainer.tsx
│ │ ├── navigationUtils.ts 
│ │ └── linking.ts 
│ │
│ ├── contexts/ # Contextos React (Estado global)
│ │ ├── AuthContext.tsx 
│ │ ├── ThemeContext.tsx 
│ │ └── ToastContext.tsx 
│ │
│ ├── services/ 
│ │ ├── api.ts 
│ │ ├── authService.ts 
│ │ ├── motoService.ts
│ │ ├── filialService.ts 
│ │ └── index.ts 
│ │
│ ├── types/ 
│ │ ├── api.ts 
│ │ ├── theme.ts 
│ │ ├── index.ts 
│ │ └── navigation.ts 
│ │
│ ├── utils/ 
│ │ ├── validation.ts 
│ │ ├── format.ts 
│ │ ├── index.ts 
│ │ └── storage.ts
│ │
│ └── constants/
│ ├── api.ts
│ ├── storage.ts 
│ └── app.ts 
│
├── App.tsx
├── app.json
├── package.json 
├── tsconfig.json 
├── babel.config.js 
├── metro.config.js 
└── README.md ```

### Descrição da Estrutura

- **`components/`**: Componentes reutilizáveis divididos por tipo (common, forms, ui)
- **`screens/`**: Telas principais organizadas por funcionalidade
- **`navigation/`**: Sistema de navegação com stacks e tabs
- **`contexts/`**: Gerenciamento de estado global com Context API
- **`services/`**: Camada de integração com APIs externas
- **`types/`**: Definições de tipos TypeScript para type safety
- **`utils/`**: Funções auxiliares e utilitários reutilizáveis
- **`constants/`**: Valores constantes e configurações centralizadas

---

## 👥 Integrantes do Projeto

### Equipe de Desenvolvimento

| Nome | RM | GitHub |
|------|-------|--------|
| **Otavio Miklos Nogueira** | RM554513 | https://github.com/omininola - omininola |
| **Luciayla Yumi Kawakami** | RM557987 | https://github.com/Luciayla24  - Luciayla24 |
| **João Pedro Amorim** | RM559213 | https://github.com/JPAmorimBV - JPAmorimBV |

