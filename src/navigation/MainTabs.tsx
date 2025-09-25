import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { MotosScreen } from '@/screens/motos/MotosScreen';
import { FiliaisScreen } from '@/screens/filiais/FiliaisScreen';
import { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Motos':
              iconName = focused ? 'motorcycle' : 'motorcycle-outline';
              break;
            case 'Filiais':
              iconName = focused ? 'business' : 'business-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Início',
          tabBarBadge: undefined,
        }}
      />
      <Tab.Screen
        name="Motos"
        component={MotosScreen}
        options={{
          title: 'Motos',
          tabBarBadge: undefined,
        }}
      />
      <Tab.Screen
        name="Filiais"
        component={FiliaisScreen}
        options={{
          title: 'Filiais',
          tabBarBadge: undefined,
        }}
      />
    </Tab.Navigator>
  );
};
