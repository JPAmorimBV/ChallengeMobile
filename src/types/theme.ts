export interface Theme {
  dark: boolean;
  colors: {
    // Primary colors
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;

    // Secondary colors
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;

    // Background colors
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;

    // Error colors
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;

    // Success colors
    success: string;
    onSuccess: string;

    // Warning colors  
    warning: string;
    onWarning: string;

    // Outline and utility colors
    outline: string;
    shadow: string;
    overlay: string;
  };
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#2196F3',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E3F2FD',
    onPrimaryContainer: '#1565C0',

    secondary: '#757575',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#F5F5F5',
    onSecondaryContainer: '#424242',

    background: '#FFFFFF',
    onBackground: '#212121',
    surface: '#FAFAFA',
    onSurface: '#212121',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#616161',

    error: '#F44336',
    onError: '#FFFFFF',
    errorContainer: '#FFEBEE',
    onErrorContainer: '#C62828',

    success: '#4CAF50',
    onSuccess: '#FFFFFF',

    warning: '#FF9800',
    onWarning: '#FFFFFF',

    outline: '#E0E0E0',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#90CAF9',
    onPrimary: '#0D47A1',
    primaryContainer: '#1565C0',
    onPrimaryContainer: '#E3F2FD',

    secondary: '#BDBDBD',
    onSecondary: '#424242',
    secondaryContainer: '#616161',
    onSecondaryContainer: '#F5F5F5',

    background: '#121212',
    onBackground: '#FFFFFF',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#CCCCCC',

    error: '#FF6B6B',
    onError: '#FFFFFF',
    errorContainer: '#CF6679',
    onErrorContainer: '#FFEBEE',

    success: '#66BB6A',
    onSuccess: '#FFFFFF',

    warning: '#FFB74D',
    onWarning: '#FFFFFF',

    outline: '#424242',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};
