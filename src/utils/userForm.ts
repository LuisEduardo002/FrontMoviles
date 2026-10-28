/**
 * Lógica compartida del formulario de usuarios (mismo papel que `tagForm.ts`):
 * valores, reglas y conversión formulario <-> DTO.
 */

import type { AdminUser, CreateUserDto, Role, UpdateUserDto } from '@/types';

/** Todo texto salvo `role`: los números viajan como string por el TextInput. */
export interface UserFormValues {
  nickname: string;
  email: string;
  /** Al editar, vacío significa "no cambiar". */
  password: string;
  role: Role;
  /** Solo se edita en el detalle: un usuario nuevo empieza en 0. */
  totalPoints: string;
  levelTitle: string;
}

export const USER_DEFAULTS: UserFormValues = {
  nickname: '',
  email: '',
  password: '',
  role: 'USER',
  totalPoints: '0',
  levelTitle: 'Aprendiz',
};

export const ROLE_OPTIONS = [
  { label: 'Jugador', value: 'USER' },
  { label: 'Administrador', value: 'ADMIN' },
] as const;

export function validateTotalPoints(value: string): true | string {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) return 'Debe ser un entero mayor o igual a 0';
  if (n > 999999) return 'Máximo 999999';
  return true;
}

/** Un usuario del backend al formulario. La contraseña nunca vuelve del servidor. */
export function userToForm(user: AdminUser): UserFormValues {
  return {
    nickname: user.nickname,
    email: user.email,
    password: '',
    role: user.role,
    totalPoints: String(user.totalPoints),
    levelTitle: user.levelTitle ?? '',
  };
}

export function formToCreateUser(values: UserFormValues): CreateUserDto {
  return {
    nickname: values.nickname.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    role: values.role,
    levelTitle: values.levelTitle.trim(),
  };
}

type Dirty = Partial<Record<keyof UserFormValues, boolean>>;

/** Del formulario de editar al PATCH: solo viaja lo que cambió. */
export function formToUpdateUser(values: UserFormValues, dirty: Dirty): UpdateUserDto {
  const patch: UpdateUserDto = {};
  if (dirty.nickname) patch.nickname = values.nickname.trim();
  if (dirty.email) patch.email = values.email.trim().toLowerCase();
  if (dirty.password && values.password) patch.password = values.password;
  if (dirty.role) patch.role = values.role;
  if (dirty.totalPoints) patch.totalPoints = Number(values.totalPoints);
  if (dirty.levelTitle) patch.levelTitle = values.levelTitle.trim();
  return patch;
}
