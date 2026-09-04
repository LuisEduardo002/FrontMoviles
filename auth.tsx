import { createContext, use, useState, type PropsWithChildren } from 'react';

export type User = { name: string; email: string };

// ponytail: "base de datos" en memoria. Reemplazar estas dos funciones por
// llamadas a la API real (fetch) cuando exista el backend.
const users = new Map<string, { password: string; user: User }>();

type AuthValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth debe usarse dentro de <AuthProvider />');
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext
      value={{
        user,
        signIn: async (email, password) => {
          const record = users.get(email.trim().toLowerCase());
          if (!record || record.password !== password) {
            throw new Error('Correo o contraseña incorrectos');
          }
          setUser(record.user);
        },
        signUp: async (name, email, password) => {
          const key = email.trim().toLowerCase();
          if (users.has(key)) throw new Error('Ese correo ya está registrado');
          const nuevo = { name: name.trim(), email: key };
          users.set(key, { password, user: nuevo });
          setUser(nuevo);
        },
        signOut: () => setUser(null),
      }}>
      {children}
    </AuthContext>
  );
}
