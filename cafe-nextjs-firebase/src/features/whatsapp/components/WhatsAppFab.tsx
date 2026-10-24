import { ChatIcon } from '@/components/ui/icons';
import { getWhatsAppHref } from '../lib/messages';

/** Floating chat button for small screens. Renders nothing when WhatsApp is not configured. */
export function WhatsAppFab() {
  const href = getWhatsAppHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all duration-300 hover:bg-emerald-700 hover:scale-105 active:scale-95 md:hidden"
    >
      <ChatIcon width={26} height={26} />
      <span className="sr-only">Chat with us on WhatsApp (opens in a new tab)</span>
    </a>
  );
}
