/**
 * Almacén en memoria para los CRUD del panel admin.
 *
 * Existe porque el backend de users/events/scans_history todavía no está
 * listo: con esto la app demuestra el CRUD de extremo a extremo (crear, buscar,
 * modificar con solo lo cambiado, eliminar con confirmación) sin servidor.
 *
 * Cuando el backend exista: `EXPO_PUBLIC_USE_MOCK=false` y estos datos se
 * ignoran. Los módulos `users.ts`, `events.ts` y `scans.ts` ya saben a qué
 * rutas llamar; aquí no hay nada que migrar.
 */

import type { AdminEvent, AdminUser, CreateEventDto, CreateScanDto, CreateUserDto, Role, ScanHistory, UpdateEventDto, UpdateScanDto, UpdateUserDto } from '../types';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

let seq = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq += 1)}`;
const nowIso = () => new Date().toISOString();

const users: AdminUser[] = [
  { id: 'u-admin', nickname: 'admin_nfh', email: 'admin@nfhunter.app', role: 'ADMIN', totalPoints: 1200, levelTitle: 'Guardián Urbano', createdAt: '2026-01-10T10:00:00.000Z' },
  { id: 'u-ana', nickname: 'ana_explora', email: 'ana@ejemplo.com', role: 'USER', totalPoints: 450, levelTitle: 'Exploradora Urbana', createdAt: '2026-02-02T15:30:00.000Z' },
  { id: 'u-bruno', nickname: 'bruno_caza', email: 'bruno@ejemplo.com', role: 'USER', totalPoints: 820, levelTitle: 'Rastreador', createdAt: '2026-02-14T09:12:00.000Z' },
  { id: 'u-carla', nickname: 'carla_nocturna', email: 'carla@ejemplo.com', role: 'USER', totalPoints: 130, levelTitle: 'Aprendiz', createdAt: '2026-03-01T20:45:00.000Z' },
];

const events: AdminEvent[] = [
  { id: 'e-1', name: 'Festival Centro 2026', description: 'Rally de escaneos por el centro histórico.', startDate: '2026-09-20', endDate: '2026-09-22', isActive: true, createdAt: '2026-08-01T10:00:00.000Z' },
  { id: 'e-2', name: 'Temporada Parques', description: 'Tags escondidos en los parques del norte.', startDate: '2026-10-01', endDate: '2026-10-31', isActive: true, createdAt: '2026-08-15T10:00:00.000Z' },
  { id: 'e-3', name: 'Rally Universitario', description: 'Competencia entre campus.', startDate: '2026-06-01', endDate: '2026-06-05', isActive: false, createdAt: '2026-05-01T10:00:00.000Z' },
];

const scans: ScanHistory[] = [
  { id: 's-1', userId: 'u-ana', tagCode: 'TAG-PLAZA-001', location: 'Plaza central, frente a la fuente', pointsEarned: 50, scannedAt: '2026-09-10T18:32:00.000Z' },
  { id: 's-2', userId: 'u-bruno', tagCode: 'TAG-PARQUE-014', location: 'Parque norte, entrada principal', pointsEarned: 30, scannedAt: '2026-09-11T10:05:00.000Z' },
  { id: 's-3', userId: 'u-ana', tagCode: 'TAG-MUSEO-003', location: 'Museo de la ciudad, sala 2', pointsEarned: 80, scannedAt: '2026-09-12T16:20:00.000Z' },
  { id: 's-4', userId: 'u-carla', tagCode: 'TAG-CAMPUS-007', location: 'Campus universitario, biblioteca', pointsEarned: 20, scannedAt: '2026-09-13T09:41:00.000Z' },
  { id: 's-5', userId: 'u-bruno', tagCode: 'TAG-PLAZA-002', location: 'Plaza central, quiosco', pointsEarned: 50, scannedAt: '2026-09-14T19:02:00.000Z' },
];

function withUser(scan: ScanHistory): ScanHistory {
  const user = users.find((u) => u.id === scan.userId);
  return { ...scan, user: user ? { id: user.id, nickname: user.nickname, email: user.email } : undefined };
}

// --- Users ---------------------------------------------------------------

export async function mockListUsers(): Promise<AdminUser[]> {
  await delay();
  return [...users].sort((a, b) => a.nickname.localeCompare(b.nickname));
}

export async function mockGetUser(id: string): Promise<AdminUser> {
  await delay(250);
  const found = users.find((u) => u.id === id);
  if (!found) throw new Error('Usuario no encontrado.');
  return { ...found };
}

export async function mockCreateUser(body: CreateUserDto): Promise<AdminUser> {
  await delay();
  const emailTaken = users.some((u) => u.email.toLowerCase() === body.email.trim().toLowerCase());
  if (emailTaken) throw new Error('El correo ya está registrado.');
  const nickTaken = users.some((u) => u.nickname.toLowerCase() === body.nickname.trim().toLowerCase());
  if (nickTaken) throw new Error('El apodo ya está en uso.');
  const created: AdminUser = {
    id: newId('u'),
    nickname: body.nickname.trim(),
    email: body.email.trim().toLowerCase(),
    role: body.role satisfies Role,
    totalPoints: body.totalPoints,
    levelTitle: body.levelTitle.trim(),
    createdAt: nowIso(),
  };
  users.push(created);
  return { ...created };
}

export async function mockUpdateUser(id: string, patch: UpdateUserDto): Promise<AdminUser> {
  await delay();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('Usuario no encontrado.');
  if (patch.email !== undefined) {
    const taken = users.some((u) => u.id !== id && u.email.toLowerCase() === patch.email!.trim().toLowerCase());
    if (taken) throw new Error('El correo ya está registrado.');
  }
  if (patch.nickname !== undefined) {
    const taken = users.some((u) => u.id !== id && u.nickname.toLowerCase() === patch.nickname!.trim().toLowerCase());
    if (taken) throw new Error('El apodo ya está en uso.');
  }
  const current = users[index];
  const next: AdminUser = {
    ...current,
    ...(patch.nickname !== undefined ? { nickname: patch.nickname.trim() } : {}),
    ...(patch.email !== undefined ? { email: patch.email.trim().toLowerCase() } : {}),
    ...(patch.role !== undefined ? { role: patch.role } : {}),
    ...(patch.totalPoints !== undefined ? { totalPoints: patch.totalPoints } : {}),
    ...(patch.levelTitle !== undefined ? { levelTitle: patch.levelTitle.trim() } : {}),
  };
  users[index] = next;
  return { ...next };
}

export async function mockDeleteUser(id: string): Promise<void> {
  await delay();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('Usuario no encontrado.');
  const hasScans = scans.some((s) => s.userId === id);
  if (hasScans) throw new Error('No se puede eliminar: el usuario tiene escaneos registrados.');
  users.splice(index, 1);
}

// --- Events --------------------------------------------------------------

export async function mockListEvents(): Promise<AdminEvent[]> {
  await delay();
  return [...events].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export async function mockGetEvent(id: string): Promise<AdminEvent> {
  await delay(250);
  const found = events.find((e) => e.id === id);
  if (!found) throw new Error('Evento no encontrado.');
  return { ...found };
}

export async function mockCreateEvent(body: CreateEventDto): Promise<AdminEvent> {
  await delay();
  const created: AdminEvent = { id: newId('e'), ...body, createdAt: nowIso() };
  events.push(created);
  return { ...created };
}

export async function mockUpdateEvent(id: string, patch: UpdateEventDto): Promise<AdminEvent> {
  await delay();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Evento no encontrado.');
  events[index] = { ...events[index], ...patch };
  return { ...events[index] };
}

export async function mockDeleteEvent(id: string): Promise<void> {
  await delay();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Evento no encontrado.');
  events.splice(index, 1);
}

// --- Scans ---------------------------------------------------------------

export async function mockListScans(): Promise<ScanHistory[]> {
  await delay();
  return [...scans].sort((a, b) => b.scannedAt.localeCompare(a.scannedAt)).map(withUser);
}

export async function mockGetScan(id: string): Promise<ScanHistory> {
  await delay(250);
  const found = scans.find((s) => s.id === id);
  if (!found) throw new Error('Escaneo no encontrado.');
  return withUser({ ...found });
}

export async function mockCreateScan(body: CreateScanDto): Promise<ScanHistory> {
  await delay();
  if (!users.some((u) => u.id === body.userId)) throw new Error('El usuario indicado no existe.');
  const created: ScanHistory = { id: newId('s'), ...body };
  scans.push(created);
  const owner = users.find((u) => u.id === body.userId);
  if (owner) owner.totalPoints += body.pointsEarned;
  return withUser({ ...created });
}

export async function mockUpdateScan(id: string, patch: UpdateScanDto): Promise<ScanHistory> {
  await delay();
  const index = scans.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Escaneo no encontrado.');
  if (patch.userId !== undefined && !users.some((u) => u.id === patch.userId)) {
    throw new Error('El usuario indicado no existe.');
  }
  scans[index] = { ...scans[index], ...patch };
  return withUser({ ...scans[index] });
}

export async function mockDeleteScan(id: string): Promise<void> {
  await delay();
  const index = scans.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Escaneo no encontrado.');
  scans.splice(index, 1);
}
