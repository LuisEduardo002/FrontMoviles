import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import type { ComponentProps, PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { colors, glow } from '../theme/tokens';
import { hapticTap } from '../utils/haptics';
import Button from './Button';
import Notice from './Notice';
import { Body, Caption, Heading } from './Typography';

type IconName = ComponentProps<typeof MaterialDesignIcons>['name'];

/**
 * Pantalla con scroll para formularios. Tocar fuera de un campo cierra el
 * teclado (`keyboardShouldPersistTaps="handled"`) y en iOS el contenido se
 * corre solo para que el teclado no tape el botón de guardar.
 */
export function FormScreen({ children, centered }: PropsWithChildren<{ centered?: boolean }>) {
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName={`gap-4 p-3 pb-6 ${centered ? 'flex-grow justify-center' : ''}`}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets>
      <View className="w-full max-w-[640px] gap-4 self-center">{children}</View>
    </ScrollView>
  );
}

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

/** Cuando el detalle de algo no se pudo cargar: el porqué y la salida. */
export function ErrorScreen({ message }: { message: string }) {
  return (
    <View className="flex-1 justify-center gap-4 bg-canvas p-3">
      <Heading level="h2" className="text-center">
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
    <View className="gap-3 rounded-md bg-surface/60 p-3">
      <View className="gap-1">
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
    <View className="items-center gap-2 px-4 py-6">
      <MaterialDesignIcons name={icon} size={48} color={colors.disabledText} />
      <Heading level="h3" className="text-center">
        {title}
      </Heading>
      <Body muted className="text-center">
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
      className="mr-3 h-[40px] flex-row items-center gap-1 rounded-full bg-primary px-3 active:opacity-80"
      style={{ boxShadow: glow.primary }}>
      <MaterialDesignIcons name={icon} size={20} color={colors.inkInverted} />
      <Text className="font-body-bold text-caption text-ink-inverted">Nuevo</Text>
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
    <View className="mt-4 gap-3 rounded-md border border-danger/40 p-3">
      <Text className="font-body-semibold text-h3 text-danger">Zona de peligro</Text>
      <Caption>{description}</Caption>
      <Button text={buttonText} icon="delete-outline" variant="danger" onPress={onPress} disabled={disabled} />
    </View>
  );
}
