import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Linking, View } from 'react-native';
import Button from '@/components/ui/Button';
import { FormScreen } from '@/components/ui/Screen';
import { Body, Heading } from '@/components/ui/Typography';
import { PermissionDeniedToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import type { BlockedPermission } from '@/utils/scan';

const COPY: Record<BlockedPermission, { icon: 'camera-off' | 'map-marker-off'; title: string; body: string }> = {
  camera: {
    icon: 'camera-off',
    title: 'Necesitamos la cámara',
    body: 'La usamos solo para leer el QR de la etiqueta. Actívala en Ajustes o escribe el código a mano.',
  },
  location: {
    icon: 'map-marker-off',
    title: 'Necesitamos tu ubicación',
    body: 'Confirmamos que estás junto al tag antes de darte los puntos. Actívala en Ajustes para registrarlo.',
  },
};

/** Explica qué permiso falta y lleva a Ajustes, donde el sistema deja activarlo. */
export default function PermissionDenied({ permission, onBack }: { permission: BlockedPermission; onBack: () => void }) {
  const copy = COPY[permission];

  return (
    <FormScreen centered>
      <View className={PermissionDeniedToken.intro}>
        <MaterialDesignIcons name={copy.icon} size={PermissionDeniedToken.iconSize} color={colors.danger} />
        <Heading level="h2" className={PermissionDeniedToken.centered}>
          {copy.title}
        </Heading>
        <Body muted className={PermissionDeniedToken.centered}>
          {copy.body}
        </Body>
      </View>
      <Button text="Abrir Ajustes" icon="cog-outline" onPress={() => void Linking.openSettings()} />
      <Button text="Volver" variant="secondary" onPress={onBack} />
    </FormScreen>
  );
}
