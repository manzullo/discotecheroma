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

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { evento } = route.params;
  const acf = evento.acf || {};

  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

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
    value?: string;
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
          source={{ uri: evento.featured_image_url }}
          style={styles.heroImage}
        >
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.heroGradient}
          >
            <SafeAreaView edges={['top']}>
              <View style={styles.heroContent}>
                {acf.prezzo_prevendita && (
                  <View style={styles.priceTag}>
                    <Text style={styles.priceLabel}>Prevendita</Text>
                    <Text style={styles.priceValue}>{acf.prezzo_prevendita}</Text>
                  </View>
                )}
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{stripHtml(evento.title.rendered)}</Text>

          {/* Location */}
          {acf.location && (
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>{acf.location}</Text>
            </View>
          )}

          {/* Tags */}
          {acf.genere_musicale && (
            <View style={styles.tagsContainer}>
              {acf.genere_musicale.split(',').map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Info Cards */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Dettagli Evento</Text>
            <InfoRow icon="📅" label="Data" value={acf.data_evento} />
            <InfoRow
              icon="🕐"
              label="Orario"
              value={
                acf.ora_inizio && acf.ora_fine
                  ? `${acf.ora_inizio} - ${acf.ora_fine}`
                  : acf.ora_inizio
              }
            />
            <InfoRow icon="💰" label="Ingresso" value={acf.prezzo} />
            <InfoRow icon="🎫" label="Prevendita" value={acf.prezzo_prevendita} />
            <InfoRow icon="👔" label="Dress Code" value={acf.dress_code} />
            <InfoRow icon="🔞" label="Età Minima" value={acf.eta_minima ? `${acf.eta_minima}+` : undefined} />
          </View>

          {/* Location Card */}
          {acf.indirizzo && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Dove</Text>
              <InfoRow icon="📍" label="Indirizzo" value={acf.indirizzo} />
            </View>
          )}

          {/* Artists */}
          {acf.artisti && (
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>🎧 Line-up</Text>
              <Text style={styles.artists}>{acf.artisti}</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Info</Text>
            <Text style={styles.description}>
              {stripHtml(evento.content.rendered)}
            </Text>
          </View>

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
              <Text style={styles.bookingPrice}>{acf.prezzo_prevendita || acf.prezzo || 'Gratis'}</Text>
              <Text style={styles.bookingLabel}>Prevendita</Text>
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  locationIcon: {
    fontSize: fontSize.md,
  },
  location: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
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
  artists: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  description: {
    color: colors.textSecondary,
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
