import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventCard, LoadingSpinner } from '../components';
import { fetchEventi } from '../services/api';
import { Evento, RootStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

type EventsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const GIORNI = ['Tutti', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [filteredEventi, setFilteredEventi] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Tutti');

  const loadEventi = async () => {
    try {
      const data = await fetchEventi();
      setEventi(data);
      filterByDay(data, selectedDay);
    } catch (error) {
      console.error('Errore caricamento eventi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterByDay = (eventiList: Evento[], day: string) => {
    if (day === 'Tutti') {
      setFilteredEventi(eventiList);
    } else {
      setFilteredEventi(eventiList.filter(e => e.giorno === day));
    }
  };

  useEffect(() => {
    loadEventi();
  }, []);

  useEffect(() => {
    filterByDay(eventi, selectedDay);
  }, [selectedDay, eventi]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEventi();
  };

  const handleEventPress = (evento: Evento) => {
    navigation.navigate('EventDetail', { evento });
  };

  if (loading) {
    return <LoadingSpinner message="Caricamento eventi..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Eventi</Text>
        <Text style={styles.subtitle}>{filteredEventi.length} eventi disponibili</Text>
      </View>

      {/* Day Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {GIORNI.map((giorno) => (
          <TouchableOpacity
            key={giorno}
            style={[
              styles.filterButton,
              selectedDay === giorno && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDay(giorno)}
          >
            <Text
              style={[
                styles.filterText,
                selectedDay === giorno && styles.filterTextActive,
              ]}
            >
              {giorno}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredEventi}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            evento={item}
            onPress={() => handleEventPress(item)}
            variant="large"
          />
        )}
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
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Nessun evento per {selectedDay}</Text>
            <Text style={styles.emptySubtext}>
              Prova a selezionare un altro giorno!
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    marginRight: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  filterTextActive: {
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
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
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
});

export default EventsScreen;
