import { router } from 'expo-router';
import { Text, View } from 'react-native';
import CollectibleCard from '@/components/player/CollectibleCard';
import Button from '@/components/ui/Button';
import { FormScreen } from '@/components/ui/Screen';
import { Body, Caption } from '@/components/ui/Typography';
import { ScanRewardToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import type { ScanResult } from '@/types';

/** La recompensa: la carta ganada, los puntos y a dónde seguir. */
export default function ScanReward({ result, onContinue }: { result: ScanResult; onContinue: () => void }) {
  const { tag } = result;

  return (
    <FormScreen centered>
      <View className={ScanRewardToken.result}>
        <Caption>¡Tag encontrado!</Caption>
        <Text
          className={ScanRewardToken.points}
          style={{ textShadowColor: colors.primary, textShadowRadius: ScanRewardToken.pointsGlowRadius }}>
          +{result.pointsEarned}
        </Text>
        <Body muted>Ahora tienes {result.totalPoints} puntos</Body>
      </View>

      <View className={ScanRewardToken.card}>
        <CollectibleCard
          title={tag.cardTitle ?? tag.name}
          subtitle={tag.name}
          imageUrl={tag.cardImageUrl}
          points={result.pointsEarned}
        />
      </View>

      {!!tag.cardFunFact && (
        <View className={ScanRewardToken.funFact}>
          <Text className={ScanRewardToken.funFactTitle}>Dato curioso</Text>
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
