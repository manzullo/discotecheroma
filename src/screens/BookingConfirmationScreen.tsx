import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, elevation } from '../theme';

type BookingConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BookingConfirmation'
>;

export const BookingConfirmationScreen: React.FC<
  BookingConfirmationScreenProps
> = ({ route, navigation }) => {
  const { prenotazione } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.title}>Prenotazione Confermata!</Text>
        <Text style={styles.subtitle}>
          Ti abbiamo inviato un'email di conferma a {prenotazione.email}
        </Text>

        {/* Booking Details Card */}
        <View style={[styles.card, elevation.level1]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dettagli Prenotazione</Text>
            <View style={styles.bookingIdBadge}>
              <Text style={styles.bookingIdText}>{prenotazione.id}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Evento</Text>
            <Text style={styles.detailValue}>{prenotazione.nomeEvento}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nome</Text>
            <Text style={styles.detailValue}>
              {prenotazione.nome} {prenotazione.cognome}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posti</Text>
            <Text style={styles.detailValue}>{prenotazione.numeroPosti}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Telefono</Text>
            <Text style={styles.detailValue}>{prenotazione.telefono}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data prenotazione</Text>
            <Text style={styles.detailValue}>
              {formatDate(prenotazione.dataPrenotazione)}
            </Text>
          </View>

          {prenotazione.note && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Note</Text>
                <Text style={styles.detailValue}>{prenotazione.note}</Text>
              </View>
            </>
          )}
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsCard, elevation.level1]}>
          <Text style={styles.instructionsTitle}>📋 Cosa portare</Text>
          <Text style={styles.instructionsText}>
            • Documento d'identità valido{'\n'}
            • Conferma prenotazione (questa schermata){'\n'}
            • Il pagamento avverrà in cassa
          </Text>
        </View>

        {/* Buttons */}
        <Button
          title="Torna alla Home"
          onPress={handleBackToHome}
          size="large"
          style={styles.button}
        />
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
    padding: spacing.md,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  checkmark: {
    fontSize: 48,
    color: colors.success,
  },
  title: {
    color: colors.onSurface,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  bookingIdBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  bookingIdText: {
    color: colors.onPrimaryContainer,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  detailRow: {
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginBottom: 2,
  },
  detailValue: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  instructionsCard: {
    backgroundColor: colors.tertiaryContainer,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.xl,
  },
  instructionsTitle: {
    color: colors.onTertiaryContainer,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  instructionsText: {
    color: colors.onTertiaryContainer,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    marginBottom: spacing.xl,
  },
});

export default BookingConfirmationScreen;
