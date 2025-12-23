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

export const EventCard: React.FC<EventCardProps> = ({
  evento,
  onPress,
  variant = 'large',
}) => {
  const isLarge = variant === 'large';
  const cardHeight = isLarge ? 220 : 150;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    return date.toLocaleDateString('it-IT', options);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { height: cardHeight }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: evento.featured_image_url }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.dateBox}>
                <Text style={styles.dateText}>{formatDate(evento.date)}</Text>
              </View>
              {evento.acf?.prezzo_prevendita && (
                <View style={styles.priceBox}>
                  <Text style={styles.priceText}>
                    {evento.acf.prezzo_prevendita}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>
                {stripHtml(evento.title.rendered)}
              </Text>

              {evento.acf?.location && (
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.location}>{evento.acf.location}</Text>
                </View>
              )}

              {isLarge && evento.acf?.genere_musicale && (
                <View style={styles.tagsRow}>
                  {evento.acf.genere_musicale.split(',').slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag.trim()}</Text>
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
  dateBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dateText: {
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationIcon: {
    fontSize: fontSize.sm,
  },
  location: {
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
