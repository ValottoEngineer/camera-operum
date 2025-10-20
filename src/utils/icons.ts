import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export type IconName = keyof typeof Ionicons.glyphMap;

export const iconSizes = {
  small: 20,
  medium: 24,
  large: 32,
} as const;

export const iconColors = {
  primary: theme.colors.neon.electric,
  secondary: theme.colors.neon.purple,
  accent: theme.colors.neon.ion,
  success: theme.colors.success,
  error: theme.colors.error,
  warning: theme.colors.warning,
  info: theme.colors.info,
  neutral: theme.colors.neutral.primary,
  light: theme.colors.neutral.secondary,
  surface: theme.colors.surface,
} as const;

// Mapeamento de ícones por contexto - usando nomes corretos do Expo Vector Icons
export const iconMap = {
  // Navegação
  back: 'arrow-back' as IconName,
  forward: 'arrow-forward' as IconName,
  close: 'close' as IconName,
  menu: 'menu' as IconName,
  
  // Ações
  search: 'search' as IconName,
  filter: 'filter' as IconName,
  sort: 'swap-vertical' as IconName,
  refresh: 'refresh' as IconName,
  add: 'add' as IconName,
  remove: 'remove' as IconName,
  edit: 'create' as IconName,
  delete: 'trash' as IconName,
  save: 'save' as IconName,
  share: 'share' as IconName,
  
  // Financeiro
  calculator: 'calculator' as IconName,
  chart: 'bar-chart' as IconName,
  trendingUp: 'trending-up' as IconName,
  trendingDown: 'trending-down' as IconName,
  wallet: 'wallet' as IconName,
  card: 'card' as IconName,
  cash: 'cash' as IconName,
  
  // Social/Interação
  heart: 'heart' as IconName,
  heartOutline: 'heart-outline' as IconName,
  star: 'star' as IconName,
  starOutline: 'star-outline' as IconName,
  bookmark: 'bookmark' as IconName,
  bookmarkOutline: 'bookmark-outline' as IconName,
  like: 'thumbs-up' as IconName,
  dislike: 'thumbs-down' as IconName,
  
  // Perfil/Usuário
  person: 'person' as IconName,
  personOutline: 'person-outline' as IconName,
  settings: 'settings' as IconName,
  notifications: 'notifications' as IconName,
  notificationsOutline: 'notifications-outline' as IconName,
  
  // Informação
  info: 'information-circle' as IconName,
  infoOutline: 'information-circle-outline' as IconName,
  help: 'help-circle' as IconName,
  helpOutline: 'help-circle-outline' as IconName,
  warning: 'warning' as IconName,
  alert: 'alert-circle' as IconName,
  
  // Status
  checkmark: 'checkmark' as IconName,
  checkmarkCircle: 'checkmark-circle' as IconName,
  checkmarkCircleOutline: 'checkmark-circle-outline' as IconName,
  closeCircle: 'close-circle' as IconName,
  closeCircleOutline: 'close-circle-outline' as IconName,
  
  // Mídia
  play: 'play' as IconName,
  pause: 'pause' as IconName,
  stop: 'stop' as IconName,
  image: 'image' as IconName,
  camera: 'camera' as IconName,
  mic: 'mic' as IconName,
  micOff: 'mic-off' as IconName,
  
  // Comum
  home: 'home' as IconName,
  list: 'list' as IconName,
  grid: 'grid' as IconName,
  eye: 'eye' as IconName,
  eyeOff: 'eye-off' as IconName,
  lock: 'lock-closed' as IconName,
  lockOpen: 'lock-open' as IconName,
  key: 'key' as IconName,
  mail: 'mail' as IconName,
  phone: 'call' as IconName,
  globe: 'globe' as IconName,
  link: 'link' as IconName,
  copy: 'copy' as IconName,
  download: 'download' as IconName,
  upload: 'upload' as IconName,
} as const;

// Função helper para obter ícone por nome
export const getIcon = (name: keyof typeof iconMap): IconName => {
  return iconMap[name];
};

// Função helper para obter cor por contexto
export const getIconColor = (context: keyof typeof iconColors) => {
  return iconColors[context];
};

// Função helper para obter tamanho por nome
export const getIconSize = (size: keyof typeof iconSizes) => {
  return iconSizes[size];
};
