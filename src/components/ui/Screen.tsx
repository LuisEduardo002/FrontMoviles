import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import type { ComponentProps, PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { DangerZoneToken, EmptyStateToken, ErrorScreenToken, FormScreenToken, FormSectionToken, HeaderActionToken, LoadingScreenToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';
import { hapticTap } from '@/utils/haptics';
import Button from '@/components/ui/Button';
import Notice from '@/components/ui/Notice';
import { Body, Caption, Heading } from '@/components/ui/Typography';

type IconName = ComponentProps<typeof MaterialDesignIcons>['name'];

/**
 * Pantalla con scroll para formularios. Tocar fuera de un campo cierra el
 * teclado (`keyboardShouldPersistTaps="handled"`) y en iOS el contenido se
 * corre solo para que el teclado no tape el botón de guardar.
 */
export function FormScreen({ children, centered }: PropsWithChildren<{ centered?: boolean }>) {
  return (
    <ScrollView
      className={FormScreenToken.container}
      contentContainerClassName={`${FormScreenToken.content} ${centered ? FormScreenToken.centered : ''}`}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets>
      <View className={FormScreenToken.inner}>{children}</View>
    </ScrollView>
  );
}

export function LoadingScreen() {
  return (
    <View className={LoadingScreenToken.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

/** Cuando el detalle de algo no se pudo cargar: el porqué y la salida. */
export function ErrorScreen({ message }: { message: string }) {
  return (
    <View className={ErrorScreenToken.container}>
      <Heading level="h2" className={ErrorScreenToken.title}>
        No se pudo cargar
      </Heading>
      <Notice message={message} />
      <Button text="Volver" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}

/** Bloque de un formulario largo: agrupa campos relacionados bajo un título. */
export function FormSection({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <View className={FormSectionToken.container}>
      <View className={FormSectionToken.header}>
        <Heading level="h3">{title}</Heading>
        {!!description && <Caption>{description}</Caption>}
      </View>
      {children}
    </View>
  );
}

/** Lista sin resultados: dice por qué y, si aplica, cómo salir de ahí. */
export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: IconName;
  title: string;
  message: string;
}) {
  return (
    <View className={EmptyStateToken.container}>
      <MaterialDesignIcons name={icon} size={EmptyStateToken.iconSize} color={colors.disabledText} />
      <Heading level="h3" className={EmptyStateToken.text}>
        {title}
      </Heading>
      <Body muted className={EmptyStateToken.text}>
        {message}
      </Body>
    </View>
  );
}

/** Botón redondo del header para crear ("+"). */
export function HeaderAction({
  icon = 'plus',
  label,
  onPress,
}: {
  icon?: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        hapticTap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      className={HeaderActionToken.container}
      style={{ boxShadow: glow.primary }}>
      <MaterialDesignIcons name={icon} size={HeaderActionToken.iconSize} color={colors.inkInverted} />
      <Text className={HeaderActionToken.label}>Nuevo</Text>
    </Pressable>
  );
}

/**
 * Acción destructiva de un detalle. Va al final y separada de "Guardar" para
 * que nadie la toque por accidente.
 */
export function DangerZone({
  description,
  buttonText,
  onPress,
  disabled,
}: {
  description: string;
  buttonText: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View className={DangerZoneToken.container}>
      <Text className={DangerZoneToken.title}>Zona de peligro</Text>
      <Caption>{description}</Caption>
      <Button text={buttonText} icon="delete-outline" variant="danger" onPress={onPress} disabled={disabled} />
    </View>
  );
}
