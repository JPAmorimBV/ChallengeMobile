import { createNavigationContainerRef, StackActions, TabActions, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

// Referência para navegação global (fora dos componentes)
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export class NavigationUtils {
  /**
   * Navega para uma rota específica
   */
  static navigate<T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T]
  ): void {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name as never, params as never);
    }
  }

  /**
   * Volta para a tela anterior
   */
  static goBack(): void {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  /**
   * Reset do stack de navegação
   */
  static reset<T extends keyof RootStackParamList>(
    routeName: T,
    params?: RootStackParamList[T]
  ): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName as never, params: params as never }],
        })
      );
    }
  }

  /**
   * Push uma nova tela no stack
   */
  static push<T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T]
  ): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name as never, params));
    }
  }

  /**
   * Pop tela do stack
   */
  static pop(count: number = 1): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(count));
    }
  }

  /**
   * Pula para uma aba específica
   */
  static jumpToTab(tabName: string): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(TabActions.jumpTo(tabName));
    }
  }

  /**
   * Obtém a rota atual
   */
  static getCurrentRoute(): string | undefined {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
  }

  /**
   * Verifica se pode voltar
   */
  static canGoBack(): boolean {
    return navigationRef.isReady() && navigationRef.canGoBack();
  }

  /**
   * Navega para tela de login (logout)
   */
  static navigateToAuth(): void {
    this.reset('AuthStack');
  }

  /**
   * Navega para o dashboard principal (login bem-sucedido)
   */
  static navigateToDashboard(): void {
    this.reset('MainTabs');
  }

  /**
   * Abre modal de formulário de moto
   */
  static openMotoForm(moto?: any, mode: 'create' | 'edit' = 'create'): void {
    this.navigate('MotoForm', { moto, mode });
  }

  /**
   * Abre modal de formulário de filial
   */
  static openFilialForm(filial?: any, mode: 'create' | 'edit' = 'create'): void {
    this.navigate('FilialForm', { filial, mode });
  }

  /**
   * Fecha modal atual
   */
  static closeModal(): void {
    this.goBack();
  }
}

// Hook personalizado para navegação
export const useNavigation = () => {
  return {
    navigate: NavigationUtils.navigate,
    goBack: NavigationUtils.goBack,
    reset: NavigationUtils.reset,
    push: NavigationUtils.push,
    pop: NavigationUtils.pop,
    jumpToTab: NavigationUtils.jumpToTab,
    getCurrentRoute: NavigationUtils.getCurrentRoute,
    canGoBack: NavigationUtils.canGoBack,
    navigateToAuth: NavigationUtils.navigateToAuth,
    navigateToDashboard: NavigationUtils.navigateToDashboard,
    openMotoForm: NavigationUtils.openMotoForm,
    openFilialForm: NavigationUtils.openFilialForm,
    closeModal: NavigationUtils.closeModal,
  };
};
