import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventCard, LoadingSpinner } from '../components';
import { fetchEventi } from '../services/api';
import { Evento, RootStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight } from '../theme';

type EventsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEventi = async () => {
    try {
      const data = await fetchEventi();
      // Ordina per data
      const sorted = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEventi(sorted);
    } catch (error) {
      console.error('Errore caricamento eventi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEventi();
  }, []);

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
        <Text style={styles.title}>Tutti gli Eventi</Text>
        <Text style={styles.subtitle}>{eventi.length} eventi disponibili</Text>
      </View>

      <FlatList
        data={eventi}
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
            <Text style={styles.emptyText}>Nessun evento disponibile</Text>
            <Text style={styles.emptySubtext}>
              Torna più tardi per scoprire nuovi eventi!
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
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
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
