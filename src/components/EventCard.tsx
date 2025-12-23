import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Evento } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface EventCardProps {
  evento: Evento;
  onPress: () => void;
  variant?: 'large' | 'compact';
}

const { width } = Dimensions.get('window');

// Immagine placeholder quando non c'è immagine
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800';

export const EventCard: React.FC<EventCardProps> = ({
  evento,
  onPress,
  variant = 'large',
}) => {
  const isLarge = variant === 'large';
  const cardHeight = isLarge ? 220 : 150;

  const imageUrl = evento.immagine || PLACEHOLDER_IMAGE;

  return (
    <TouchableOpacity
      style={[styles.container, { height: cardHeight }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.dayBox}>
                <Text style={styles.dayText}>{evento.giorno}</Text>
              </View>
              {evento.prezzoMinimo && (
                <View style={styles.priceBox}>
                  <Text style={styles.priceText}>
                    da {evento.prezzoMinimo}€
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {evento.titolo}
              </Text>

              {evento.etaMinima && (
                <View style={styles.ageRow}>
                  <Text style={styles.ageIcon}>🔞</Text>
                  <Text style={styles.ageText}>{evento.etaMinima}+</Text>
                </View>
              )}

              {isLarge && evento.generiMusicali.length > 0 && (
                <View style={styles.tagsRow}>
                  {evento.generiMusicali.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - spacing.md * 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageBackground: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
  },
  image: {
    borderRadius: borderRadius.lg,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dayText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
  },
  priceBox: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priceText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: 28,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ageIcon: {
    fontSize: fontSize.sm,
  },
  ageText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
});

export default EventCard;
