import React, { useState } from 'react';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const isLarge = variant === 'large';
  const imageHeight = isLarge ? 200 : 140;

  const imageUrl = evento.immagine || PLACEHOLDER_IMAGE;

  // Estrai nome locale dal titolo
  const nomeLocale = evento.titolo.split(' - ')[0];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={[styles.container, elevation.level1]}>
      {/* Image Container */}
      <TouchableOpacity
        style={[styles.imageContainer, { height: imageHeight }]}
        onPress={onPress}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content */}
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {evento.titolo}
        </Text>

        {/* Location & Day */}
        <View style={styles.locationRow}>
          <Text style={styles.dayBadge}>📅 {evento.giorno}</Text>
          <Text style={styles.locationText}>· {nomeLocale}</Text>
        </View>

        {/* Music genres as description */}
        {evento.generiMusicali.length > 0 && (
          <Text style={styles.description} numberOfLines={2}>
            {evento.generiMusicali.join(', ')}
          </Text>
        )}

        {/* Info Row */}
        <View style={styles.infoRow}>
          {evento.prezzoMinimo && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>💰</Text>
              <Text style={styles.infoText}>Da {evento.prezzoMinimo}€</Text>
            </View>
          )}
          {evento.etaMinima && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👥</Text>
              <Text style={styles.infoText}>{evento.etaMinima}+</Text>
            </View>
          )}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
          <Text style={styles.ctaText}>Prenota in Lista</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - spacing.md * 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.surfaceContainerHighest,
    position: 'relative',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dayBadge: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  locationText: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
  description: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoIcon: {
    fontSize: fontSize.sm,
  },
  infoText: {
    color: colors.onSurface,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});

export default EventCard;
