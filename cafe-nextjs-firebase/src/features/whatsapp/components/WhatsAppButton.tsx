import { ButtonLink, type ButtonSize, type ButtonVariant } from '@/components/ui/Button';
import { ChatIcon } from '@/components/ui/icons';
import { getWhatsAppHref, type WhatsAppTemplateKey } from '../lib/messages';

interface WhatsAppButtonProps {
  template?: WhatsAppTemplateKey;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: string;
}

/** Click-to-chat button. Renders nothing when no WhatsApp number is configured. */
export function WhatsAppButton({
  template = 'general',
  variant = 'accent',
  size = 'md',
  className,
  children = 'Message us on WhatsApp',
}: WhatsAppButtonProps) {
  const href = getWhatsAppHref(template);
  if (!href) return null;

  return (
    <ButtonLink href={href} variant={variant} size={size} className={className}>
      <ChatIcon />
      {children}
    </ButtonLink>
  );
}
