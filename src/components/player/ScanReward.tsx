import { router } from 'expo-router';
import { Text, View } from 'react-native';
import CollectibleCard from '@/components/player/CollectibleCard';
import Button from '@/components/ui/Button';
import { FormScreen } from '@/components/ui/Screen';
import { Body, Caption } from '@/components/ui/Typography';
import { colors } from '@/theme/tokens';
import type { ScanResult } from '@/types';

/** La recompensa: la carta ganada, los puntos y a dónde seguir. */
export default function ScanReward({ result, onContinue }: { result: ScanResult; onContinue: () => void }) {
  const { tag } = result;

  return (
    <FormScreen centered>
      <View className="items-center gap-1">
        <Caption>¡Tag encontrado!</Caption>
        <Text
          className="font-data-black text-display text-primary"
          style={{ textShadowColor: colors.primary, textShadowRadius: 16 }}>
          +{result.pointsEarned}
        </Text>
        <Body muted>Ahora tienes {result.totalPoints} puntos</Body>
      </View>

      <View className="w-[220px] self-center">
        <CollectibleCard
          title={tag.cardTitle ?? tag.name}
          subtitle={tag.name}
          imageUrl={tag.cardImageUrl}
          points={result.pointsEarned}
        />
      </View>

      {!!tag.cardFunFact && (
        <View className="gap-1 rounded-md bg-surface p-3">
          <Text className="font-body-semibold text-body text-secondary">Dato curioso</Text>
          <Body>{tag.cardFunFact}</Body>
        </View>
      )}

      <Button text="Seguir cazando" icon="qrcode-scan" onPress={onContinue} />
      <Button
        text="Ver mi álbum"
        icon="cards-outline"
        variant="secondary"
        onPress={() => {
          onContinue();
          router.navigate('/(tabs)/perfil');
        }}
      />
    </FormScreen>
  );
}
