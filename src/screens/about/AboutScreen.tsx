import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';

export const AboutScreen: React.FC = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { showSuccess } = useToast();
  const [commitHash, setCommitHash] = useState<string>('N/A');

  useEffect(() => {
    loadCommitHash();
  }, []);

  const loadCommitHash = async () => {
    const hash = Constants.expoConfig?.extra?.commitHash || 'development';
    setCommitHash(hash);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showSuccess('Copiado para área de transferência!');
  };

  const openGitHub = (url: string) => {
    Linking.openURL(url);
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || 
                      Constants.expoConfig?.android?.versionCode || '1';

  const teamMembers = [
    { name: 'Otavio Miklos Nogueira', rm: 'RM554513', github: 'omininola' },
    { name: 'Luciayla Yumi Kawakami', rm: 'RM557987', github: 'Luciayla24' },
    { name: 'João Pedro Amorim', rm: 'RM559213', github: 'JPAmorimBV' },
  ];

  const technologies = [
    'React Native 0.72.6',
    'TypeScript 5.1.3',
    'Expo 49.0.15',
    'React Navigation 6.x',
    'Axios',
    'i18next',
    'Expo Notifications',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={t('about.title')} 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo e Nome */}
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="flash" size={48} color={theme.colors.onPrimary} />
          </View>
          <Text style={[styles.appName, { color: theme.colors.onBackground }]}>
            {t('common.appName')}
          </Text>
          <Text style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {t('dashboard.subtitle')}
          </Text>
        </View>

        {/* Informações do App */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('about.appInfo')}
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                {t('about.version')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {appVersion}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="construct-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                {t('about.buildNumber')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {buildNumber}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="git-commit-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                {t('about.commitHash')}
              </Text>
              <TouchableOpacity onPress={() => copyToClipboard(commitHash)}>
                <Text style={[styles.infoValue, styles.commitHash, { color: theme.colors.primary }]}>
                  {commitHash}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Descrição */}
        <Card>
          <Text style={[styles.description, { color: theme.colors.onSurface }]}>
            {t('about.description')}
          </Text>
        </Card>

        {/* Equipe */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('about.team')}
          </Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: theme.colors.onSurface }]}>
                  {member.name}
                </Text>
                <Text style={[styles.memberRm, { color: theme.colors.onSurfaceVariant }]}>
                  {member.rm}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.githubButton}
                onPress={() => openGitHub(`https://github.com/${member.github}`)}
              >
                <Ionicons name="logo-github" size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        {/* Tecnologias */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('about.technologies')}
          </Text>
          <View style={styles.techList}>
            {technologies.map((tech, index) => (
              <View key={index} style={[styles.techBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={[styles.techText, { color: theme.colors.onPrimaryContainer }]}>
                  {tech}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Contato */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('about.contact')}
          </Text>
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => openGitHub('https://github.com/omininola/sprint3_java')}
          >
            <Ionicons name="logo-github" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.primary }]}>
              GitHub Repository
            </Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Desenvolvido por Nexus Tech
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            FIAP Challenge 2025 - Sprint 4
          </Text>
        </View>
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
    paddingBottom: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  commitHash: {
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberRm: {
    fontSize: 12,
  },
  githubButton: {
    padding: 4,
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
