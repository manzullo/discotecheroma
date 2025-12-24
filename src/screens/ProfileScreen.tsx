import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize, fontWeight, elevation } from '../theme';

export const ProfileScreen: React.FC = () => {
  const handleLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Errore', 'Impossibile aprire il link');
    });
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, elevation.level1]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.guestText}>Ospite</Text>
          <Text style={styles.guestSubtext}>
            Accedi per salvare le tue prenotazioni
          </Text>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={[styles.menuCard, elevation.level1]}>
            <MenuItem
              icon="🔐"
              title="Accedi / Registrati"
              subtitle="Per salvare le tue prenotazioni"
              onPress={() => Alert.alert('Coming Soon', 'Funzionalità in arrivo!')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferenze</Text>
          <View style={[styles.menuCard, elevation.level1]}>
            <MenuItem
              icon="🔔"
              title="Notifiche"
              subtitle="Gestisci le notifiche"
              onPress={() => Alert.alert('Coming Soon', 'Funzionalità in arrivo!')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="🎨"
              title="Tema"
              subtitle="Material Design 3"
              onPress={() => Alert.alert('Info', 'Tema Material Design 3 attivo')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supporto</Text>
          <View style={[styles.menuCard, elevation.level1]}>
            <MenuItem
              icon="❓"
              title="FAQ"
              subtitle="Domande frequenti"
              onPress={() => Alert.alert('Coming Soon', 'Funzionalità in arrivo!')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="📧"
              title="Contattaci"
              subtitle="info@discotecheroma.com"
              onPress={() => handleLink('mailto:info@discotecheroma.com')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="🌐"
              title="Sito Web"
              subtitle="www.discotecheroma.com"
              onPress={() => handleLink('https://www.discotecheroma.com')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legale</Text>
          <View style={[styles.menuCard, elevation.level1]}>
            <MenuItem
              icon="📄"
              title="Termini di Servizio"
              onPress={() => Alert.alert('Coming Soon', 'Funzionalità in arrivo!')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="🔒"
              title="Privacy Policy"
              onPress={() => Alert.alert('Coming Soon', 'Funzionalità in arrivo!')}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Discoteche Roma</Text>
          <Text style={styles.appVersion}>Versione 1.0.0</Text>
          <Text style={styles.copyright}>
            © 2025 Discoteche Roma. Tutti i diritti riservati.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerLow,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 36,
  },
  guestText: {
    color: colors.onSurface,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  guestSubtext: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIcon: {
    fontSize: fontSize.lg,
    width: 32,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  menuSubtitle: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  menuArrow: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xl,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginLeft: 48,
  },
  appInfo: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  appName: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  appVersion: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  copyright: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xs,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default ProfileScreen;
