/**
 * Clases de cada componente y pantalla, en un solo lugar. Un objeto por
 * componente (`ButtonToken`, `CardToken`...) con una clave por cada parte.
 *
 * Los valores (colores, fuentes, resplandores) siguen en `tokens.js`; aquí
 * solo se combinan en clases. Si cambias cómo se ve algo, cámbialo aquí, no
 * en el componente. Las variantes (`tone`, `state`...) son mapas: el
 * componente elige la clave, no escribe clases.
 */

//atomos
export const TypographyToken = {
  heading: {
    display: 'font-data-black text-display',
    h1: 'font-data text-h1',
    h2: 'font-data text-h2',
    h3: 'font-body-semibold text-h3',
  },
  headingColor: 'text-ink',
  body: 'font-body text-body',
  bodyColor: { default: 'text-ink', muted: 'text-ink/70' },
  caption: 'font-body text-caption text-ink/60',
} as const;

export const ButtonToken = {
  container: 'min-h-[48px] flex-row items-center justify-center gap-2 rounded-full px-4 py-3',
  variant: {
    primary: 'bg-primary active:opacity-80',
    secondary: 'border-2 border-secondary active:bg-secondary/15',
    danger: 'border-2 border-danger active:bg-danger/15',
  },
  disabled: { primary: 'bg-disabled', outline: 'border-2 border-disabled' },
  label: 'font-body-bold text-button',
  labelVariant: { primary: 'text-ink-inverted', secondary: 'text-secondary', danger: 'text-danger' },
  labelDisabled: 'text-disabled-text',
  iconSize: 20,
} as const;

export const BadgeToken = {
  container: 'self-start rounded-sm border px-2 py-1',
  text: 'font-data text-overline uppercase',
  tone: {
    primary: { box: 'border-primary/50 bg-primary/10', text: 'text-primary' },
    secondary: { box: 'border-secondary/50 bg-secondary/10', text: 'text-secondary' },
    muted: { box: 'border-disabled bg-disabled/30', text: 'text-ink/70' },
  },
} as const;

export const AvatarToken = {
  container: 'items-center justify-center overflow-hidden rounded-full bg-secondary/15',
  size: {
    sm: { box: 'h-[36px] w-[36px]', text: 'text-body' },
    md: { box: 'h-[44px] w-[44px]', text: 'text-h3' },
    lg: { box: 'h-[96px] w-[96px]', text: 'text-h1' },
  },
  highlight: 'border-2 border-primary',
  image: 'h-full w-full',
  initial: 'font-data uppercase text-secondary',
} as const;

export const ProgressBarToken = {
  container: 'gap-1',
  track: 'h-[6px] overflow-hidden rounded-full bg-disabled',
  fill: 'h-full rounded-full bg-primary',
} as const;

export const NoticeToken = {
  container: 'flex-row items-center gap-2 rounded-sm border-2 p-3',
  tone: {
    error: { box: 'border-danger/60 bg-danger/10', text: 'text-danger' },
    success: { box: 'border-primary/60 bg-primary/10', text: 'text-primary' },
  },
  text: 'flex-1 font-body-medium text-body',
  iconSize: 20,
} as const;

/** Estados de un input (dict_style.md §3.2), compartidos por `Field`, `SearchBar` y el chat. */
export const InputToken = {
  base: 'min-h-[48px] rounded-sm border-2 bg-surface px-3 py-3 font-body text-body text-ink',
  border: {
    default: 'border-disabled',
    focused: 'border-secondary',
    valid: 'border-primary/60',
    error: 'border-danger',
  },
} as const;

export const ChipToken = {
  container: 'min-h-[40px] items-center justify-center rounded-full border-2 px-3 py-2',
  grow: 'flex-1',
  state: {
    selected: 'border-secondary bg-secondary/15',
    default: 'border-disabled active:bg-disabled/40',
  },
  label: 'font-body-semibold text-caption',
  labelState: { selected: 'text-secondary', default: 'text-ink/70' },
} as const;

//moleculas
export const SegmentedToken = {
  container: 'gap-2',
  label: 'font-body-semibold text-body text-ink',
  options: 'flex-row gap-2',
} as const;

export const SearchBarToken = {
  container: 'justify-center',
  input: 'pl-6 pr-6',
  searchIcon: 'absolute left-3',
  clearButton: 'absolute right-3',
  iconSize: 20,
} as const;

export const FieldToken = {
  container: 'gap-2',
  label: 'font-body-semibold text-body text-ink',
  multiline: 'min-h-[96px]',
  error: 'font-body text-caption text-danger',
  hint: 'font-body text-caption text-ink/60',
  /** El *shake* del error: cada paso dura `stepMs` y se mueve a `steps` (px). */
  shake: { stepMs: 50, steps: [-6, 6, -4, 4, 0] },
} as const;

export const CardToken = {
  container: 'rounded-md bg-surface p-3',
  static: 'gap-3',
  pressable: 'flex-row items-center gap-3 active:opacity-80',
  content: 'flex-1 gap-2',
  iconSize: 24,
} as const;

/** Título de tarjeta que comparte la fila con un badge a la derecha. */
export const CardTitleRowToken = {
  container: 'flex-row items-start gap-2',
  title: 'flex-1',
} as const;

export const StatTileToken = {
  container: 'flex-1 gap-1 rounded-md bg-surface p-3',
  highlight: 'border-[1.5px] border-primary',
  pressed: 'active:opacity-80',
  value: 'font-data-black text-display',
  label: 'font-body-semibold text-caption',
  textColor: { default: 'text-ink', highlight: 'text-primary' },
} as const;

export const ChatBubbleToken = {
  row: 'flex-row items-end gap-2',
  rowMine: 'justify-end',
  bubble: 'max-w-[80%] gap-1 rounded-md px-3 py-2',
  bubbleMine: 'rounded-br-sm border border-primary/40 bg-primary/15',
  bubbleOther: 'rounded-bl-sm bg-surface',
  author: 'flex-row items-center gap-2',
  authorName: 'font-body-semibold text-caption text-secondary',
  content: 'font-body text-body text-ink',
  time: 'font-body text-caption text-ink/60',
  timeMine: 'text-right',
} as const;

export const CollectibleCardToken = {
  container: 'flex-1 gap-2 rounded-md border-[1.5px] bg-surface p-2',
  border: { found: 'border-primary', locked: 'border-disabled' },
  imageWrapper: 'aspect-square items-center justify-center overflow-hidden rounded-sm bg-canvas',
  image: 'h-full w-full',
  lockedMark: 'font-data-black text-h1 text-disabled-text',
  iconSize: 40,
  title: 'font-body-semibold text-caption',
  titleColor: { found: 'text-ink', locked: 'text-ink/60' },
  subtitle: 'font-body text-caption text-ink/60',
  points: 'font-data text-overline uppercase',
  pointsColor: { found: 'text-primary', locked: 'text-disabled-text' },
} as const;

export const AvatarEditorToken = {
  container: 'items-center gap-3',
  actions: 'flex-row gap-2',
} as const;

export const EventSelectToken = {
  container: 'flex-row flex-wrap gap-2',
} as const;

//organismos
export const FormScreenToken = {
  container: 'flex-1 bg-canvas',
  content: 'gap-4 p-3 pb-6',
  centered: 'flex-grow justify-center',
  inner: 'w-full max-w-[640px] gap-4 self-center',
} as const;

/** Pantalla con scroll que no es formulario: inicio, perfil, detalle del jugador. */
export const ScrollScreenToken = {
  container: 'flex-1 bg-canvas',
  content: 'gap-4 p-3 pb-6',
} as const;

export const LoadingScreenToken = {
  container: 'flex-1 items-center justify-center bg-canvas',
} as const;

export const ErrorScreenToken = {
  container: 'flex-1 justify-center gap-4 bg-canvas p-3',
  title: 'text-center',
} as const;

export const FormSectionToken = {
  container: 'gap-3 rounded-md bg-surface/60 p-3',
  header: 'gap-1',
} as const;

export const EmptyStateToken = {
  container: 'items-center gap-2 px-4 py-6',
  text: 'text-center',
  iconSize: 48,
} as const;

export const HeaderActionToken = {
  container: 'mr-3 h-[40px] flex-row items-center gap-1 rounded-full bg-primary px-3 active:opacity-80',
  label: 'font-body-bold text-caption text-ink-inverted',
  iconSize: 20,
} as const;

export const DangerZoneToken = {
  container: 'mt-4 gap-3 rounded-md border border-danger/40 p-3',
  title: 'font-body-semibold text-h3 text-danger',
} as const;

export const ListScreenToken = {
  container: 'flex-1 bg-canvas',
  content: 'gap-3 p-3 pb-6',
  header: 'gap-3 pb-1',
} as const;

export const HunterCardToken = {
  container: 'gap-3 rounded-md border-[1.5px] border-primary bg-canvas p-3',
  brand: 'font-data-black text-h2 text-primary',
  brandGlowRadius: 12,
  identity: 'flex-row items-center gap-3',
  identityText: 'flex-1 gap-1',
  nickname: 'font-data text-h3 text-ink',
  level: 'font-body text-caption text-secondary',
  row: 'flex-row gap-2',
  slogan: 'font-body text-caption text-ink/60',
  figure: 'flex-1 items-center rounded-sm bg-surface p-2',
  figureValue: 'font-data-black text-h2 text-primary',
  figureLabel: 'font-body text-caption text-ink/70',
} as const;

export const TagQrToken = {
  container: 'items-center gap-2 self-center rounded-md bg-ink p-3',
  qrSize: 200,
  code: 'font-data text-h3 text-ink-inverted',
} as const;

/** Diálogo propio que reemplaza a `Alert.alert` y al `confirm` del navegador. */
export const AlertToken = {
  overlay: 'flex-1 items-center justify-center bg-canvas/80 p-3',
  backdrop: 'absolute inset-0',
  card: 'w-full max-w-[400px] items-center gap-3 rounded-md border-[1.5px] bg-surface p-4',
  icon: 'h-[56px] w-[56px] items-center justify-center rounded-full',
  iconSize: 32,
  title: 'text-center font-data text-h2 text-ink',
  message: 'text-center font-body text-body text-ink/70',
  actions: 'w-full flex-row gap-2 pt-2',
  button: 'flex-1',
  tone: {
    danger: { border: 'border-danger', icon: 'bg-danger/15', iconName: 'alert-octagon-outline' },
    success: { border: 'border-primary', icon: 'bg-primary/15', iconName: 'check-circle-outline' },
    info: { border: 'border-secondary', icon: 'bg-secondary/15', iconName: 'information-outline' },
  },
  /** Entrada: crece desde `fromScale` en `durationMs`, sin rebote (dict_style.md §0). */
  enter: { fromScale: 0.92, durationMs: 180 },
  enterWrapper: { width: '100%', alignItems: 'center' },
} as const;

//pantallas
/** Ingreso y registro: la marca arriba y el enlace para cambiar de una a otra. */
export const AuthToken = {
  header: 'items-center gap-2 py-5',
  brand: 'font-data-black text-display text-primary',
  brandGlowRadius: 16,
  slogan: 'text-center',
  switchLink: 'items-center py-2',
  switchText: 'font-body text-body text-ink/70',
  switchAction: 'font-body-semibold text-secondary',
} as const;

export const AdminPanelToken = {
  greeting: 'gap-1',
  stats: 'flex-row gap-2',
  section: 'gap-3',
  eventName: 'font-body-semibold text-h3 text-ink',
} as const;

export const AdminProfileToken = {
  header: 'items-center gap-2 py-3',
  name: 'text-center',
} as const;

export const PlayerProfileToken = {
  header: 'items-center gap-2',
  name: 'text-center',
  stats: 'flex-row gap-2',
  section: 'gap-3',
  sectionHeader: 'flex-row items-baseline justify-between',
  album: 'flex-row flex-wrap gap-3',
  albumItem: 'w-[47%]',
} as const;

export const ScanToken = {
  intro: 'items-center gap-3 py-4',
  introIcon: 'h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-primary bg-surface',
  introIconSize: 64,
  centered: 'text-center',
} as const;

export const ScanCameraToken = {
  container: 'flex-1 bg-canvas',
  overlay: 'absolute inset-0 items-center justify-center gap-4 p-4',
  frame: 'h-[240px] w-[240px] rounded-md border-2 border-primary',
  hint: 'rounded-full bg-canvas/80 px-3 py-2 font-body-semibold text-body text-ink',
  cancel: 'absolute bottom-4 left-3 right-3',
} as const;

export const ScanRewardToken = {
  result: 'items-center gap-1',
  points: 'font-data-black text-display text-primary',
  pointsGlowRadius: 16,
  card: 'w-[220px] self-center',
  funFact: 'gap-1 rounded-md bg-surface p-3',
  funFactTitle: 'font-body-semibold text-body text-secondary',
} as const;

export const RankingToken = {
  filters: 'gap-2',
} as const;

export const RankingRowToken = {
  container: 'flex-row items-center gap-3 rounded-md bg-surface p-3',
  me: 'border-[1.5px] border-primary',
  position: 'w-[40px] text-center font-data-black',
  positionSize: { podium: 'text-h1', rest: 'text-h3' },
  positionColor: { first: 'text-primary', podium: 'text-secondary', rest: 'text-ink/60' },
  info: 'flex-1 gap-1',
  nickname: 'font-body-semibold text-h3 text-ink',
  points: 'font-data text-h3 text-primary',
} as const;

export const RoomCardToken = {
  identity: 'flex-row items-center gap-3',
  icon: 'h-[44px] w-[44px] items-center justify-center rounded-full bg-secondary/15',
  iconSize: 24,
  identityText: 'flex-1 gap-1',
} as const;

export const ChatRoomToken = {
  container: 'flex-1 bg-canvas',
  list: 'flex-1',
  listContent: 'gap-2 p-3',
  composer: 'gap-2 border-t border-disabled bg-surface p-3',
  /** Mínimo bajo el compositor cuando el teléfono no tiene zona segura abajo. */
  composerMinBottom: 16,
} as const;

export const ChatComposerToken = {
  container: 'flex-row items-end gap-2',
  input: 'flex-1',
  inputMaxHeight: 'max-h-[120px]',
  send: 'h-[48px] w-[48px] items-center justify-center rounded-full',
  sendState: { active: 'bg-primary active:opacity-80', disabled: 'bg-disabled' },
  sendIconSize: 22,
} as const;

export const UserCardToken = {
  identity: 'flex-row items-center gap-3',
  identityText: 'flex-1 gap-1',
  meta: 'flex-row flex-wrap items-center gap-2',
  points: 'font-data text-caption text-primary',
} as const;

export const TagCardToken = {
  code: 'font-data text-overline uppercase text-secondary',
  badges: 'flex-row flex-wrap gap-2',
} as const;

export const PlayerTagCardToken = {
  badges: 'flex-row flex-wrap gap-2',
  clue: 'flex-row gap-2 rounded-sm bg-secondary/10 p-2',
  clueText: 'flex-1 font-body text-body text-secondary',
  iconSize: 18,
} as const;

export const PlayerEventDetailToken = {
  actions: 'gap-3',
  dateRow: 'flex-row items-center gap-2',
  dateLabel: 'font-body-semibold text-body text-ink',
  iconSize: 18,
} as const;
