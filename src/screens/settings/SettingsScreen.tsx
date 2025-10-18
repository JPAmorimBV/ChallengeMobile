import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';

export const SettingsScreen: React.FC = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={t('settings.title')} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Idioma */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            {t('settings.language')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                language === 'pt' && { backgroundColor: theme.colors.primary },
                { borderColor: theme.colors.outline },
              ]}
              onPress={() => changeLanguage('pt')}
            >
              <Text style={[
                styles.optionText,
                { color: language === 'pt' ? theme.colors.onPrimary : theme.colors.onSurface }
              ]}>
                🇧🇷 Português
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                language === 'es' && { backgroundColor: theme.colors.primary },
                { borderColor: theme.colors.outline },
              ]}
              onPress={() => changeLanguage('es')}
            >
              <Text style={[
                styles.optionText,
                { color: language === 'es' ? theme.colors.onPrimary : theme.colors.onSurface }
              ]}>
                🇪🇸 Español
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Tema */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            {t('settings.theme')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                !isDark && { backgroundColor: theme.colors.primary },
                { borderColor: theme.colors.outline },
              ]}
              onPress={() => !isDark || toggleTheme()}
            >
              <Ionicons name="sunny" size={20} color={!isDark ? theme.colors.onPrimary : theme.colors.onSurface} />
              <Text style={[
                styles.optionText,
                { color: !isDark ? theme.colors.onPrimary : theme.colors.onSurface }
              ]}>
                {t('settings.light')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                isDark && { backgroundColor: theme.colors.primary },
                { borderColor: theme.colors.outline },
              ]}
              onPress={() => isDark || toggleTheme()}
            >
              <Ionicons name="moon" size={20} color={isDark ? theme.colors.onPrimary : theme.colors.onSurface} />
              <Text style={[
                styles.optionText,
                { color: isDark ? theme.colors.onPrimary : theme.colors.onSurface }
              ]}>
                {t('settings.dark')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Sobre */}
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Card>
            <View style={styles.aboutRow}>
              <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.aboutText, { color: theme.colors.onSurface }]}>
                {t('settings.about')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
            </View>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutText: {
    flex: 1,
    fontSize: 16,
  },
});
