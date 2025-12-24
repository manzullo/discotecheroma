import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return fontSize.sm;
      case 'large':
        return fontSize.lg;
      default:
        return fontSize.md;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          button: [
            styles.button,
            styles.filledButton,
            isDisabled && styles.filledButtonDisabled,
          ],
          text: [styles.filledText],
          loadingColor: colors.onPrimary,
        };
      case 'tonal':
        return {
          button: [
            styles.button,
            styles.tonalButton,
            isDisabled && styles.tonalButtonDisabled,
          ],
          text: [styles.tonalText],
          loadingColor: colors.onSecondaryContainer,
        };
      case 'outlined':
        return {
          button: [
            styles.button,
            styles.outlinedButton,
            isDisabled && styles.outlinedButtonDisabled,
          ],
          text: [styles.outlinedText, isDisabled && styles.outlinedTextDisabled],
          loadingColor: colors.primary,
        };
      case 'text':
        return {
          button: [styles.button, styles.textButton],
          text: [styles.textButtonText, isDisabled && styles.textButtonTextDisabled],
          loadingColor: colors.primary,
        };
      default:
        return {
          button: [styles.button, styles.filledButton],
          text: [styles.filledText],
          loadingColor: colors.onPrimary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        ...variantStyles.button,
        { height: getButtonHeight() },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.loadingColor} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              ...variantStyles.text,
              { fontSize: getTextSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  // Filled button (primary)
  filledButton: {
    backgroundColor: colors.primary,
  },
  filledButtonDisabled: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  filledText: {
    color: colors.onPrimary,
    fontWeight: fontWeight.semibold,
  },
  // Tonal button (secondary container)
  tonalButton: {
    backgroundColor: colors.secondaryContainer,
  },
  tonalButtonDisabled: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  tonalText: {
    color: colors.onSecondaryContainer,
    fontWeight: fontWeight.semibold,
  },
  // Outlined button
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  outlinedButtonDisabled: {
    borderColor: colors.surfaceContainerHighest,
  },
  outlinedText: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  outlinedTextDisabled: {
    color: colors.onSurfaceVariant,
  },
  // Text button
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
  },
  textButtonText: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  textButtonTextDisabled: {
    color: colors.onSurfaceVariant,
  },
});

export default Button;
