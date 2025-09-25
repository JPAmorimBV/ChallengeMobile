import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  showLogout = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.primary}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <Ionicons
              name="flash"
              size={24}
              color={theme.colors.onPrimary}
            />
            <Text style={[styles.logoText, { color: theme.colors.onPrimary }]}>
              Nexus Tech
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
          {title}
        </Text>

        <View style={styles.rightSection}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Ionicons
              name={theme.dark ? 'sunny' : 'moon'}
              size={20}
              color={theme.colors.onPrimary}
            />
          </TouchableOpacity>
          {showLogout && (
            <TouchableOpacity onPress={logout} style={styles.iconButton}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
