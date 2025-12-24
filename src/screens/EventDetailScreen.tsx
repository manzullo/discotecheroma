import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, elevation } from '../theme';

type EventDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EventDetail'
>;

const { width } = Dimensions.get('window');

// Immagine placeholder
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800';

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { evento } = route.params;

  const handleBooking = () => {
    navigation.navigate('Booking', { evento });
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value?: string | null;
  }) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  const imageUrl = evento.immagine || PLACEHOLDER_IMAGE;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {evento.prezzoMinimo && (
            <View style={styles.priceTag}>
              <Text style={styles.priceLabel}>A partire da</Text>
              <Text style={styles.priceValue}>{evento.prezzoMinimo}€</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{evento.titolo}</Text>

          {/* Day Chip */}
          <View style={styles.dayChip}>
            <Text style={styles.dayIcon}>📅</Text>
            <Text style={styles.dayText}>{evento.giorno}</Text>
          </View>

          {/* Tags */}
          {evento.generiMusicali.length > 0 && (
            <View style={styles.tagsContainer}>
              {evento.generiMusicali.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Info Cards */}
          <View style={[styles.infoCard, elevation.level1]}>
            <Text style={styles.sectionTitle}>Dettagli Evento</Text>
            <InfoRow icon="📅" label="Giorno" value={evento.giorno} />
            <InfoRow icon="🔞" label="Età Minima" value={evento.etaMinima ? `${evento.etaMinima}+` : null} />
          </View>

          {/* Costi Liste */}
          {evento.costiListe && (
            <View style={[styles.infoCard, elevation.level1]}>
              <Text style={styles.sectionTitle}>📋 Liste</Text>
              <Text style={styles.costiText}>{evento.costiListe}</Text>
            </View>
          )}

          {/* Costi Tavoli */}
          {evento.costiTavoli && (
            <View style={[styles.infoCard, elevation.level1]}>
              <Text style={styles.sectionTitle}>🪑 Tavoli</Text>
              <Text style={styles.costiText}>{evento.costiTavoli}</Text>
            </View>
          )}

          {/* Costi Pacchetti */}
          {evento.costiPacchetti && (
            <View style={[styles.infoCard, elevation.level1]}>
              <Text style={styles.sectionTitle}>🎁 Pacchetti</Text>
              <Text style={styles.costiText}>{evento.costiPacchetti}</Text>
            </View>
          )}

          {/* Note */}
          {evento.note && (
            <View style={[styles.infoCard, elevation.level1]}>
              <Text style={styles.sectionTitle}>📝 Note</Text>
              <Text style={styles.costiText}>{evento.note}</Text>
            </View>
          )}

          {/* Spacing for button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed Booking Button */}
      <SafeAreaView edges={['bottom']} style={styles.bookingBar}>
        <View style={styles.bookingContainer}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingPrice}>
              {evento.prezzoMinimo ? `da ${evento.prezzoMinimo}€` : 'Info'}
            </Text>
            <Text style={styles.bookingLabel}>Prenota in lista</Text>
          </View>
          <Button
            title="Prenota Ora"
            onPress={handleBooking}
            size="large"
            style={styles.bookingButton}
          />
        </View>
      </SafeAreaView>
    </View>
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
  heroContainer: {
    width: width,
    height: 280,
    backgroundColor: colors.surfaceContainerHighest,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.onPrimaryContainer,
    fontSize: fontSize.xs,
  },
  priceValue: {
    color: colors.onPrimaryContainer,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.onSurface,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: 36,
  },
  dayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.secondaryContainer,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dayIcon: {
    fontSize: fontSize.md,
  },
  dayText: {
    color: colors.onSecondaryContainer,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  tagText: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
  },
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  infoIcon: {
    fontSize: fontSize.lg,
    width: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xs,
  },
  infoValue: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  costiText: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingPrice: {
    color: colors.onSurface,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  bookingLabel: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
  },
  bookingButton: {
    flex: 1,
  },
});

export default EventDetailScreen;
