import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

type EventDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EventDetail'
>;

const { width, height } = Dimensions.get('window');

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
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image */}
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.heroImage}
        >
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.heroGradient}
          >
            <SafeAreaView edges={['top']}>
              <View style={styles.heroContent}>
                {evento.prezzoMinimo && (
                  <View style={styles.priceTag}>
                    <Text style={styles.priceLabel}>A partire da</Text>
                    <Text style={styles.priceValue}>{evento.prezzoMinimo}€</Text>
                  </View>
                )}
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{evento.titolo}</Text>

          {/* Day */}
          <View style={styles.dayRow}>
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
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Dettagli Evento</Text>
            <InfoRow icon="📅" label="Giorno" value={evento.giorno} />
            <InfoRow icon="🔞" label="Età Minima" value={evento.etaMinima ? `${evento.etaMinima}+` : null} />
          </View>

          {/* Costi Liste */}
          {evento.costiListe && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>📋 Liste</Text>
              <Text style={styles.costiText}>{evento.costiListe}</Text>
            </View>
          )}

          {/* Costi Tavoli */}
          {evento.costiTavoli && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>🪑 Tavoli</Text>
              <Text style={styles.costiText}>{evento.costiTavoli}</Text>
            </View>
          )}

          {/* Costi Pacchetti */}
          {evento.costiPacchetti && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>🎁 Pacchetti</Text>
              <Text style={styles.costiText}>{evento.costiPacchetti}</Text>
            </View>
          )}

          {/* Note */}
          {evento.note && (
            <View style={styles.infoCard}>
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
        <LinearGradient
          colors={[colors.background, colors.backgroundLight]}
          style={styles.bookingGradient}
        >
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
        </LinearGradient>
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
  heroImage: {
    width: width,
    height: height * 0.45,
    backgroundColor: colors.backgroundCard,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  priceTag: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.text,
    fontSize: fontSize.xs,
    opacity: 0.8,
  },
  priceValue: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  content: {
    padding: spacing.md,
    marginTop: -spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: 40,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  dayIcon: {
    fontSize: fontSize.md,
  },
  dayText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tagText: {
    color: colors.primaryLight,
    fontSize: fontSize.sm,
  },
  infoCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    fontSize: fontSize.lg,
    width: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  infoValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  costiText: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bookingGradient: {
    paddingTop: spacing.md,
  },
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingPrice: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  bookingLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  bookingButton: {
    flex: 1,
  },
});

export default EventDetailScreen;
