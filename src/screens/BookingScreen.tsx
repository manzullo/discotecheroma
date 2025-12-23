import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '../components';
import { savePrenotazione } from '../services/api';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

type BookingScreenProps = NativeStackScreenProps<RootStackParamList, 'Booking'>;

interface FormData {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  numeroPosti: string;
  note: string;
}

interface FormErrors {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  numeroPosti?: string;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  route,
  navigation,
}) => {
  const { evento } = route.params;
  const acf = evento.acf || {};

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    numeroPosti: '1',
    note: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Il nome è obbligatorio';
    }
    if (!formData.cognome.trim()) {
      newErrors.cognome = 'Il cognome è obbligatorio';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un email valida';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Il telefono è obbligatorio';
    } else if (!/^[0-9+\s-]{8,}$/.test(formData.telefono)) {
      newErrors.telefono = 'Inserisci un numero valido';
    }
    if (!formData.numeroPosti || parseInt(formData.numeroPosti) < 1) {
      newErrors.numeroPosti = 'Inserisci almeno 1 posto';
    } else if (parseInt(formData.numeroPosti) > 10) {
      newErrors.numeroPosti = 'Massimo 10 posti per prenotazione';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const prenotazione = await savePrenotazione({
        eventoId: evento.id,
        nomeEvento: stripHtml(evento.title.rendered),
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        numeroPosti: parseInt(formData.numeroPosti),
        note: formData.note,
      });

      navigation.replace('BookingConfirmation', { prenotazione });
    } catch (error) {
      Alert.alert(
        'Errore',
        'Si è verificato un errore durante la prenotazione. Riprova più tardi.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Event Summary */}
          <View style={styles.eventSummary}>
            <Text style={styles.eventTitle}>{stripHtml(evento.title.rendered)}</Text>
            <View style={styles.eventDetails}>
              {acf.data_evento && (
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>📅</Text>
                  <Text style={styles.eventDetailText}>{acf.data_evento}</Text>
                </View>
              )}
              {acf.location && (
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>📍</Text>
                  <Text style={styles.eventDetailText}>{acf.location}</Text>
                </View>
              )}
              {acf.prezzo_prevendita && (
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>💰</Text>
                  <Text style={styles.eventDetailText}>{acf.prezzo_prevendita} / persona</Text>
                </View>
              )}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Dati Prenotazione</Text>

            <Input
              label="Nome *"
              placeholder="Il tuo nome"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
              error={errors.nome}
              autoCapitalize="words"
            />

            <Input
              label="Cognome *"
              placeholder="Il tuo cognome"
              value={formData.cognome}
              onChangeText={(value) => updateField('cognome', value)}
              error={errors.cognome}
              autoCapitalize="words"
            />

            <Input
              label="Email *"
              placeholder="email@esempio.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Telefono *"
              placeholder="+39 333 1234567"
              value={formData.telefono}
              onChangeText={(value) => updateField('telefono', value)}
              error={errors.telefono}
              keyboardType="phone-pad"
            />

            <Input
              label="Numero di posti *"
              placeholder="1"
              value={formData.numeroPosti}
              onChangeText={(value) => updateField('numeroPosti', value)}
              error={errors.numeroPosti}
              keyboardType="number-pad"
            />

            <Input
              label="Note (opzionale)"
              placeholder="Richieste speciali, tavolo VIP, compleanno..."
              value={formData.note}
              onChangeText={(value) => updateField('note', value)}
              multiline
              numberOfLines={3}
              style={styles.notesInput}
            />
          </View>

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {formData.numeroPosti || '0'} x {acf.prezzo_prevendita || 'Gratis'}
              </Text>
              <Text style={styles.priceValue}>
                {acf.prezzo_prevendita
                  ? `${parseInt(acf.prezzo_prevendita) * parseInt(formData.numeroPosti || '0')}€`
                  : 'Gratis'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Totale</Text>
              <Text style={styles.totalValue}>
                {acf.prezzo_prevendita
                  ? `${parseInt(acf.prezzo_prevendita) * parseInt(formData.numeroPosti || '0')}€`
                  : 'Gratis'}
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title="Conferma Prenotazione"
            onPress={handleSubmit}
            loading={loading}
            size="large"
            style={styles.submitButton}
          />

          <Text style={styles.disclaimer}>
            Confermando la prenotazione accetti i termini e condizioni del servizio.
            Il pagamento avverrà direttamente in cassa la sera dell'evento.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  eventSummary: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  eventTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  eventDetails: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventDetailIcon: {
    fontSize: fontSize.sm,
  },
  eventDetailText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  form: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priceSummary: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  priceValue: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  totalValue: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  submitButton: {
    marginBottom: spacing.md,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
});

export default BookingScreen;
