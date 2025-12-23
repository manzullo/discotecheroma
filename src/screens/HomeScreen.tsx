import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { EventCard, LoadingSpinner } from '../components';
import { fetchEventi } from '../services/api';
import { Evento, RootStackParamList } from '../types';
import { colors, spacing, fontSize, fontWeight } from '../theme';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEventi = async () => {
    try {
      const data = await fetchEventi();
      setEventi(data);
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

  // Ordina gli eventi per data e prendi i prossimi
  const sortedEventi = [...eventi].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const featuredEvent = sortedEventi[0];
  const upcomingEvents = sortedEventi.slice(1, 5);

  if (loading) {
    return <LoadingSpinner message="Caricamento eventi..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Benvenuto su</Text>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logo}>Discoteche Roma</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>Le migliori serate della capitale</Text>
        </View>

        {/* Featured Event */}
        {featuredEvent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 In Evidenza</Text>
            <EventCard
              evento={featuredEvent}
              onPress={() => handleEventPress(featuredEvent)}
              variant="large"
            />
          </View>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Prossimi Eventi</Text>
            {upcomingEvents.map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onPress={() => handleEventPress(evento)}
                variant="compact"
              />
            ))}
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{eventi.length}</Text>
            <Text style={styles.statLabel}>Eventi</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15+</Text>
            <Text style={styles.statLabel}>Locali</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Prenotazioni</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  logoGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginVertical: spacing.xs,
  },
  logo: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
