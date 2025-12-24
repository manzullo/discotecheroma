import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Evento } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, elevation } from '../theme';

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
  const imageHeight = isLarge ? 180 : 120;

  const imageUrl = evento.immagine || PLACEHOLDER_IMAGE;

  return (
    <TouchableOpacity
      style={[styles.container, elevation.level1]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Day chip overlay */}
        <View style={styles.dayChip}>
          <Text style={styles.dayText}>{evento.giorno}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {evento.titolo}
        </Text>

        {/* Music genres */}
        {evento.generiMusicali.length > 0 && (
          <Text style={styles.genres} numberOfLines={1}>
            {evento.generiMusicali.slice(0, 3).join(' • ')}
          </Text>
        )}

        {/* Bottom row: price and age */}
        <View style={styles.bottomRow}>
          {evento.prezzoMinimo && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Da </Text>
              <Text style={styles.priceValue}>{evento.prezzoMinimo}€</Text>
            </View>
          )}
          {evento.etaMinima && (
            <View style={styles.ageChip}>
              <Text style={styles.ageText}>{evento.etaMinima}+</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - spacing.md * 2,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.surfaceContainerHighest,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dayChip: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dayText: {
    color: colors.onPrimaryContainer,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: 22,
  },
  genres: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
  },
  priceValue: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  ageChip: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  ageText: {
    color: colors.onSecondaryContainer,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});

export default EventCard;
