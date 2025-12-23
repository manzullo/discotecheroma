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

// Ordine dei giorni della settimana
const GIORNI_ORDER: Record<string, number> = {
  'Lunedì': 1,
  'Martedì': 2,
  'Mercoledì': 3,
  'Giovedì': 4,
  'Venerdì': 5,
  'Sabato': 6,
  'Domenica': 7,
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

  // Ottieni il giorno corrente della settimana
  const oggi = new Date();
  const giornoCorrente = oggi.toLocaleDateString('it-IT', { weekday: 'long' });
  const giornoCapitalized = giornoCorrente.charAt(0).toUpperCase() + giornoCorrente.slice(1);

  // Filtra eventi per oggi
  const eventiOggi = eventi.filter(e => e.giorno === giornoCapitalized);

  // Eventi del weekend (venerdì, sabato, domenica)
  const eventiWeekend = eventi.filter(e =>
    ['Venerdì', 'Sabato', 'Domenica'].includes(e.giorno)
  );

  // Prendi alcuni eventi in evidenza (quelli con immagine)
  const eventiInEvidenza = eventi
    .filter(e => e.immagine)
    .slice(0, 5);

  // Conta locali unici
  const localiUnici = new Set(eventi.map(e => e.titolo.split(' - ')[0])).size;

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

        {/* Eventi di oggi */}
        {eventiOggi.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Stasera - {giornoCapitalized}</Text>
            {eventiOggi.slice(0, 3).map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onPress={() => handleEventPress(evento)}
                variant="large"
              />
            ))}
          </View>
        )}

        {/* In Evidenza */}
        {eventiInEvidenza.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ In Evidenza</Text>
            {eventiInEvidenza.slice(0, 3).map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onPress={() => handleEventPress(evento)}
                variant="compact"
              />
            ))}
          </View>
        )}

        {/* Weekend */}
        {eventiWeekend.length > 0 && !eventiOggi.length && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎉 Questo Weekend</Text>
            {eventiWeekend.slice(0, 4).map((evento) => (
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
            <Text style={styles.statNumber}>{localiUnici}+</Text>
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
