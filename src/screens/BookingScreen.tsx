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
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '../components';
import { savePrenotazione } from '../services/api';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, elevation } from '../theme';

type BookingScreenProps = NativeStackScreenProps<RootStackParamList, 'Booking'>;

interface FormData {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  numeroPosti: number;
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

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    numeroPosti: 1,
    note: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

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
    if (formData.numeroPosti < 1) {
      newErrors.numeroPosti = 'Inserisci almeno 1 posto';
    } else if (formData.numeroPosti > 10) {
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
        nomeEvento: evento.titolo,
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        numeroPosti: formData.numeroPosti,
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

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const incrementPosti = () => {
    if (formData.numeroPosti < 10) {
      updateField('numeroPosti', formData.numeroPosti + 1);
    }
  };

  const decrementPosti = () => {
    if (formData.numeroPosti > 1) {
      updateField('numeroPosti', formData.numeroPosti - 1);
    }
  };

  // Estrai il nome del locale dal titolo (es. "Volo - Venerdì" -> "Volo")
  const nomeLocale = evento.titolo.split(' - ')[0];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

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
          <View style={[styles.eventSummary, elevation.level1]}>
            <Text style={styles.eventTitle}>{evento.titolo}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetail}>
                <Text style={styles.eventDetailIcon}>📅</Text>
                <Text style={styles.eventDetailText}>{evento.giorno}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Text style={styles.eventDetailIcon}>📍</Text>
                <Text style={styles.eventDetailText}>{nomeLocale}</Text>
              </View>
              {evento.prezzoMinimo && (
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>💰</Text>
                  <Text style={styles.eventDetailText}>da {evento.prezzoMinimo}€</Text>
                </View>
              )}
              {evento.etaMinima && (
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>🔞</Text>
                  <Text style={styles.eventDetailText}>{evento.etaMinima}+</Text>
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

            {/* Numero Posti Stepper */}
            <View style={styles.stepperContainer}>
              <Text style={styles.stepperLabel}>Numero di posti *</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[
                    styles.stepperButton,
                    formData.numeroPosti <= 1 && styles.stepperButtonDisabled,
                  ]}
                  onPress={decrementPosti}
                  disabled={formData.numeroPosti <= 1}
                >
                  <Text
                    style={[
                      styles.stepperButtonText,
                      formData.numeroPosti <= 1 && styles.stepperButtonTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <View style={styles.stepperValue}>
                  <Text style={styles.stepperValueText}>{formData.numeroPosti}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.stepperButton,
                    formData.numeroPosti >= 10 && styles.stepperButtonDisabled,
                  ]}
                  onPress={incrementPosti}
                  disabled={formData.numeroPosti >= 10}
                >
                  <Text
                    style={[
                      styles.stepperButtonText,
                      formData.numeroPosti >= 10 && styles.stepperButtonTextDisabled,
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.numeroPosti && (
                <Text style={styles.errorText}>{errors.numeroPosti}</Text>
              )}
            </View>

            <Input
              label="Note (opzionale)"
              placeholder="Richieste speciali, tavolo VIP, compleanno..."
              value={formData.note}
              onChangeText={(value) => updateField('note', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Info */}
          <View style={[styles.infoBox, elevation.level1]}>
            <Text style={styles.infoTitle}>Come funziona?</Text>
            <Text style={styles.infoText}>
              Inserisci i tuoi dati per entrare in lista. Riceverai una conferma via email.
              Il pagamento avverrà direttamente in cassa la sera dell'evento.
            </Text>
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
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  eventTitle: {
    color: colors.onSurface,
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
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
  },
  form: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    color: colors.onSurface,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  stepperContainer: {
    marginBottom: spacing.md,
  },
  stepperLabel: {
    color: colors.onSurface,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: 'hidden',
  },
  stepperButton: {
    width: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
  },
  stepperButtonDisabled: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  stepperButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  stepperButtonTextDisabled: {
    color: colors.outline,
  },
  stepperValue: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
  },
  stepperValueText: {
    fontSize: fontSize.xl,
    color: colors.onSurface,
    fontWeight: fontWeight.semibold,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  infoBox: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoTitle: {
    color: colors.onSecondaryContainer,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  infoText: {
    color: colors.onSecondaryContainer,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: spacing.md,
  },
  disclaimer: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
});

export default BookingScreen;
