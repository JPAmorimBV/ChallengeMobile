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

#### ✅ **Push Notifications**
- Notificações automáticas ao criar moto
- Notificações ao atualizar moto
- Notificações ao excluir moto
- Suporte para notificações em background
- Token Expo Push integrado
- Configuração Android/iOS completa

#### ✅ **Internacionalização (i18n)**
- 🇧🇷 Português (Brasil) - idioma padrão
- 🇪🇸 Español - tradução completa
- Detecção automática do idioma do dispositivo
- Troca de idioma em tempo real
- Todas as telas traduzidas
- Persistência da escolha do usuário

#### ✅ **Tela "Sobre o App"**
- Versão do aplicativo
- Build number
- Hash do commit Git (gerado automaticamente)
- Informações da equipe de desenvolvimento
- Tecnologias utilizadas
- Links para GitHub dos desenvolvedores
- Opção de copiar commit hash

#### ✅ **Firebase App Distribution**
- Configuração completa para distribuição
- Scripts de build automatizados
- Suporte para testers
- APK/IPA para testes
- Documentação de deploy


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
│ │ ├── forms/ 
│ │ │ ├── MotoFormScreen.tsx
│ │ │ └── FilialFormScreen.tsx
│ │ ├── settings/ 
│ │ │ └── SettingsScreen.tsx
│ │ └── about/ 
│ │ └── AboutScreen.tsx
│ │
│ ├── navigation/ 
│ │ ├── AuthStack.tsx
│ │ ├── MainTabs.tsx
│ │ ├── RootStack.tsx
│ │ ├── NavigationContainer.tsx
│ │ ├── navigationUtils.ts
│ │ └── linking.ts
│ │
│ ├── contexts/ 
│ │ ├── AuthContext.tsx
│ │ ├── ThemeContext.tsx
│ │ ├── ToastContext.tsx
│ │ ├── LanguageContext.tsx 
│ │ └── NotificationContext.tsx 
│ │
│ ├── services/ 
│ │ ├── api.ts
│ │ ├── authService.ts
│ │ ├── motoService.ts
│ │ ├── filialService.ts
│ │ ├── notificationService.ts 
│ │ └── index.ts
│ │
│ ├── i18n/ 
│ │ ├── locales/
│ │ │ ├── pt.json 
│ │ │ └── es.json 
│ │ └── index.ts
│ │
│ ├── types/ 
│ │ ├── api.ts
│ │ ├── theme.ts
│ │ └── navigation.ts
│ │
│ ├── utils/ 
│ │ ├── validation.ts
│ │ ├── format.ts
│ │ └── storage.ts
│ │
│ └── constants/ 
│ ├── api.ts
│ ├── storage.ts
│ └── app.ts
│
├── scripts/
│ └── get-commit-hash.js 
│
├── App.tsx 
├── app.json 
├── eas.json 
├── firebase.json 
└── .firebaserc  
```

---

## 👥 Integrantes do Projeto

### Equipe de Desenvolvimento

| Nome | RM | GitHub |
|------|-------|--------|
| **Otavio Miklos Nogueira** | RM554513 | https://github.com/omininola - omininola |
| **Luciayla Yumi Kawakami** | RM557987 | https://github.com/Luciayla24  - Luciayla24 |
| **João Pedro Amorim** | RM559213 | https://github.com/JPAmorimBV - JPAmorimBV |

