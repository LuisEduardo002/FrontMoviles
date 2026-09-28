import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

/**
 * Carga datos cada vez que la pantalla recupera el foco (al volver de crear o
 * editar, la lista ya trae el cambio) y expone el estado que pintan las listas.
 *
 * Solo la primera carga muestra el indicador de pantalla completa: las
 * siguientes refrescan en silencio para que volver atrás no parpadee.
 */
export function useFocusLoad<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      setData(await loaderRef.current());
      setError(null);
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { data, isLoading, isRefreshing, error, refresh: () => void load(true) };
}
