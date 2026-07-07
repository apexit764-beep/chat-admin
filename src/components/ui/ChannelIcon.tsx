import {
  MessageSquare,
  Facebook,
  Instagram,
  Send as TelegramIcon,
  Twitter,
  Globe,
  Mail,
} from 'lucide-react';
import type { ChannelType } from '@/types';
import { cn } from '@/utils/cn';

interface Props {
  type: ChannelType;
  size?: number;
  className?: string;
}

const map: Record<ChannelType, { icon: typeof MessageSquare; color: string; bg: string; label: string }> = {
  whatsapp: { icon: MessageSquare, color: 'text-whatsapp', bg: 'bg-whatsapp/10', label: 'WhatsApp' },
  messenger: { icon: Facebook, color: 'text-[#0084FF]', bg: 'bg-[#0084FF]/10', label: 'Messenger' },
  instagram: { icon: Instagram, color: 'text-[#E4405F]', bg: 'bg-[#E4405F]/10', label: 'Instagram' },
  telegram: { icon: TelegramIcon, color: 'text-[#0088CC]', bg: 'bg-[#0088CC]/10', label: 'Telegram' },
  x: { icon: Twitter, color: 'text-[#111]', bg: 'bg-[#111]/10', label: 'X' },
  widget: { icon: Globe, color: 'text-primary', bg: 'bg-primary/10', label: 'Live Chat' },
  email: { icon: Mail, color: 'text-muted-light', bg: 'bg-bg-light', label: 'Email' },
};

export function ChannelIcon({ type, size = 16, className }: Props): JSX.Element {
  const item = map[type];
  const Icon = item.icon;
  return (
    <span className={cn('inline-flex items-center justify-center rounded-lg', item.bg, item.color, className)} style={{ width: size + 16, height: size + 16 }}>
      <Icon style={{ width: size, height: size }} />
    </span>
  );
}

export function channelLabel(type: ChannelType): string {
  return map[type].label;
}

export function channelColor(type: ChannelType): string {
  return map[type].color;
}
