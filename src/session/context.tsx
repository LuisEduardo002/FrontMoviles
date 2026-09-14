/**
 * Contexto de sesión: quién está dentro de la app en este momento.
 *
 * Un "contexto" de React es un valor que se comparte con todas las pantallas
 * sin tener que pasarlo de una a otra por props. Aquí viven el usuario y el
 * token, y las tres acciones que los cambian: entrar, registrarse y salir.
 */

import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';
import * as api from '../api/auth';
import { setToken as setRequestToken } from '../api/client';
import type { AuthResponse, AuthUser } from '../types';
import { decodeJwt, isExpired } from './jwt';
import { loadToken, removeToken, saveToken } from './storage';

interface Session {
  /** null = nadie ha entrado. El layout raíz usa esto para decidir qué mostrar. */
  user: AuthUser | null;
  /** El JWT en crudo. Útil si alguna pantalla necesita mandarlo a mano. */
  token: string | null;
  /** true mientras se busca una sesión guardada, al arrancar la app. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nickname: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<Session | null>(null);

/**
 * SOLO PARA PRUEBAS: en true entra directo a los tabs sin pedir login.
 * Ponlo en false cuando quieras volver a exigir correo + contraseña.
 */
const BYPASS_AUTH_FOR_TESTS = true;
const DEV_USER: AuthUser = { id: 'dev-id', email: 'dev@prueba.com', role: 'USER' };

/** Atajo para leer la sesión desde cualquier pantalla: `const { user } = useSession()`. */
export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  /** Deja la sesión abierta: en memoria, en el cliente HTTP y en el llavero. */
  const openSession = async (session: AuthResponse) => {
    setRequestToken(session.access_token);
    setToken(session.access_token);
    setUser(session.user);
    await saveToken(session.access_token);
  };

  /**
   * Al arrancar: ¿hay una sesión de la última vez?
   *
   * Como el backend no tiene endpoint de perfil, el usuario se reconstruye con
   * lo que el propio token trae firmado (`sub` es el id). Si está vencido, se
   * borra y se arranca sin sesión.
   */
  useEffect(() => {
    const restore = async () => {
      try {
        // Atajo de pruebas: finge una sesión para ver los tabs sin logearte.
        if (__DEV__ && BYPASS_AUTH_FOR_TESTS) {
          setToken('dev-token');
          setUser(DEV_USER);
          return;
        }

        const stored = await loadToken();
        if (!stored) return;

        const payload = decodeJwt(stored);
        if (!payload || isExpired(payload)) {
          await removeToken();
          return;
        }

        setRequestToken(stored);
        setToken(stored);
        setUser({ id: payload.sub, email: payload.email, role: payload.role });
      } finally {
        // Pase lo que pase se apaga el cargando, o la app se queda en la
        // pantalla de espera para siempre.
        setLoading(false);
      }
    };

    void restore();
  }, []);

  /**
   * Pide el token al backend y lo deja disponible para las siguientes
   * peticiones. Si las credenciales son malas, `api.login` lanza el error del
   * servidor ("Credenciales inválidas.") y la pantalla de login lo muestra:
   * aquí no se atrapa.
   */
  const login = async (email: string, password: string) => {
    const session = await api.login({ email: email.trim().toLowerCase(), password });
    await openSession(session);
  };

  /**
   * Crea la cuenta y entra de una vez: /auth/register ya devuelve token, así que
   * no hace falta un login posterior.
   *
   * El apodo se manda tal cual lo escribió el usuario (solo sin espacios a los
   * lados): es único en la base y se muestra a los demás jugadores, así que las
   * mayúsculas son suyas. El correo sí se normaliza a minúsculas.
   */
  const register = async (nickname: string, email: string, password: string) => {
    const session = await api.register({
      nickname: nickname.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    await openSession(session);
  };

  const logout = async () => {
    setRequestToken(null);
    setToken(null);
    setUser(null);
    await removeToken();
  };

  return (
    <SessionContext value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </SessionContext>
  );
}
