import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Button, LoadingSpinner } from '../components';
import { getPrenotazioni, cancelPrenotazione } from '../services/api';
import { Prenotazione } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, elevation } from '../theme';

export const MyBookingsScreen: React.FC = () => {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPrenotazioni = async () => {
    try {
      const data = await getPrenotazioni();
      setPrenotazioni(data.reverse()); // Mostra prima le più recenti
    } catch (error) {
      console.error('Errore caricamento prenotazioni:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPrenotazioni();
  }, []);

  // Ricarica quando la schermata torna in focus
  useFocusEffect(
    useCallback(() => {
      loadPrenotazioni();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPrenotazioni();
  };

  const handleCancelBooking = (prenotazione: Prenotazione) => {
    Alert.alert(
      'Annulla Prenotazione',
      `Sei sicuro di voler annullare la prenotazione per "${prenotazione.nomeEvento}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sì, annulla',
          style: 'destructive',
          onPress: async () => {
            if (prenotazione.id) {
              await cancelPrenotazione(prenotazione.id);
              loadPrenotazioni();
            }
          },
        },
      ]
    );
  };

  const getStatusStyles = (status: Prenotazione['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: colors.successContainer,
          text: colors.success,
        };
      case 'cancelled':
        return {
          bg: colors.errorContainer,
          text: colors.error,
        };
      default:
        return {
          bg: colors.warningContainer,
          text: colors.warning,
        };
    }
  };

  const getStatusText = (status: Prenotazione['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confermata';
      case 'cancelled':
        return 'Annullata';
      default:
        return 'In attesa';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderBookingCard = ({ item }: { item: Prenotazione }) => {
    const statusStyles = getStatusStyles(item.status);

    return (
      <View style={[styles.card, elevation.level1]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyles.bg },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyles.text }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.bookingId}>{item.id}</Text>
        </View>

        <Text style={styles.eventName}>{item.nomeEvento}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Text style={styles.detailIcon}>👤</Text>
            <Text style={styles.detailText}>
              {item.nome} {item.cognome}
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailIcon}>🎫</Text>
            <Text style={styles.detailText}>{item.numeroPosti} posti</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>
              {formatDate(item.dataPrenotazione)}
            </Text>
          </View>
        </View>

        {item.status === 'confirmed' && (
          <Button
            title="Annulla Prenotazione"
            onPress={() => handleCancelBooking(item)}
            variant="outlined"
            size="small"
            style={styles.cancelButton}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Caricamento prenotazioni..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Le Mie Prenotazioni</Text>
        <Text style={styles.subtitle}>
          {prenotazioni.filter((p) => p.status === 'confirmed').length}{' '}
          prenotazioni attive
        </Text>
      </View>

      <FlatList
        data={prenotazioni}
        keyExtractor={(item) => item.id || String(item.eventoId)}
        renderItem={renderBookingCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎟️</Text>
            <Text style={styles.emptyText}>Nessuna prenotazione</Text>
            <Text style={styles.emptySubtext}>
              Prenota un evento per vederlo qui!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    color: colors.onSurface,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  bookingId: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xs,
  },
  eventName: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xs,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailIcon: {
    fontSize: fontSize.sm,
  },
  detailText: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
  },
  cancelButton: {
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptySubtext: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
});

export default MyBookingsScreen;
