'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/format';
import { siteConfig } from '@/config/site';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalAmountMinor,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const getWhatsAppOrderUrl = () => {
    const orderLines = items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.name} - ${formatPrice(i.priceMinor * i.quantity, siteConfig.currency, siteConfig.locale)}`,
      )
      .join('\n');
    const totalStr = formatPrice(totalAmountMinor, siteConfig.currency, siteConfig.locale);
    const message = `Hello ${siteConfig.name}! I would like to order the following items for pickup:\n\n${orderLines}\n\nTotal: ${totalStr}\n\nPlease confirm availability and pickup time.`;
    return `https://wa.me/${siteConfig.whatsapp.number || '11234567890'}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#120D0A]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] border-l border-[#E5DDD1] shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DDD1] px-5 py-4 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#1C1510] text-[#C47935]">
              <ShoppingBag className="size-4" />
            </div>
            <h2 id="cart-drawer-title" className="font-editorial text-lg font-bold text-[#1C1510]">
              Your Cart ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-1.5 text-[#6B5E52] hover:bg-[#F4EFE6] hover:text-[#1C1510] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#F4EFE6] text-[#C47935] mb-3">
                <ShoppingBag className="size-7" />
              </div>
              <p className="font-editorial text-lg font-bold text-[#1C1510]">Your cart is empty</p>
              <p className="mt-1 text-xs text-[#6B5E52] max-w-xs">
                Explore our handcrafted coffee, fresh bakes, and breakfast specials to add items.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E5DDD1] bg-white p-3 shadow-2xs"
                >
                  {item.imageUrl ? (
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#F4EFE6]">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-editorial text-sm font-bold text-[#1C1510] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#C47935]">
                      {formatPrice(item.priceMinor, siteConfig.currency, siteConfig.locale)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-md border border-[#E5DDD1] bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex size-6 items-center justify-center text-[#6B5E52] hover:text-[#1C1510] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#1C1510]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex size-6 items-center justify-center text-[#6B5E52] hover:text-[#1C1510] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[#9C8F80] hover:text-red-700 transition-colors p-1 cursor-pointer"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5DDD1] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5E52]">
                Subtotal ({totalCount} items)
              </span>
              <span className="font-editorial text-lg font-bold text-[#1C1510]">
                {formatPrice(totalAmountMinor, siteConfig.currency, siteConfig.locale)}
              </span>
            </div>

            <p className="text-[11px] text-[#6B5E52]">
              Taxes calculated at pickup. Tap below to send this order directly to our barista team via WhatsApp.
            </p>

            <a
              href={getWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <MessageSquare className="size-4" />
              <span>Checkout via WhatsApp</span>
            </a>

            <div className="flex justify-between items-center pt-1 text-xs">
              <button
                type="button"
                onClick={clearCart}
                className="text-[#9C8F80] hover:text-[#1C1510] underline cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="font-bold text-[#1C1510] hover:text-[#C47935] cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
